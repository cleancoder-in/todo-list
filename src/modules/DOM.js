import TaskManager from "./TaskManager.js";
import Modal from "./Modal.js";
import Helper from "./Helper.js";
import { format } from "date-fns";
import Storage from "./Storage.js";

export default class DOM {
  static isPopupAvailable = false;

  static renderTaskList(list) {
    const taskListEl = document.querySelector(".task-list");
    taskListEl.innerHTML = "";
    if (list.length) {
      list.forEach((item) => {
        taskListEl.appendChild(this.createTask(item));
        if (item.priority === "high") {
          Helper.showStarIcon(item.id);
        }
      });
      Helper.markCompletedTasks();
    }
    Storage.savePageTitle();
  }
  static renderProjectList(list) {
    const projectListEl = document.querySelector(".project-list");
    projectListEl.innerHTML = "";

    list.forEach((item) => {
      if (item.name !== "Inbox") {
        projectListEl.appendChild(this.createProject(item));
      }
    });
  }
  static renderFilteredTaskList(value, filter) {
    const taskListEl = document.querySelector(".task-list");
    taskListEl.innerHTML = "";
    TaskManager.projectList.forEach((project) => {
      project.taskList.forEach((item) => {
        if (filter === "date") {
          const result = Helper.compareWithTodayDate(item.dueDate);
          if (result === value || result === 1) {
            taskListEl.appendChild(this.createTask(item, true, result));
            if (item.priority === "high") {
              Helper.showStarIcon(item.id);
            }
          }
        }
        if (filter === "priority") {
          if (item.priority === "high") {
            taskListEl.appendChild(this.createTask(item, true));
            Helper.showStarIcon(item.id);
          }
        }

        if (filter === "title") {
          if (item.title.match(value)) {
            taskListEl.appendChild(this.createTask(item, true));
            if (item.priority === "high") {
              Helper.showStarIcon(item.id);
            }
          }
        }
      });
    });
    Helper.markCompletedTasks();
    Storage.savePageTitle();
  }

  // Task DOM
  static addTaskBtnHandler() {
    Modal.openTaskModal("add");
  }
  static createTask(obj, showProject = false, result = null) {
    let hideProjectName,
      hideOverdueSpan = "hide";
    let { id, title, desc, dueDate, priority, project, taskCompleted } = obj;
    if (result === 1) hideOverdueSpan = "";
    dueDate = dueDate ? format(dueDate, "MMM dd") : "";
    if (!showProject) hideProjectName = "hide";
    const task = document.createElement("li");
    task.classList.add("task");
    task.setAttribute("id", id);
    task.setAttribute("data-project", project);
    task.setAttribute("data-completed", taskCompleted);
    task.innerHTML = `
                        <div class="task-box">
                            <div class="checkbox">
                              <input type="checkbox">
                              <span class="checkmark"></span> 
                            </div>
                            <div class="task-data">
                              <div class="row-one">
                                <div class="info">
                                  <p class="title"> ${title}</p>
                                  <p class="desc">${desc}</p>
                                </div>
                                <div class="icons">
                                  <div class="star hide">
                                    <i class="fa-solid fa-star"></i>
                                  </div>
                                  <div class="cta">
                                    <i class="fa-regular fa-pen-to-square edit icon hide"></i>
                                    <i class="fa-solid fa-trash trash icon hide"></i>
                                  </div>                                  
                                </div>
                              </div>
                               <div class="row-two">
                                <p class="due-date">${dueDate} <span class="${hideOverdueSpan}">[Overdue]</span></p>
                                <p class="project ${hideProjectName}">${project}</p>
                              </div>
                            </div>
                            
                        </div>
                        
  `;
    return task;
  }
  static taskModalHandler(e) {
    let taskObj;
    const inputValue = document.querySelector(".task-name").value;
    // cancel btn
    if (e.target.value === "cancel") {
      this.processTask("cancel");
      // add btn
    } else if (e.target.value === "add" && inputValue !== "") {
      e.preventDefault();
      taskObj = Helper.getDetailsFromTaskModal("newTask");
      this.processTask("add", taskObj);
      //edit btn
    } else if (e.target.value === "edit") {
      e.preventDefault();
      const defaultProjectName = e.target.dataset.project;
      taskObj = Helper.getDetailsFromTaskModal("editTask");
      this.processTask("edit", taskObj, defaultProjectName);
    }
  }
  static processTask(taskType, taskObj = null, defaultProjectName = null) {
    if (taskType === "add") TaskManager.addTask(taskObj);
    if (taskType === "edit") TaskManager.editTask(taskObj, defaultProjectName);
    Modal.closeTaskModal();
    const activePage = Helper.getPageTitle()[1];
    if (activePage === "Today") this.renderFilteredTaskList(0, "date");
    else if (activePage === "Upcoming") this.renderFilteredTaskList(-1, "date");
    else if (activePage === "Important")
      this.renderFilteredTaskList(null, "priority");
    else if (activePage.startsWith("Search")) {
      const searchText = Helper.extractSearchValue(activePage);
      DOM.renderFilteredTaskList(searchText, "title");
    } else {
      const activeProject = Helper.getActiveProject();
      this.renderTaskList(activeProject.taskList);
    }
  }
  static taskItemHandler(e) {
    if (e.target.matches("input[type='checkbox']")) {
      const checkboxInputEl = e.target;
      const liElem = e.target.parentElement.parentElement.parentElement;
      const liElemID = liElem.getAttribute("id");
      const liElemProjectName = liElem.dataset.project;
      const liElemTitle = liElem.querySelector(".title");
      const liElemDesc = liElem.querySelector(".desc");
      if (checkboxInputEl.checked) {
        liElemTitle.classList.add("line-through");
        liElemDesc.classList.add("line-through");
        liElem.dataset.completed = true;
        TaskManager.updateTaskCompletedFlag(liElemID, liElemProjectName, true);
      } else {
        liElemTitle.classList.remove("line-through");
        liElemDesc.classList.remove("line-through");
        liElem.dataset.completed = false;
        TaskManager.updateTaskCompletedFlag(liElemID, liElemProjectName, false);
      }
    }
    if (e.target.matches(".task-list .icons i")) {
      const liElem =
        e.target.parentElement.parentElement.parentElement.parentElement
          .parentElement.parentElement;
      const liElemID = liElem.getAttribute("id");
      const liElemProjectName = liElem.dataset.project;
      const taskObj = Helper.getActiveTask(liElemID, liElemProjectName);
      if (e.target.classList.contains("edit")) {
        const taskModalEl = document.querySelector(".task-modal");
        if (!taskModalEl) {
          Modal.openTaskModal("edit", liElem);
          Helper.addDetailsToTaskModal(taskObj);
        }
      }
      if (e.target.classList.contains("trash")) {
        TaskManager.deleteTask(taskObj);
        const activePage = Helper.getPageTitle()[1];
        if (activePage === "Today") this.renderFilteredTaskList(0, "date");
        else if (activePage === "Upcoming")
          this.renderFilteredTaskList(-1, "date");
        else {
          const activeProject = Helper.getActiveProject();
          this.renderTaskList(activeProject.taskList);
        }
      }
    }
  }

  // project DOM
  static addProjectBtnHandler() {
    Modal.closeTaskModal();
    Modal.openProjectModal("add");
  }
  static createProject(obj) {
    const projectItem = document.createElement("li");
    projectItem.setAttribute("data-id", obj.id);
    projectItem.innerHTML = ` <div class="pop-up hide">
                                  <button value="edit">Edit</button>
                                  <button value="delete">Delete</button>
                              </div>
                              <p>
                                <span class="hash" style="color:${obj.color[0]}">#</span>
                                <span>${obj.name}</span>
                              </p>
                              <span><i class="fa-solid fa-ellipsis-vertical ellipsis"></i></span>`;
    return projectItem;
  }
  static projectModalHandler(e) {
    if (e.target.matches(".close, .cancel, .project-modal")) {
      const pModalTitle = document.querySelector(".project-modal .title")
        .textContent;
      if (pModalTitle.includes("edit")) {
        Modal.closeProjectModal("edit");
      } else {
        Modal.closeProjectModal();
      }
    }
    if (e.target.matches("#colorBtn, #colorBtn p, .color, .color-text")) {
      const dropdownContent = document.querySelector(".dropdown-content");
      dropdownContent.classList.toggle("hide");
    }
    if (e.target.value === "add") {
      const projectObj = Helper.getDetailsFromProjectModal("newProject");
      if (projectObj.name === "") {
        document.querySelector("#projectName").classList.add("highlight-red");
        return;
      }
      if (Helper.isProjectExisted(projectObj.name)) {
        Modal.closeProjectModal();
        alert("Same project already existed, try some other name.");
        return;
      }
      TaskManager.addProject(projectObj);
      Modal.closeProjectModal();
      DOM.renderProjectList(TaskManager.projectList);
    }
    if (e.target.value === "edit") {
      const projectObj = Helper.getDetailsFromProjectModal("editProject");
      if (projectObj.name === "") {
        document.querySelector("#projectName").classList.add("highlight");
        return;
      }
      TaskManager.editProject(projectObj);
      Modal.closeProjectModal("edit");
      DOM.renderProjectList(TaskManager.projectList);
    }
  }
  static dropdownContentHandler(e) {
    let colorDetailsArr;
    if (e.target.nodeName === "SPAN") {
      colorDetailsArr = JSON.parse(e.target.parentElement.dataset.value);
    }
    if (e.target.nodeName === "LI") {
      colorDetailsArr = JSON.parse(e.target.dataset.value);
    }
    const dropdownContent = document.querySelector(".dropdown-content");
    const colorSpanEl = document.querySelector("#colorBtn p .color");
    const colorTextSpanEl = document.querySelector("#colorBtn p .color-text");

    colorSpanEl.style.backgroundColor = colorDetailsArr[0];
    colorTextSpanEl.textContent = colorDetailsArr[1];
    dropdownContent.classList.add("hide");
  }
  static projectItemHandler(e, elType) {
    if (elType === "li") {
      this.findAndCloseProjectItemPopup();
      let projectName, activeProject;
      if (e.target.nodeName === "LI") {
        projectName = e.target.children[1].lastElementChild.textContent;
      } else if (e.target.matches(".hash")) {
        projectName = e.target.nextElementSibling.textContent;
      } else {
        projectName = e.target.textContent;
      }
      Helper.setPageTitle(projectName, true);
      activeProject = Helper.getActiveProject();
      this.renderTaskList(activeProject.taskList);
    }
    if (elType === "ellipsis") {
      let item = e.target.parentElement.parentElement;
      let itemPopup = item.querySelector(".pop-up");

      if (this.isPopupAvailable) {
        if (!itemPopup.matches(".hide")) {
          this.closeProjectItemPopup(item);
          return;
        } else {
          this.findAndCloseProjectItemPopup();
        }
      }
      if (!this.isPopupAvailable) {
        this.openProjectItemPopup(item);
      }
    }
  }
  static openProjectItemPopup(liElem) {
    let popupEl = liElem.firstElementChild;
    popupEl.classList.remove("hide");
    liElem.classList.add("highlight-brown");
    liElem.lastChild.firstChild.style.color = "saddlebrown";
    this.isPopupAvailable = true;
  }
  static closeProjectItemPopup(liElem) {
    let popupEl = liElem.firstElementChild;
    popupEl.classList.add("hide");
    liElem.classList.remove("highlight-brown");
    liElem.lastElementChild.firstElementChild.removeAttribute("style");
    this.isPopupAvailable = false;
  }
  static findAndCloseProjectItemPopup() {
    const projects = document.querySelectorAll(".project-list li");
    projects.forEach((item) => {
      if (!item.firstElementChild.matches(".hide")) {
        this.closeProjectItemPopup(item);
      }
    });
  }
  static projectItemPopupHandler(e) {
    let popupEl = e.target.parentElement;
    const selectedProjectItem = e.target.parentElement.parentElement;
    const selectedProjectItemID = selectedProjectItem.dataset.id;
    const projectObj = TaskManager.projectList.find(
      (item) => item.id === selectedProjectItemID
    );
    if (e.target.value === "edit") {
      popupEl.classList.add("hide");
      Modal.openProjectModal("edit");
      Helper.addDetailsToProjectModal(projectObj);
    }
    if (e.target.value === "delete") {
      let confirmVal = confirm("Do you really want to delete it?");
      if (confirmVal) {
        let pageTitleId = Helper.getPageTitle()[0];
        TaskManager.deleteProject(projectObj);
        this.isPopupAvailable = false;
        this.renderProjectList(TaskManager.projectList);
        if (pageTitleId === selectedProjectItemID) {
          Helper.setPageTitle("Inbox", true);
          this.renderTaskList(TaskManager.projectList[0].taskList);
        }
      } else {
        this.closeProjectItemPopup(selectedProjectItem);
      }
    }
  }
}

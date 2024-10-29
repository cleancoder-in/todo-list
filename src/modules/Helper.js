import TaskManager from "./TaskManager.js";
import Project from "./Project.js";
import Task from "./Task.js";
import { format, compareAsc } from "date-fns";

export default class Helper {
  static getId() {
    return Math.random().toString(36).substring(2, 11);
  }
  static hideAddTaskBtn() {
    const addTaskBtn = document.querySelector(".addTaskBtn");
    addTaskBtn.classList.add("hide");
  }
  static showAddTaskBtn() {
    const addTaskBtn = document.querySelector(".addTaskBtn");
    addTaskBtn.classList.remove("hide");
  }
  static setPageTitle(value, isProject) {
    const pageTitleEl = document.querySelector(".page-title");
    if (isProject) {
      const project = this.getProject(value);
      pageTitleEl.setAttribute("data-id", project.id);
      pageTitleEl.textContent = value;
    } else {
      pageTitleEl.setAttribute("data-id", "");
      pageTitleEl.textContent = value;
    }
  }
  static getPageTitle() {
    const pageTitleEl = document.querySelector(".page-title");
    const id = pageTitleEl.dataset.id;
    const pageName = pageTitleEl.textContent;
    const pageTitle = [id, pageName];
    return pageTitle;
  }
  static getProject(projectName) {
    const projectObj = TaskManager.projectList.find((project) => {
      if (project.name === projectName) {
        return project;
      }
    });
    return projectObj;
  }
  static getActiveProject() {
    const pageTitleEl = document.querySelector(".page-title");
    const activeProjectId = pageTitleEl.dataset.id;
    const projectItem = TaskManager.projectList.find((project) => {
      if (project.id === activeProjectId) {
        return project;
      }
    });
    return projectItem;
  }
  static getActiveTask(itemId, itemProjectName) {
    const project = Helper.getProject(itemProjectName);
    const activeTaskObj = project.taskList.find((item) => {
      if (item.id === itemId) {
        return item;
      }
    });
    return activeTaskObj;
  }
  static editTaskInTaskList(taskObj, list) {
    list.map((item) => {
      if (item.id === taskObj.id) {
        item.title = taskObj.title;
        item.desc = taskObj.desc;
        item.dueDate = taskObj.dueDate;
        item.priority = taskObj.priority;
        item.project = taskObj.project;
      }
    });
  }

  static compareWithTodayDate(date) {
    if (date) {
      const todayDate = format(new Date(), "yyyy-MM-dd");
      const year1 = todayDate.split("-")[0];
      const month1 = todayDate.split("-")[1];
      const day1 = todayDate.split("-")[2];

      const year2 = date.split("-")[0];
      const month2 = date.split("-")[1];
      const day2 = date.split("-")[2];

      return compareAsc(
        new Date(year1, month1, day1),
        new Date(year2, month2, day2)
      );
    } else {
      return null;
    }
  }

  static initializeProjectList(list = null) {
    if (list) {
      TaskManager.projectList = list;
    } else {
      const inbox = new Project("", "Inbox", ["#36454F", "charcoal"]);
      TaskManager.projectList = inbox;
    }
  }

  static getDetailsFromTaskModal(type) {
    let taskObj,
      id = "";
    const title = document.querySelector(".task-name").value;
    const desc = document.querySelector("textarea").value;
    const dueDate = document.getElementById("dueDate").value;
    const priority = document.getElementById("priority").value;
    const project = document.getElementById("project").value;

    if (type === "newTask") {
      taskObj = new Task(id, title, desc, dueDate, priority, project);
    }
    if (type === "editTask") {
      const id = document.querySelector(".task-modal").getAttribute("id");
      taskObj = { id, title, desc, dueDate, priority, project };
    }
    return taskObj;
  }
  static addDetailsToTaskModal(taskObj) {
    document.querySelector(".task-modal").setAttribute("id", taskObj.id);
    document.querySelector(".task-name").value = taskObj.title;
    document.querySelector("textarea").value = taskObj.desc;
    document.getElementById("dueDate").value = taskObj.dueDate;
    document.getElementById("priority").value = taskObj.priority;
    document.getElementById("project").value = taskObj.project;
  }
  static addDetailsToProjectModal(projectObj) {
    document.querySelector(".color").removeAttribute("style");
    document.getElementById("projectName").value = projectObj.name;
    document.querySelector(".color").style.backgroundColor =
      projectObj.color[0];
    document.querySelector(".color-text").textContent = projectObj.color[1];
  }
  static getDetailsFromProjectModal(type) {
    let projectObj,
      id = "";
    const projectName = document.querySelector("#projectName").value;
    const projectColor = document.querySelector("#colorBtn .color").style
      .backgroundColor;
    const projectColorText = document.querySelector("#colorBtn .color-text")
      .textContent;
    const projectColorArr = [projectColor, projectColorText];
    if (type === "newProject") {
      projectObj = new Project(id, projectName, projectColorArr);
    }
    if (type === "editProject") {
      const id = document.querySelector(".highlight-brown").dataset.id;
      projectObj = { id, projectName, projectColorArr };
    }
    return projectObj;
  }
  static showStarIcon(id) {
    const liElem = document.getElementById(id);
    const starIconEl = liElem.querySelector(".star");
    starIconEl.classList.remove("hide");
  }
  static markCompletedTasks() {
    const liElems = document.querySelectorAll(".task");
    liElems.forEach((liElem) => {
      if (liElem.dataset.completed === "true") {
        const liElemTitle = liElem.querySelector(".title");
        const liElemDesc = liElem.querySelector(".desc");
        const liCheckboxInputEl = liElem.querySelector(".checkbox input");
        liCheckboxInputEl.checked = true;
        liElemTitle.classList.add("line-through");
        liElemDesc.classList.add("line-through");
      }
    });
  }
  static getSearchedTasks(searchText) {
    let filteredTaskList = [];
    TaskList.projectList.forEach((project) => {
      project.taskList.forEach((task) => {
        if (task.title.includes("searchText")) {
          filteredTaskList.push(task);
        }
      });
    });
    return filteredTaskList;
  }
  static extractSearchValue(text) {
    return text.split('"')[1];
  }
  static isProjectExisted(projectName) {
    return TaskManager.projectList.find(
      (project) => project.name === projectName
    );
  }
}

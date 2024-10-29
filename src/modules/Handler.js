import Storage from "./Storage.js";
import TaskManager from "./TaskManager.js";
import DOM from "./DOM.js";
import Helper from "./Helper.js";
import Modal from "./Modal.js";

export default class Handler {
  static globalHandler() {
    window.addEventListener("DOMContentLoaded", () => {
      const storedProjectList = Storage.getProjectList();
      if (storedProjectList.length) {
        Helper.initializeProjectList(storedProjectList);
        const pageTitle = Storage.getPageTitle();
        if (pageTitle[0]) {
          Helper.setPageTitle(pageTitle[1], true);
        } else {
          Helper.setPageTitle(pageTitle[1], false);
        }
        if (pageTitle[1] === "Today") DOM.renderFilteredTaskList(0, "date");
        else if (pageTitle[1] === "Upcoming")
          DOM.renderFilteredTaskList(-1, "date");
        else if (pageTitle[1] === "Important")
          DOM.renderFilteredTaskList(null, "priority");
        else if (pageTitle[1].startsWith("Search")) {
          const searchText = Helper.extractSearchValue(pageTitle[1]);
          DOM.renderFilteredTaskList(searchText, "title");
        } else {
          const project = Helper.getProject(pageTitle[1]);
          DOM.renderTaskList(project.taskList);
        }

        // const inboxTaskList = storedProjectList[0].taskList;
        // DOM.renderTaskList(inboxTaskList);
        DOM.renderProjectList(storedProjectList);
      }
    });
    const addTaskBtn = document.querySelector(".addTaskBtn");
    addTaskBtn.addEventListener("click", DOM.addTaskBtnHandler);

    const addProjectBtn = document.querySelector(".addProjectBtn");
    addProjectBtn.addEventListener("click", DOM.addProjectBtnHandler);

    const clearTasksBtn = document.querySelector(".title-bar button");
    clearTasksBtn.addEventListener("click", () => {
      TaskManager.clearCompletedTasks.call(TaskManager);
    });

    // task-modal and task-item handler
    const taskListWrapperEl = document.querySelector(".task-list-wrapper");
    taskListWrapperEl.addEventListener("click", (e) => {
      if (e.target.matches(".task-modal .btn")) {
        DOM.taskModalHandler(e);
      }
      if (
        e.target.matches(".task-list .icons i") ||
        e.target.matches("input[type='checkbox']")
      ) {
        DOM.taskItemHandler(e);
      }
    });
    //project-modal handler
    document.body.addEventListener("click", (e) => {
      if (!e.target.matches("li, li span .ellipsis")) {
        DOM.findAndCloseProjectItemPopup();
      }
      if (
        e.target.matches(".project-modal, .close, .cancel") ||
        e.target.matches("#colorBtn, #colorBtn p, .color, .color-text") ||
        e.target.matches(".project-modal .btn")
      ) {
        DOM.projectModalHandler(e);
      }
      if (
        e.target.matches(
          ".dropdown-content ul li, .dropdown-content ul li span"
        )
      ) {
        DOM.dropdownContentHandler(e);
      }
    });
    // project-item handler
    const projectListEl = document.querySelector(".project-list");
    projectListEl.addEventListener("click", (e) => {
      if (e.target.matches("li, li p span")) {
        Modal.closeTaskModal("add");
        DOM.projectItemHandler(e, "li");
      }
      if (e.target.matches("li span .ellipsis")) {
        Modal.closeTaskModal("add");
        DOM.projectItemHandler(e, "ellipsis");
      }
      if (e.target.matches("li .pop-up button")) {
        DOM.projectItemPopupHandler(e);
      }
    });
    // navigation home handler
    const home = document.querySelector(".home");
    home.addEventListener("click", (e) => {
      if (e.target.matches(".inbox, .inbox i, .inbox span")) {
        Helper.setPageTitle("Inbox", true);
        const activeProject = Helper.getProject("Inbox");
        DOM.renderTaskList(activeProject.taskList);
      }
      if (e.target.matches(".today , .today i, .today span")) {
        Modal.closeTaskModal("add");
        Helper.setPageTitle("Today", false);
        DOM.renderFilteredTaskList(0, "date");
      }
      if (e.target.matches(".upcoming, .upcoming i , .upcoming span")) {
        Modal.closeTaskModal("add");
        Helper.setPageTitle("Upcoming", false);
        DOM.renderFilteredTaskList(-1, "date");
      }
      if (e.target.matches(".important, .important i, .important span")) {
        Modal.closeTaskModal("add");
        Helper.setPageTitle("Important", false);
        DOM.renderFilteredTaskList(null, "priority");
      }
    });

    const searchBoxEl = document.querySelector("#searchBox");

    searchBoxEl.addEventListener("keyup", (e) => {
      if (e.code === "Enter") {
        const searchText = searchBoxEl.value;
        Helper.setPageTitle(`Search = "${searchText}"`, false);
        DOM.renderFilteredTaskList(searchText, "title");
        searchBoxEl.value = "";
      }
    });
  }
}

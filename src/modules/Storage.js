import TaskManager from "./TaskManager.js";
import Project from "./Project.js";
import Task from "./Task.js";
import Helper from "./Helper.js";

export default class Storage {
  static saveProjectList() {
    localStorage.setItem(
      "projectList",
      JSON.stringify(TaskManager.projectList)
    );
  }
  static getProjectList() {
    let projectList = [];
    const list = JSON.parse(localStorage.getItem("projectList"));
    if (list) {
      list.forEach((project) => {
        let taskList = project._taskList.map((task) => {
          return new Task(
            task._id,
            task._title,
            task._desc,
            task._dueDate,
            task._priority,
            task._project,
            task._taskCompleted
          );
        });
        projectList.push(
          new Project(project._id, project._name, project._color, taskList)
        );
      });
    }
    return projectList;
  }
  static savePageTitle() {
    const pageTitle = Helper.getPageTitle();
    localStorage.setItem("pageTitle", JSON.stringify(pageTitle));
  }
  static getPageTitle() {
    return JSON.parse(localStorage.getItem("pageTitle"));
  }
}

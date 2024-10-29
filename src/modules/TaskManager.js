import Helper from "./Helper.js";
import Storage from "./Storage.js";
import DOM from "./DOM.js";

export default class TaskManager {
  static _projectList = [];
  static get projectList() {
    return this._projectList;
  }
  static set projectList(value) {
    if (Array.isArray(value)) {
      this._projectList = [];
      this._projectList = [...value];
    } else {
      this._projectList.push(value);
    }
  }

  static addTask(taskObj) {
    const project = Helper.getProject(taskObj.project);
    project.taskList = taskObj;
    Storage.saveProjectList();
  }
  static editTask(taskObj, defaultProjectName) {
    const project = Helper.getProject(taskObj.project);
    // if project value updated, then delete from old project taskList and add to updated project taskList
    if (taskObj.project !== defaultProjectName) {
      const oldProject = Helper.getProject(defaultProjectName);
      oldProject.taskList.splice(oldProject.taskList.indexOf(taskObj), 1);
      this.addTask(taskObj);
    } else {
      project.taskList.map((item) => {
        if (item.id === taskObj.id) {
          item.title = taskObj.title;
          item.desc = taskObj.desc;
          item.dueDate = taskObj.dueDate;
          item.priority = taskObj.priority;
          item.project = taskObj.project;
        }
      });
      Storage.saveProjectList();
    }
  }
  static updateTaskCompletedFlag(id, projectName, taskCompletedFlag) {
    const project = Helper.getProject(projectName);
    project.taskList.forEach((task) => {
      if (task.id === id) {
        task.taskCompleted = taskCompletedFlag;
      }
    });
    Storage.saveProjectList();
  }
  static deleteTask(taskObj) {
    const project = Helper.getProject(taskObj.project);
    const activeTaskList = project.taskList;
    activeTaskList.splice(activeTaskList.indexOf(taskObj), 1);
    Storage.saveProjectList();
  }
  static clearCompletedTasks() {
    const filteredProjectList = this.projectList.map((project) => {
      let filteredTaskList = project.taskList.filter((task) => {
        if (task.taskCompleted === false) return task;
      });
      project.taskList = filteredTaskList;
      return project;
    });
    this.projectList = filteredProjectList;
    Storage.saveProjectList();
    const activeProject = Helper.getActiveProject();
    DOM.renderTaskList(activeProject.taskList);
  }

  static addProject(projectObj) {
    this.projectList = projectObj;
    Storage.saveProjectList();
  }
  static editProject(projectObj) {
    this.projectList.map((project) => {
      if (project.id === projectObj.id) {
        project.name = projectObj.projectName;
        project.color = projectObj.projectColorArr;
        project.taskList.map((task) => {
          task.project = projectObj.projectName;
        });
      }
    });
    Storage.saveProjectList();
  }
  static deleteProject(projectObj) {
    this.projectList.splice(this.projectList.indexOf(projectObj), 1);
    Storage.saveProjectList();
  }
}

import Helper from "./Helper.js";

export default class Project {
  constructor(id, name, colorArr, taskList = []) {
    this._id = id ? id : Helper.getId();
    this._name = name;
    this._color = colorArr;
    this._taskList = taskList;
  }

  get id() {
    return this._id;
  }
  get name() {
    return this._name;
  }
  set name(value) {
    this._name = value;
  }
  get color() {
    return this._color;
  }
  set color(value) {
    this._color = value;
  }
  get taskList() {
    return this._taskList;
  }
  set taskList(value) {
    if (Array.isArray(value)) {
      this._taskList = [];
      this._taskList = [...value];
    } else {
      this._taskList.push(value);
    }
  }
  static newTaskList(project, list) {
    project._taskList = [];
    project._taskList = [...list];
  }
}

import Helper from "./Helper.js";

export default class Task {
  constructor(
    id,
    title,
    desc,
    dueDate,
    priority,
    project,
    taskCompleted = false
  ) {
    this._id = id ? id : Helper.getId();
    this._title = title;
    this._desc = desc;
    this._dueDate = dueDate;
    this._priority = priority;
    this._project = project;
    this._taskCompleted = taskCompleted;
  }
  get id() {
    return this._id;
  }
  get title() {
    return this._title;
  }
  set title(value) {
    this._title = value;
  }
  get desc() {
    return this._desc;
  }
  set desc(value) {
    this._desc = value;
  }
  get dueDate() {
    return this._dueDate;
  }
  set dueDate(value) {
    this._dueDate = value;
  }
  get priority() {
    return this._priority;
  }
  set priority(value) {
    this._priority = value;
  }
  get project() {
    return this._project;
  }
  set project(value) {
    this._project = value;
  }
  get taskCompleted() {
    return this._taskCompleted;
  }
  set taskCompleted(value) {
    this._taskCompleted = value;
  }
}

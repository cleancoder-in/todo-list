import DOM from "./DOM.js";
import TaskManager from "./TaskManager.js";
import Helper from "./Helper.js";

export default class Modal {
  /************Task Modal ****************/
  static taskModal(type, item = null) {
    let btnValue, btnName;
    let projectName = "";
    const taskModal = document.createElement("div");
    taskModal.classList.add("task-modal");

    if (type === "add") {
      (btnName = "Add Task"), (btnValue = "add");
    }
    if (type === "edit") {
      projectName = item.dataset.project;
      (btnName = "Save"), (btnValue = "edit");
    }
    taskModal.innerHTML = `
                        <form>
                            <input type="text" class="task-name" placeholder="Task name" maxlength="50" required/>
                            <textarea name="description" id="" placeholder="Description"></textarea>
                            <div class="form-group">
                                <label for="dueDate">Due date:</label>
                                <input type="date" placeholder="Due date"  class="due-date" id="dueDate">
                            </div>
                            <div class="form-group">
                                <label for="priority">Priority:</label>
                                <select name="priority" id="priority">
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div class="horizontal-line"></div>
                            <div class="bottom-row">
                                <div class="form-group">
                                    <label for="project">Project:</label>
                                    <select name="project-name" id="project">
                                        <!-- to be added by javascript -->
                                    </select>
                                </div>

                                <div class="btns">
                                    <button class="btn" value="cancel">Cancel</button>
                                    <button class="btn add" value="${btnValue}" data-project="${projectName}">${btnName}</button>
                                </div>
                            </div>
                        </form>          
    `;

    return taskModal;
  }
  static addProjectListInTaskModal(list) {
    const projectName = Helper.getPageTitle()[1];
    const dropdownSelectEl = document.querySelector(".task-modal #project");
    list.forEach((item) => {
      const optionEl = document.createElement("option");
      optionEl.textContent = item.name;
      optionEl.value = item.name;
      if (item.name === projectName) optionEl.setAttribute("selected", true);
      dropdownSelectEl.appendChild(optionEl);
    });
  }
  static setPriority() {
    const projectName = Helper.getPageTitle();
    if (projectName === "Important") {
      document
        .querySelector("#priority")
        .lastElementChild.setAttribute("selected", true);
    }
  }
  static openTaskModal(type, taskItem = null) {
    if (type === "add") {
      const taskListBox = document.querySelector(".task-list-wrapper");
      taskListBox.appendChild(this.taskModal(type));
    }
    if (type === "edit") {
      taskItem.after(this.taskModal(type, taskItem));
      taskItem.remove();
    }
    const inputEl = document.querySelector(".task-modal .task-name");
    inputEl.focus();
    this.addProjectListInTaskModal(TaskManager.projectList);
    this.setPriority();
    Helper.hideAddTaskBtn();
  }
  static closeTaskModal() {
    const taskModalEl = document.querySelector(".task-modal");
    if (taskModalEl) {
      taskModalEl.remove();
    }
    Helper.showAddTaskBtn();
  }

  /********* Project Modal *****************/
  static projectModal(type) {
    let btnName, btnValue;
    const projectModal = document.createElement("div");
    projectModal.classList.add("project-modal");
    projectModal.setAttribute("id", "projectModal");

    if (type === "add") {
      (btnName = "Add"), (btnValue = "add");
    }
    if (type === "edit") {
      (btnName = "Save"), (btnValue = "edit");
    }

    projectModal.innerHTML = `
                          <div class="modal-content">
                            <div class="modal-header">
                                <p class="title">${type} project
                                    <span>
                                        <button type="button" class="close">
                                            &times;
                                        </button>
                                    </span>
                                </p>
                            </div>
                            <div class="modal-body">
                                <form>
                                    <div class="form-group">
                                        <label for="projectName">Name:</label>
                                        <input type="text" id="projectName" class="form-control" required/>
                                    </div>

                                    <div class="form-group dropdown">
                                        <label for="projectColor">Color:</label>
                                        <button type="button" id="colorBtn" class="form-control">
                                            <p>
                                                <span class="color" style="background-color:#36454F;"></span>
                                                <span class="color-text">charcoal</span>
                                            </p>
                                            <p></p>
                                        </button>

                                        <div class="dropdown-content hide" id="projectColor">
                                            <ul class="form-control">
                                                <li data-value='["#762023","berry red"]'>
                                                    <span class="color" style="background-color:#762023;"></span>
                                                    <span>berry red</span>
                                                </li>
                                                <li data-value='["#ff0000","red"]'>
                                                    <span class="color" style="background-color:#ff0000;"></span>
                                                    <span>red</span>
                                                </li>
                                                <li data-value='["#ffa500","orange"]'>
                                                    <span class="color" style="background-color:#ffa500;"></span>
                                                    <span>orange</span>
                                                </li>
                                                <li data-value='["#ffff00","yellow"]'>
                                                    <span class="color" style="background-color:#ffff00;"></span>
                                                    <span>yellow</span>
                                                </li>
                                                <li data-value='["#808000","olive green"]'>
                                                    <span class="color" style="background-color:#808000;"></span>
                                                    <span>olive green</span>
                                                </li>
                                                <li data-value='["#32cd32","lime green"]'>
                                                    <span class="color" style="background-color:#32cd32;"></span>
                                                    <span>lime green</span>
                                                </li>
                                                <li data-value='["#008000","green"]'>
                                                    <span class="color" style="background-color:#008000;"></span>
                                                    <span>green</span>
                                                </li>
                                                <li data-value='["#008080","teal"]'>
                                                    <span class="color" style="background-color:#008080;"></span>
                                                    <span data-value="teal">teal</span>
                                                </li>
                                                <li data-value='["#87ceeb","sky blue"]'>
                                                    <span class="color style="background-color:#87ceeb;"></span>
                                                    <span>sky blue</span>
                                                </li>
                                                <li data-value='["#add8e6","light blue"]'>
                                                    <span class="color" style="background-color:#add8e6;"></span>
                                                    <span>light blue</span>
                                                </li>
                                                <li data-value='["#0000ff","blue"]'>
                                                    <span class="color" style="background-color:#0000ff;"></span>
                                                    <span>blue</span></li>
                                                <li data-value='["#421c52","grape"]'>
                                                    <span class="color" style="background-color:#421c52;"></span>
                                                    <span>grape</span>
                                                </li>
                                                <li data-value='["#ee82ee","violet"]'>
                                                    <span class="color" style="background-color:#ee82ee;"></span>
                                                    <span>violet</span>
                                                </li>
                                                <li data-value='["#E6E6FA","lavender"]'>
                                                    <span class="color" style="background-color:#E6E6FA;"></span>
                                                    <span>lavender</span>
                                                </li>
                                                <li data-value='["#ff00ff","magenta"]'>
                                                    <span class="color" style="background-color:#ff00ff;"></span>
                                                    <span>magenta</span>
                                                </li>
                                                <li data-value='["#fa8072","salmon"]'>
                                                    <span class="color" style="background-color:#fa8072;"></span>
                                                    <span>salmon</span>
                                                </li>
                                                <li data-value='["#36454F","charcoal"]'>
                                                    <span class="color" style="background-color:#36454F;"></span>
                                                    <span>charcoal</span>
                                                </li>
                                                <li data-value='["#808080","grey"]'>
                                                    <span class="color" style="background-color:#808080;"></span>
                                                    <span>grey</span></li>
                                                <li data-value='["#483C32","taupe"]'>
                                                    <span class="color" style="background-color:#483C32;"></span>
                                                    <span>taupe</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div class="form-group button-row">
                                        <button type="button" class="btn cancel" value="cancel">Cancel</button>
                                        <button type="button" class="btn add" value="${btnValue}">${btnName}</button>
                                    </div>

                                </form>
                            </div>
                        </div>
                              `;

    return projectModal;
  }
  static openProjectModal(type) {
    document.body.appendChild(this.projectModal(type));
  }
  static closeProjectModal(type = null) {
    const projectModal = document.querySelector(".project-modal");
    const dropdownContent = document.querySelector(".dropdown-content");
    document.getElementById("projectName").value = "";
    document.querySelector("#projectName").classList.remove("highlight-red");
    dropdownContent.classList.add("hide");
    document.body.removeChild(projectModal);
    if (type === "edit") {
      const activeLiElem = document.querySelector(".highlight-brown");
      DOM.closeProjectItemPopup(activeLiElem);
    }
  }
}

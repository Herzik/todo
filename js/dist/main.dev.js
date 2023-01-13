"use strict";

var form = document.querySelector('#form');
var formInput = form.querySelector('#taskInput');
var taskList = document.querySelector('#tasksList');
var emptyList = document.querySelector('#emptyList');
var tasks = [];

var renderTasks = function renderTasks(container, item) {
  var taskTemplate = "\n      <li id=\"".concat(item.id, "\" class=\"list-group-item d-flex justify-content-between task-item\">\n        <span class=\"task-title ").concat(item.done ? 'task-title--done' : '', "\">").concat(item.text, "</span>\n          <div class=\"task-item__buttons\">\n            <button type=\"button\" data-action=\"done\" class=\"btn-action\">\n              <img src=\"./img/tick.svg\" alt=\"Done\" width=\"18\" height=\"18\" />\n            </button>\n            <button type=\"button\" data-action=\"delete\" class=\"btn-action\">\n              <img src=\"./img/cross.svg\" alt=\"Done\" width=\"18\" height=\"18\" />\n            </button>\n          </div>\n      </li>\n  ");
  container.insertAdjacentHTML('beforeend', taskTemplate);
};

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(function (element) {
    return renderTasks(taskList, element);
  });
}

var saveToLocalStorage = function saveToLocalStorage(key, item) {
  localStorage.setItem(key, JSON.stringify(item));
};

var checkTask = function checkTask() {
  // taskList.children.length > 1
  //   ? emptyList.classList.add('none')
  //   : emptyList.classList.remove('none')
  var emptyListTemplate = "\n          <li id=\"emptyList\" class=\"list-group-item empty-list\">\n            <img src=\"./img/leaf.svg\" alt=\"Empty\" width=\"48\" class=\"mt-3\" />\n            <div class=\"empty-list__title\">\u0421\u043F\u0438\u0441\u043E\u043A \u0434\u0435\u043B \u043F\u0443\u0441\u0442</div>\n          </li>\n        ";

  if (tasks.length === 0) {
    taskList.insertAdjacentHTML('afterbegin', emptyListTemplate);
  } else {
    var emptyListEl = document.querySelector('#emptyList');
    emptyListEl ? emptyListEl.remove() : null;
  }
};

var doneTask = function doneTask(e) {
  if (e.target.dataset.action !== 'done') return;
  e.target.dataset.action === 'done' ? e.target.closest('li').classList.toggle('task-title--done') : null;
  var id = e.target.closest('li').id;
  var index = tasks.findIndex(function (task) {
    return task.id == id;
  });
  tasks[index].done = !tasks[index].done; // const task = tasks.find(task => task.id == id)
  // task.done = !task.done

  saveToLocalStorage('tasks', tasks);
};

var deleteTask = function deleteTask(e) {
  var id = Number(e.target.closest('li').id);

  if (e.target.dataset.action !== 'delete') {
    return;
  }

  e.target.dataset.action === 'delete' ? e.target.closest('li').remove() : null;
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
  saveToLocalStorage('tasks', tasks); // const index = tasks.findIndex(task => task.id == id)
  // tasks.splice(index, 1)

  checkTask();
};

var addTask = function addTask(e) {
  e.preventDefault();
  var taskText = formInput.value;
  var newTask = {
    id: Date.now(),
    text: taskText,
    done: false
  };
  tasks.push(newTask);
  saveToLocalStorage('tasks', tasks);
  renderTasks(taskList, newTask);
  form.reset();
  formInput.focus();
  checkTask();
};

taskList.addEventListener('click', deleteTask);
taskList.addEventListener('click', doneTask);
form.addEventListener('submit', addTask);
checkTask();
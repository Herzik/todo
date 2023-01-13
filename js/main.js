const form = document.querySelector('#form')
const formInput = form.querySelector('#taskInput')
const taskList = document.querySelector('#tasksList')
const emptyList = document.querySelector('#emptyList')

let tasks = []

const renderTasks = (container, item) => {
  const taskTemplate = `
      <li id="${item.id}" class="list-group-item d-flex justify-content-between task-item">
        <span class="task-title ${item.done ? 'task-title--done' : ''}">${item.text}</span>
          <div class="task-item__buttons">
            <button type="button" data-action="done" class="btn-action">
              <img src="./img/tick.svg" alt="Done" width="18" height="18" />
            </button>
            <button type="button" data-action="delete" class="btn-action">
              <img src="./img/cross.svg" alt="Done" width="18" height="18" />
            </button>
          </div>
      </li>
  `

  container.insertAdjacentHTML('beforeend', taskTemplate)
}

if (localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'))
  tasks.forEach(element => renderTasks(taskList, element))
}

const saveToLocalStorage = (key, item) => {
  localStorage.setItem(key, JSON.stringify(item))
}

const checkTask = () => {
  // taskList.children.length > 1
  //   ? emptyList.classList.add('none')
  //   : emptyList.classList.remove('none')

  const emptyListTemplate = `
          <li id="emptyList" class="list-group-item empty-list">
            <img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3" />
            <div class="empty-list__title">Список дел пуст</div>
          </li>
        `
  if (tasks.length === 0) {
    taskList.insertAdjacentHTML('afterbegin', emptyListTemplate)
  } else {
    const emptyListEl = document.querySelector('#emptyList')

    emptyListEl ? emptyListEl.remove() : null
  }
}

const doneTask = e => {
  if (e.target.dataset.action !== 'done') return

  e.target.dataset.action === 'done'
    ? e.target.closest('li').classList.toggle('task-title--done')
    : null

  const id = e.target.closest('li').id

  const index = tasks.findIndex(task => task.id == id)

  tasks[index].done = !tasks[index].done

  // const task = tasks.find(task => task.id == id)

  // task.done = !task.done

  saveToLocalStorage('tasks', tasks)
}

const deleteTask = e => {
  const id = Number(e.target.closest('li').id)

  if (e.target.dataset.action !== 'delete') {
    return
  }

  e.target.dataset.action === 'delete' ? e.target.closest('li').remove() : null

  tasks = tasks.filter(task => task.id !== id)

  saveToLocalStorage('tasks', tasks)

  // const index = tasks.findIndex(task => task.id == id)

  // tasks.splice(index, 1)

  checkTask()
}

const addTask = e => {
  e.preventDefault()
  const taskText = formInput.value

  const newTask = {
    id: Date.now(),
    text: taskText,
    done: false,
  }

  tasks.push(newTask)

  saveToLocalStorage('tasks', tasks)

  renderTasks(taskList, newTask)

  form.reset()
  formInput.focus()

  checkTask()
}

taskList.addEventListener('click', deleteTask)
taskList.addEventListener('click', doneTask)
form.addEventListener('submit', addTask)

checkTask()

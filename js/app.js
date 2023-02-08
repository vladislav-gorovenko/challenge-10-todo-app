// query selectors
const todoInputTextEl = document.querySelector("#todo__input--text");
const todoItemsContainerEl = document.querySelector(".todo__items-todos");
const todoItemsLeftEl = document.querySelector(".todo__items-action--left");

// event listeners
todoInputTextEl.addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    if (e.target.value.trim() != "") {
      const identifier = generateRandomIdentifier();
      createTodoItem(identifier, e.target.value, false);
      clearInput(e);
    }
  }
});

// displaying all the todos from local storage, if any
let todoItems = [];
getTodoItemsFromLocalStorage();
renderTodoItems();

// functions
function getTodoItemsFromLocalStorage() {
  if (localStorage.getItem("todoItems")) {
    todoItems = JSON.parse(localStorage.getItem("todoItems"));
    console.log(todoItems);
  }
}

function renderTodoItems() {
  let todoItemsHtml = "";
  for (index in todoItems.reverse()) {
    const { identifier, text, completed } = todoItems[index];
    todoItemsHtml += `
    <div class="todo__item${completed ? " completed" : ""}">
    <label for="todo__item--checkbox-${identifier}" class="todo__item--label">
        <svg xmlns="http://www.w3.org/2000/svg" width="11" height="9">
        <path
            fill="none"
            stroke="#FFF"
            stroke-width="2"
            d="M1 4.304L3.696 7l6-6"
        />
        </svg>
        <input
        type="checkbox"
        name="todo__item--checkbox"
        id="todo__item--checkbox-${identifier}"
        class="todo__item--checkbox"${completed ? " checked" : ""}
        />
    </label>
    <input
        type="text"
        name="todo__item--text"
        id="todo__item--text"
        class="todo__item--text"
        defaultValue="${text}"
        value="${text}"
    />
    <svg
        class="todo__item-svg"
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
    >
        <path
        fill="#494C6B"
        fill-rule="evenodd"
        d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
        />
    </svg>
    </div>
  `;
  }
  todoItemsContainerEl.innerHTML = todoItemsHtml;
}

function createTodoItem(identifier, text, completed) {
  // checking if there is this todo item already and adding if not
  let identifiers = todoItems.map((item) => {
    return item.identifier;
  });
  if (!identifiers.includes(identifier)) {
    todoItems.push({
      identifier: identifier,
      text: text,
      completed: completed,
    });
  }
  updateTodoItemsInLocalStorage();
  getTodoItemsFromLocalStorage();
  renderTodoItems();
}

function generateRandomIdentifier() {
  return window.crypto.randomUUID();
}

function clearInput(el) {
  el.target.value = "";
}

function updateTodoItemsInLocalStorage() {
  localStorage.setItem("todoItems", JSON.stringify(todoItems));
  renderTodoItems();
}

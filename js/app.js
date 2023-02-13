// query selectors
const todoInputTextEl = document.querySelector("#todo__input--text");
const todoItemsContainerEl = document.querySelector(".todo__items-todos");
const todoItemsLeftEl = document.querySelector(".todo__items-action--left");
const todoInputCheckboxEl = document.querySelector("#todo__input--checkbox");
const todoFilters = document.querySelectorAll(".todo__filter");
const clearCompletedBtnEl = document.querySelector(
  ".todo__items-action--clear-completed"
);
const lightModeToggleEl = document.querySelector(".todo__svg");
let dragStartIndex;
let shadowedElement;

// displaying all the todos from local storage, if any
let todoItems = [];
getTodoItemsFromLocalStorage();
renderTodoItems();
updateTodoItemsLeftParameter();

// event listeners
todoInputTextEl.addEventListener("keypress", (e) => {
  if (e.key == "Enter" || e.key == "return") {
    if (e.target.value.trim() != "") {
      const identifier = generateRandomIdentifier();
      createTodoItem(
        identifier,
        e.target.value.trim(),
        todoInputCheckboxEl.checked
      );
      todoInputCheckboxEl.checked = false;
      clearInput(e);
    }
  }
});

todoInputCheckboxEl.addEventListener("change", (e) => {
  if (todoInputCheckboxEl.checked) {
    if (todoInputTextEl.value.trim() != "") {
      const identifier = generateRandomIdentifier();
      createTodoItem(
        identifier,
        todoInputTextEl.value.trim(),
        todoInputCheckboxEl.checked
      );
      todoInputCheckboxEl.checked = false;
      todoInputTextEl.value = "";
    }
  }
});

todoFilters.forEach((filter) => {
  filter.addEventListener("click", (e) => {
    const filterParameter = filter.classList.value.split("todo__filter--")[1];
    console.log(filterParameter);
    renderTodoItems(filterParameter);
  });
});

clearCompletedBtnEl.addEventListener("click", () => {
  todoItems = todoItems.filter((item) => item.completed == false);
  console.log(todoItems);
  renderTodoItems();
  updateTodoItemsLeftParameter();
});

lightModeToggleEl.addEventListener("click", (e) => {
  document.body.classList.toggle("night-mode");
});

// functions
function getTodoItemsFromLocalStorage() {
  if (sessionStorage.getItem("todoItems")) {
    todoItems = JSON.parse(sessionStorage.getItem("todoItems"));
  }
}

function renderTodoItems(filterParameter = "all") {
  let todoItemsHtml = "";
  let filteredTodoItems = generateFilteredTodoItemsList(filterParameter);
  for (index in filteredTodoItems) {
    const { identifier, text, completed } = filteredTodoItems[index];
    todoItemsHtml += `
    <div data-index=${index} draggable=true class="draggable todo__item${
      completed ? " completed" : ""
    } todo__item-${identifier}">
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
        <div></div>
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
  // remove todo items
  const removeTodoEl = todoItemsContainerEl.querySelectorAll(".todo__item-svg");
  removeTodoEl.forEach((item) => {
    item.addEventListener("click", (e) => {
      const identifier =
        e.target.parentElement.classList.value.split("todo__item-")[1];
      const newTodoItems = todoItems.filter(
        (item) => item.identifier != identifier
      );
      todoItems = newTodoItems;
      updateTodoItemsInLocalStorage();
      getTodoItemsFromLocalStorage();
      renderTodoItems();
    });
  });
  // complete todo items
  const completeTodoEl = document.querySelectorAll(".todo__item--checkbox");
  completeTodoEl.forEach((checkbox) => {
    checkbox.addEventListener("change", () => {
      const identifier = checkbox.id.split("todo__item--checkbox-")[1];
      const index = todoItems.findIndex(
        (item) => item.identifier == identifier
      );
      todoItems[index].completed = checkbox.checked;
      updateTodoItemsInLocalStorage();
      getTodoItemsFromLocalStorage();
    });
  });
  // update todo items text
  const todoItemTextEl = document.querySelectorAll(".todo__item--text");
  todoItemTextEl.forEach((textInput) => {
    const identifier =
      textInput.parentElement.classList.value.split("todo__item-")[1];
    const index = todoItems.findIndex((item) => item.identifier == identifier);
    textInput.addEventListener("change", (e) => {
      if (e.target.value.trim() != "") {
        todoItems[index].text = e.target.value.trim();
        updateTodoItemsInLocalStorage();
        getTodoItemsFromLocalStorage();
        renderTodoItems();
      } else {
        e.target.value = todoItems[index].text;
      }
    });
  });
  addEventListeners();
  addPointerEventListeners();
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
  sessionStorage.setItem("todoItems", JSON.stringify(todoItems));
  updateTodoItemsLeftParameter();
}

function updateTodoItemsLeftParameter() {
  todoItemsLeftEl.innerHTML = `${
    todoItems.filter((item) => item.completed == false).length
  } items left`;
}

function generateFilteredTodoItemsList(filterParameter) {
  if (filterParameter != "all") {
    if (filterParameter == "active") {
      return todoItems.filter((item) => item.completed == false);
    } else {
      return todoItems.filter((item) => item.completed == true);
    }
  }
  return todoItems;
}

function addEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
    draggable.addEventListener("dragover", dragOver);
    draggable.addEventListener("drop", dragDrop);
    draggable.addEventListener("dragenter", dragEnter);
    draggable.addEventListener("dragleave", dragLeave);
  });
}

function dragStart() {
  dragStartIndex = +this.getAttribute("data-index");
}

function dragOver(e) {
  e.preventDefault();
}

function dragDrop() {
  const dragEndIndex = +this.getAttribute("data-index");
  swapItems(dragStartIndex, dragEndIndex);
  this.classList.remove("over");
}

function dragEnter() {
  this.classList.add("over");
}

function dragLeave() {
  this.classList.remove("over");
}

function swapItems(fromIndex, toIndex) {
  const firstItem = todoItems[fromIndex];
  const secondItem = todoItems[toIndex];
  console.log(todoItems[fromIndex]);
  todoItems[fromIndex] = secondItem;
  todoItems[toIndex] = firstItem;
  console.log(todoItems[fromIndex]);
  updateTodoItemsInLocalStorage();
  renderTodoItems();
}

function addPointerEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  draggables.forEach((draggable) => {
    draggable.addEventListener("touchstart", (e) => touchStart(e));
    draggable.addEventListener("touchmove", (e) => touchMove(e));
    draggable.addEventListener("touchend", (e) => touchEnd(e));
  });
}

function touchStart(e) {
  [...e.changedTouches].forEach((touch) => {
    const item = touch.target.closest(".draggable");
    dragStartIndex = +item.getAttribute("data-index");
  });
}

function touchMove(e) {
  [...e.changedTouches].forEach((touch) => {
    const element = document
      .elementFromPoint(touch.pageX, touch.pageY)
      .closest(".draggable");
    if (element) {
      if (shadowedElement != element) {
        if (shadowedElement) {
          console.log(shadowedElement);
          shadowedElement.classList.remove("over");
        }
      }
      shadowedElement = element;
      element.classList.add("over");
    } else {
      if (shadowedElement) {
        shadowedElement.classList.remove("over");
      }
    }
  });
}

function touchEnd(e) {
  [...e.changedTouches].forEach((touch) => {
    const element = document
      .elementFromPoint(touch.pageX, touch.pageY)
      .closest(".draggable");
    if (element) {
      const dragEndIndex = +element.getAttribute("data-index");
      swapItems(dragStartIndex, dragEndIndex);
    }
  });
}

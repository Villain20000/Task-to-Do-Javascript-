const addButton = document.getElementById("task-input-btn");
const taskInput = document.getElementById("task-input");
const prioritySelect = document.getElementById("priority-select");
const deadlineInput = document.getElementById("deadline-input");
const categorySelect = document.getElementById("category-select");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-input-btn");
const filterPrioritySelect = document.getElementById("filter-priority-select");
const clearBtn = document.getElementById("clear-tasks-btn");
const archiveBtn = document.getElementById("archive-tasks-btn");
const taskCountDisplay = document.getElementById("task-count");

let tasksList = [];
let archivedTasks = [];

function saveTasks(taskList, key) {
  localStorage.setItem(key, JSON.stringify(taskList));
}

function loadTasks() {
  const taskData = localStorage.getItem("taskList");
  if (taskData) {
    tasksList = JSON.parse(taskData);
    displayTasks();
  }
}

function loadArchivedTasks() {
  const archivedData = localStorage.getItem("archivedTasks");
  if (archivedData) {
    archivedTasks = JSON.parse(archivedData);
  }
}

function addTask() {
  const taskInfo = {
    text: taskInput.value,
    priority: prioritySelect.value,
    deadline: deadlineInput.value,
    category: categorySelect.value,
    important: false,
    completed: false,
  };
  if (taskInfo.text !== "") {
    tasksList.push(taskInfo);
    saveTasks(tasksList, "taskList");
    displayTasks();
    taskInput.value = ""; // Clear the input field after adding the task
    prioritySelect.value = "low"; // Reset the priority select to default
    deadlineInput.value = ""; // Reset the deadline input
    categorySelect.value = "work"; // Reset the category select to default
  } else {
    alert("Please enter a task to add");
  }
}
addButton.addEventListener("click", addTask);

function displayTasks(filteredTasks = tasksList) {
  const taskListContainer = document.querySelector(".task-list");
  taskListContainer.innerHTML = ""; // Clear the container before adding tasks

  filteredTasks
    .sort((a, b) => priorityValue(b.priority) - priorityValue(a.priority))
    .forEach((task, index) => {
      const li = document.createElement("li");
      li.classList.add(task.priority);
      if (task.completed) {
        li.classList.add("completed");
      }
      if (task.important) {
        li.classList.add("important");
      }

      const taskSpan = document.createElement("span");
      taskSpan.textContent = `${task.text} [${task.category}] - ${
        task.deadline ? `Due: ${task.deadline}` : "No deadline"
      }`;

      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => deleteTask(index));

      const updateBtn = document.createElement("button");
      updateBtn.textContent = "Update";
      updateBtn.addEventListener("click", () => updateTask(index));

      const priorityBtn = document.createElement("button");
      priorityBtn.textContent = "Priority";
      priorityBtn.addEventListener("click", () => updatePriority(index));

      const importantBtn = document.createElement("button");
      importantBtn.textContent = "Important";
      importantBtn.addEventListener("click", () => toggleImportant(index));

      const completeBtn = document.createElement("button");
      completeBtn.textContent = "Complete";
      completeBtn.addEventListener("click", () => toggleComplete(index));

      li.appendChild(taskSpan);
      li.appendChild(deleteBtn);
      li.appendChild(updateBtn);
      li.appendChild(priorityBtn);
      li.appendChild(importantBtn);
      li.appendChild(completeBtn);
      taskListContainer.appendChild(li);
    });

  updateTaskCount();
}

function priorityValue(priority) {
  switch (priority) {
    case "low":
      return 1;
    case "medium":
      return 2;
    case "high":
      return 3;
    default:
      return 0;
  }
}

function deleteTask(index) {
  tasksList.splice(index, 1);
  saveTasks(tasksList, "taskList");
  displayTasks();
}

function updateTask(index) {
  const newTaskText = prompt("Update the task:", tasksList[index].text);
  const newPriority = prompt(
    "Update the priority (low, medium, high):",
    tasksList[index].priority
  );
  const newDeadline = prompt(
    "Update the deadline (YYYY-MM-DD):",
    tasksList[index].deadline
  );
  const newCategory = prompt(
    "Update the category (work, personal, shopping):",
    tasksList[index].category
  );
  if (
    newTaskText !== null &&
    newTaskText !== "" &&
    (newPriority === "low" ||
      newPriority === "medium" ||
      newPriority === "high") &&
    (newCategory === "work" ||
      newCategory === "personal" ||
      newCategory === "shopping")
  ) {
    tasksList[index].text = newTaskText;
    tasksList[index].priority = newPriority;
    tasksList[index].deadline = newDeadline;
    tasksList[index].category = newCategory;
    saveTasks(tasksList, "taskList");
    displayTasks();
  }
}

function updatePriority(index) {
  const newPriority = prompt(
    "Update the priority (low, medium, high):",
    tasksList[index].priority
  );
  if (
    newPriority === "low" ||
    newPriority === "medium" ||
    newPriority === "high"
  ) {
    tasksList[index].priority = newPriority;
    saveTasks(tasksList, "taskList");
    displayTasks();
  }
}

function toggleImportant(index) {
  tasksList[index].important = !tasksList[index].important;
  saveTasks(tasksList, "taskList");
  displayTasks();
}

function toggleComplete(index) {
  tasksList[index].completed = !tasksList[index].completed;
  saveTasks(tasksList, "taskList");
  displayTasks();
}

function deleteTasks() {
  tasksList = [];
  saveTasks(tasksList, "taskList"); // Save the empty list to localStorage
  displayTasks(); // Update the display
}
clearBtn.addEventListener("click", deleteTasks);

function searchTask() {
  const searchTerm = searchInput.value.toLowerCase();
  const filteredTasks = tasksList.filter((task) =>
    task.text.toLowerCase().includes(searchTerm)
  );
  displayTasks(filteredTasks);
}
searchBtn.addEventListener("click", searchTask);

function filterTasksByPriority() {
  const selectedPriority = filterPrioritySelect.value;
  if (selectedPriority === "all") {
    displayTasks(tasksList);
  } else {
    const filteredTasks = tasksList.filter(
      (task) => task.priority === selectedPriority
    );
    displayTasks(filteredTasks);
  }
}
filterPrioritySelect.addEventListener("change", filterTasksByPriority);

function archiveCompletedTasks() {
  archivedTasks.push(...tasksList.filter((task) => task.completed));
  tasksList = tasksList.filter((task) => !task.completed);
  saveTasks(tasksList, "taskList");
  saveTasks(archivedTasks, "archivedTasks");
  displayTasks();
}
archiveBtn.addEventListener("click", archiveCompletedTasks);

function updateTaskCount() {
  const totalTasks = tasksList.length;
  const highPriorityTasks = tasksList.filter(
    (task) => task.priority === "high"
  ).length;
  const mediumPriorityTasks = tasksList.filter(
    (task) => task.priority === "medium"
  ).length;
  const lowPriorityTasks = tasksList.filter(
    (task) => task.priority === "low"
  ).length;

  taskCountDisplay.textContent = `${totalTasks} tasks: ${highPriorityTasks} high, ${mediumPriorityTasks} medium, ${lowPriorityTasks} low`;
}

document.addEventListener("DOMContentLoaded", () => {
  loadTasks();
  loadArchivedTasks();
});

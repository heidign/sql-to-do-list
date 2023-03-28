// javascript code to manipulate the DOM/frontend
console.log("js sourced");

// Global variable setting value to negative number to later call edit function by ID
let editId = -1;

// checks that the document is ready before anything else
$(document).ready(function () {
  console.log("jQueery sourced");
  // Establish Click Listeners
  // when click happens it will reference the function
  $(document).on("click", ".delete-btn", deleteTask);
  $(document).on("click", ".edit-btn", onEdit);
  $(document).on("click", ".accept-btn", acceptEdit);
  $(document).on("click", ".cancel-btn", cancelEdit);
  $(document).on("click", "#addButton", saveTask);

  // load existing tasks on page load
  getTasks();

  // handles event onComplete button
  $(document).on("click", ".completeBtn", onComplete);
  // creating object & using jQuery to call the value of the input we want to set it to
  const taskInput = $("#taskInput");
  // using our variable with `.on` method when 'on input' to reference/invoke function
  taskInput.on("input", function (e) {
    // if statement for validation, disables button
    if (taskInput.val().length === 0) {
      taskInput.addClass("is-invalid");
      $("#addButton").prop("disabled", true);
    } else {
      taskInput.removeClass("is-invalid");
      $("#addButton").prop("disabled", false);
    }
  });
}); // End `doc ready` type function 

// calls function that sets editID to it's parent element of the table
function onEdit() {
  editId = $(this).parents("tr").data("id");
  // calls getTasks function to GET/ajax tasks when editing
  getTasks();
}
 
// function to cancel editing
function cancelEdit() {
  // sets editID variable to -1 (differentiates from other possible IDs bc always >= 1)
  editId = -1;
  getTasks();
}

// function to accept the edit mode, aka an update
// PUT edit //
function acceptEdit() {
  editId = -1;
  let id = $(this).parents("tr").data("id");
  let task = $(".task-in").val();
  // let completed = $("#taskInput").val();

  // Ajax type PUT used for updating
  $.ajax({
    type: "PUT",
    url: `/todo/edit/${id}`,
    data: {
      task,
    },
  }) // after ajax .then will call the function with response passed in as parameter 
    .then(function (response) {
      console.log("Response from server.", response);
      // calling getTasks to get data from server to the DOM (function renders!)
      getTasks();
    })
    .catch(function (error) {
      console.log("Error in PUT", error);
      alert("Unable to edit task list at this time. Please try again later.");
    });
}

// DELETE //
// this function handles task deletion by ID, it's unique identifier
function deleteTask() {
  let id = $(this).parents("tr").data("id");
  $.ajax({
    method: "DELETE",
    url: `/todo/${id}`,
  })
    .then((response) => {
      console.log("Deleted task", id);
      getTasks();
    })
    .catch((err) => {
      console.log(err);
    });
}
// GET //
// function for getting tasks from server to the DOM (it renders!)
function getTasks() {
  console.log("in getTasks");
  // ajax call to server to get tasks
  $.ajax({
    method: "GET",
    url: "/todo"
  }).then((response) => {
    console.log(`in getTasks;`, response);
    render(response);
  });
}

// POST //
function saveTask() {
  console.log("in saveTask");
  const value = $("#taskInput").val();

  if (value.length === 0) {
    $("#taskInput").addClass("is-invalid");
    return;
  }
  // object storing relative properties & values
  const taskToSend = {
    task: value,
    completed: false
  };
  // ajax call to server to post tasks from database
  $.ajax({
    type: "POST",
    url: "/todo/",
    data: taskToSend // sending the object; packaged data
  }) // then calling getTasks() to get data from server to the DOM
    .then(() => {
      getTasks();
    })
    .catch((err) => {
      console.error("PUT request for /todo failed", err);
      $("body").prepend("<h2>failed PUT request</h2>");
    });
}

// PUT //
// function for changing/updating the program
function onComplete() {
  console.log("in onComplete", $(".completeBtn"));
  // setting variables to parent element using `.data` jQuery method 
  let id = $(this).parents("tr").data("id");
  let isComplete = $(this).parents("tr").data("completed");
  console.log(isComplete);

  $.ajax({
    method: "PUT",
    url: `/todo/${id}`,
    data: { completed: !isComplete } // sending object with value of NOT isComplete (Boolean)
  })
    .then((response) => {
      getTasks();
    })
    .catch((error) => {
      console.log(error);
    });
}
// RENDER //
// rendering function to logically handle rendering to the DOM
// passing tasks into render as argument 
function render(tasks) {
  let renderElement = $("#viewTasks");
  // emptying element using `.empty();` method (getter)
  renderElement.empty();
  // for of loop looping through each iteration of tasks loop
  for (let todo of tasks) {
    const completeIcon = todo.isComplete
      ? "bi-check-square-fill"
      : "bi-check-square";

    if (todo.id == editId) {
      let appendStr = `
        <tr data-id=${todo.id} data-completed="${todo.isComplete}">
        <td>
        <button class='btn completeBtn' type='button'><i class="${completeIcon}" style="color: cornflowerblue;"></i></button>
        </td>
        <td class="w-100">
        <input class='task-in form-control' value="${todo.task}">
        </td>
        <td>
        <div class="btn-group" role="group" aria-label="todo actions">
        <button class='btn accept-btn' type='button'><i class="bi-check-circle" style="color: cornflowerblue;"></i></button>
        <button class='btn cancel-btn' type='button'><i class="bi-x-circle" style="color: cornflowerblue;"></i></button>
        </div>
        </td>`;
      renderElement.append(appendStr);
    } else {
      let appendStr = `
        <tr data-id=${todo.id} data-completed=${todo.isComplete}>
        <td>
        <button class='btn completeBtn' type='button'><i class="${completeIcon}" style="color: cornflowerblue;"></i></button>
        </td>
        <td class="w-100">
        ${todo.task}
        </td>
        <td>
        <div class="btn-group" role="group" aria-label="todo actions">
        <button class='btn edit-btn' type='button'><i class="bi-pencil" style="color: cornflowerblue;"></i></button>
        <button class='btn delete-btn' type='button'><i class="bi-trash3" style="color: cornflowerblue;"></i></button>
        </div>
        </td>`;
      renderElement.append(appendStr);
    }
  }
}

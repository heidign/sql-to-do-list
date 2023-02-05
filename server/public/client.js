console.log('js sourced');

$(document).ready(function () {
  console.log('jQueery sourced');
  // Establish Click Listeners
  $(document).on("click", ".delete-btn", deleteTask);
  $(document).on("click", ".edit-btn", onEdit);
  $(document).on("click", ".accept-btn", acceptEdit);
  $(document).on("click", ".cancel-btn", cancelEdit);
  $(document).on("click", "#addButton", saveTask);
  // load existing koalas on page load
  getTasks();

  $(document).on("click", ".completeBtn", onComplete);
}); // end doc ready

let editId = -1;

function onEdit() {
  editId = $(this).parents("tr").data("id");
  getTasks();
}

function cancelEdit() {
  editId = -1;
  getTasks();
}
// PUT edit //
function acceptEdit() {
  editId = -1;
  let id = $(this).parents("tr").data("id");
  let task = $(".task-in").val();
  // let completed = $("#taskInput").val();
  $.ajax({
    type: "PUT",
    url: `/todo/edit/${id}`,
    data: {
      task
    },
  })
    .then(function (response) {
      console.log("Response from server.", response);
      getTasks();
    })
    .catch(function (error) {
      console.log("Error in PUT", error);
      alert("Unable to edit task list at this time. Please try again later.");
    });
}

// DELETE //
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

  const taskToSend = {
    task: $("#taskInput").val(),
    completed: false
  }
  // ajax call to server to get tasks
  $.ajax({
    type: "POST",
    url: "/todo/",
    data: taskToSend
  })
    .then(() => {
      getTasks();
    })
    .catch((err) => {
      console.error("PUT request for /todo failed", err);
      $("body").prepend("<h2>failed PUT request</h2>");
    });
}
// PUT // 
function onComplete() {
  console.log("in onComplete", $(".completeBtn"));

  let id = $(this).parents("tr").data("id");
  let isComplete = $(this).parents("tr").data("completed");
  console.log(isComplete);

  $.ajax({
    method: "PUT",
    url: `/todo/${id}`,
    data: { completed: !isComplete },
  })
    .then((response) => {
      getTasks();
    })
    .catch((error) => {
      console.log(error);
    });
}
// RENDER //
function render(tasks) {
  let renderElement = $("#viewTasks");
  renderElement.empty();
  for (let todo of tasks) {
    let completeText = "Complete <input class='completeBtn' type='button' value='☑️'>";
    if (!todo.isComplete) {
      completeText = "Incomplete <input class='completeBtn' type='button' value='☑️'>";
    }
    if (todo.id == editId) {
      let appendStr = `
        <tr data-id=${todo.id} data-completed="${todo.isComplete}">
        <td>
        <input class='task-in' value="${todo.task}">
        </td>
        <td>
        ${completeText}
        </td>
        <td>
        <span>
        <input class='accept-btn' type='button' value='✅'>
        <input class='cancel-btn' type='button' value='❌'>
        </span>
        </td>`;
      renderElement.append(appendStr);
    } else {
      let appendStr = `
        <tr data-id=${todo.id} data-completed=${todo.isComplete}>
        <td>
        ${todo.task}
        </td>
        <td>
        ${completeText}
        </td>
        <td>
        <span>
        <input class='edit-btn' type='button' value='📝'>
        <input class='delete-btn' type='button' value='❌'>
        </span>
        </td>`;
      renderElement.append(appendStr);
    }
  }
}

// converts an ISO date string into a timestamp, which is just a number representing the milliseconds since Jan 1, 1970
var getTime = function (isoString) {
  return new Date(isoString).getTime();
};

// takes a timestamp and converts it back into an ISO date string, which is a more readable date format
var getString = function (time) {
  return new Date(time).toISOString();
};

// converts an ISO date string into MM/DD/YYYY format for easier human reading
function convertToMMDDYYYY(isoDate) {
  const dateInstance = new Date(isoDate);
  if (isNaN(dateInstance.getTime())) return null; // checks if the date is valid before converting
  return dateInstance.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

// sorts the chart rows by the 'resource' field so they're easier to process in order
function sortChartRows(chartRows) {
  return chartRows.sort((a, b) => (a.resource < b.resource ? -1 : 1));
}

// finds a specific task by its ID within a specific row, so you can manipulate just that task
function findTaskById(chartRows, taskId, rowId) {
  const targetRow = chartRows.find((row) => row.id === rowId);
  return targetRow ? targetRow.tasks.find((task) => task.id === taskId) : null;
}

// saves the task's start and end dates using an AJAX call, and shows a custom message depending on whether the task was moved or resized
function saveTaskDates(taskId, startDate, endDate, actionType) {
  apex.server.process(
    "SAVE_TASK_DATES",
    {
      x01: taskId,
      x02: startDate,
      x03: endDate,
    },
    {
      success: function (response) {
        let message = "";
        if (actionType === "move") {
          // for moving, display the new start and end dates
          message = `Task moved. New Start: ${startDate}, New End: ${endDate}`;
        } else if (actionType === "resize") {
          // for resizing, calculate and display the new task duration in days
          const duration = calculateDuration(startDate, endDate);
          message = `Task resized. New Duration: ${duration} days`;
        }
        console.log("Task dates saved successfully.");
        apex.message.showPageSuccess(message); // shows a success message to the user
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error("Error saving task dates: " + textStatus); // logs an error if something goes wrong
      },
    }
  );
}

// helper function that calculates how many days are between two dates, useful for resizing tasks
function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
  // we subtract the start date from the end date to get the difference in milliseconds, then convert that to days
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return duration;
}

// moves a task from one row to another by updating the original and new rows' task lists
function updateTaskRow(chartData, task, originalRowId, newRowId) {
  const originalRow = chartData.find(row => row.id === originalRowId);
  const newRow = chartData.find(row => row.id === newRowId);

  if (!originalRow || !newRow) {
    console.error("Row not found."); // if either row doesn't exist, log an error
    return;
  }

  // removes the task from the original row's list of tasks
  originalRow.tasks = originalRow.tasks.filter(t => t.id !== task.id);

  // adds the task to the new row's list of tasks
  newRow.tasks.push(task);
}

// initialization function that sets up default options for dragging and resizing tasks
function(options) {
  $.extend(options, {
    dnd: { move: { tasks: "enabled" } }, // enables dragging and dropping of tasks
    taskDefaults: { resizable: "enabled", height: 30 }, // allows tasks to be resized and sets their height
    rowDefaults: { height: 40 } // sets the height of each row
  });
  // adds a reference line 
  var currDate = new Date();
  var referenceLine = [ { value: currDate.toISOString() } ];
  options.referenceObjects = referenceLine;
  console.log("options",options); // logs the options for debugging
  return options; // returns the updated options
}

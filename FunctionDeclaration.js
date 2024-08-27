
var getTime = function (isoString) {
  return new Date(isoString).getTime();
};

var getString = function (time) {
  return new Date(time).toISOString();
};


function convertToMMDDYYYY(isoDate) {
  const dateInstance = new Date(isoDate);
  if (isNaN(dateInstance.getTime())) return null; // checks if the date is valid before converting
  return dateInstance.toLocaleDateString("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}


function sortChartRows(chartRows) {
  return chartRows.sort((a, b) => (a.resource < b.resource ? -1 : 1));
}


function findTaskById(chartRows, taskId, rowId) {
  const targetRow = chartRows.find((row) => row.id === rowId);
  return targetRow ? targetRow.tasks.find((task) => task.id === taskId) : null;
}


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


function calculateDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);
 
  const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return duration;
}

// (Currently not Utilized) moves a task from one row to another by updating the original and new rows' task lists
function updateTaskRow(chartData, task, originalRowId, newRowId) {
  const originalRow = chartData.find(row => row.id === originalRowId);
  const newRow = chartData.find(row => row.id === newRowId);

  if (!originalRow || !newRow) {
    console.error("Row not found."); // if either row doesn't exist, log an error
    return;
  }

  
  originalRow.tasks = originalRow.tasks.filter(t => t.id !== task.id);


  newRow.tasks.push(task);
}




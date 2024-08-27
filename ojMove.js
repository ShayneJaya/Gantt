// retrieve the gantt chart action event data
const ganttEvent = this.data;
const taskList = ganttEvent.taskContexts; // contains details of tasks involved in the move
const initialTaskContext = taskList[0]; // focus on the first task being dragged

// calculate the time offset for task movement
const timeDifference =
  getTime(ganttEvent.start) - getTime(initialTaskContext.data.start);

// access the rows from the gantt chart and sort them
const chartData = $("#myGantt_jet")
  .ojGantt("option", "rows")
  .sort((a, b) => (a.resource < b.resource ? -1 : 1));

// identify the row where the task was originally located
const originalRow = chartData.find(
  (row) => row.id === initialTaskContext.rowData.id
);

// find the specific task within that row
const movingTask = originalRow.tasks.find(
  (task) => task.id === initialTaskContext.data.id
);

// check if the task is being moved to a different row
if (initialTaskContext.rowData.id !== ganttEvent.rowContext.rowData.id) {
  // prevent moving tasks to a different row
  console.log("Task cannot be moved to a different row.");
  apex.message.alert("Task cannot be moved to a different row.");
  $("#myGantt_jet").ojGantt("refresh");
  return; // stop further processing
}

// update task's start and end times based on the new position
movingTask.start = getString(
  getTime(initialTaskContext.data.start) + timeDifference
);
movingTask.end = getString(
  getTime(initialTaskContext.data.end) + timeDifference
);
console.log("movingTask.id", movingTask.id);
console.log("movingTask.start", movingTask.start);
console.log("movingTask.end", movingTask.end);

// convert dates to mm/dd/yyyy format
const formattedStart = convertToMMDDYYYY(movingTask.start);
const formattedEnd = convertToMMDDYYYY(movingTask.end);

console.log("formattedStart", formattedStart);
console.log("formattedEnd", formattedEnd);

// save moved task details using ajax
saveTaskDates(initialTaskContext.data.id, formattedStart, formattedEnd, "move");

// remove the task from its original row
chartData[
  chartData.map((row) => row.id).indexOf(initialTaskContext.rowData.id)
].tasks.splice(
  originalRow.tasks.map((task) => task.id).indexOf(initialTaskContext.data.id),
  1
);

// add the task to its new row
chartData[
  chartData.map((row) => row.id).indexOf(ganttEvent.rowContext.rowData.id)
].tasks.push(movingTask);

// update the gantt chart with the new data and re-sort the rows
$("#myGantt_jet").ojGantt(
  "option",
  "rows",
  chartData.sort((a, b) => (a.resource < b.resource ? -1 : 1))
);

// refresh the gantt chart to reflect the changes
$("#myGantt_jet").ojGantt("refresh");

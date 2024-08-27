// retrieve the interaction data from the gantt chart
const ganttInteraction = this.data;
const taskList = ganttInteraction.taskContexts; // provides info about tasks in the resize action
const initialTaskContext = taskList[0]; // focus on the task being resized

// determine the changes in start and end times due to resizing
const timeChangeStart =
  getTime(ganttInteraction.start) - getTime(initialTaskContext.data.start);
const timeChangeEnd =
  getTime(ganttInteraction.end) - getTime(initialTaskContext.data.end);

// get the original start and end times for the task
const originalStartTime = getTime(initialTaskContext.data.start);
const originalEndTime = getTime(initialTaskContext.data.end);

// calculate the new start and end times after resizing
const updatedStartTime = Math.min(
  originalEndTime,
  originalStartTime + timeChangeStart
);
const updatedEndTime = Math.max(
  originalStartTime,
  originalEndTime + timeChangeEnd
);

// retrieve and sort all rows in the gantt chart by the 'resource' field
const chartRows = $("#myGantt_jet")
  .ojGantt("option", "rows")
  .sort((a, b) => (a.resource < b.resource ? -1 : 1));

// locate the row containing the resized task
const targetRow = findTaskById(chartRows, initialTaskContext.data.id, initialTaskContext.rowData.id);
if (targetRow) {
  targetRow.start = getString(updatedStartTime);
  targetRow.end = getString(updatedEndTime);
  console.log("Task ID:", initialTaskContext.data.id);
  console.log("Updated Start Time:", targetRow.start);
  console.log("Updated End Time:", targetRow.end);

  // Convert dates and save
  const formattedStart = convertToMMDDYYYY(targetRow.start);
  const formattedEnd = convertToMMDDYYYY(targetRow.end);

  saveTaskDates(initialTaskContext.data.id, formattedStart, formattedEnd);
}

// update the gantt chart with the new data and re-sort by 'resource'
$("#myGantt_jet").ojGantt(
  "option",
  "rows",
  chartRows.sort((a, b) => (a.resource < b.resource ? -1 : 1))
);

// refresh the gantt chart to reflect updated task times
$("#myGantt_jet").ojGantt("refresh");

const ganttEvent = this.data;
const taskList = ganttEvent.taskContexts;
const initialTaskContext = taskList[0];

const timeDifference =
  getTime(ganttEvent.start) - getTime(initialTaskContext.data.start);

const chartData = $("#myGantt_jet")
  .ojGantt("option", "rows")
  .sort((a, b) => (a.resource < b.resource ? -1 : 1));

const originalRow = chartData.find(
  (row) => row.id === initialTaskContext.rowData.id
);

const movingTask = originalRow.tasks.find(
  (task) => task.id === initialTaskContext.data.id
);

if (initialTaskContext.rowData.id !== ganttEvent.rowContext.rowData.id) {

  console.log("Task cannot be moved to a different row.");
  apex.message.alert("Task cannot be moved to a different row.");
  $("#myGantt_jet").ojGantt("refresh");
  return;
}

movingTask.start = getString(
  getTime(initialTaskContext.data.start) + timeDifference
);
movingTask.end = getString(
  getTime(initialTaskContext.data.end) + timeDifference
);
console.log("movingTask.id", movingTask.id);
console.log("movingTask.start", movingTask.start);
console.log("movingTask.end", movingTask.end);

const formattedStart = convertToMMDDYYYY(movingTask.start);
const formattedEnd = convertToMMDDYYYY(movingTask.end);

console.log("formattedStart", formattedStart);
console.log("formattedEnd", formattedEnd);

saveTaskDates(initialTaskContext.data.id, formattedStart, formattedEnd, "move");

chartData[
  chartData.map((row) => row.id).indexOf(initialTaskContext.rowData.id)
].tasks.splice(
  originalRow.tasks.map((task) => task.id).indexOf(initialTaskContext.data.id),
  1
);

chartData[
  chartData.map((row) => row.id).indexOf(ganttEvent.rowContext.rowData.id)
].tasks.push(movingTask);

$("#myGantt_jet").ojGantt(
  "option",
  "rows",
  chartData.sort((a, b) => (a.resource < b.resource ? -1 : 1))
);

$("#myGantt_jet").ojGantt("refresh");

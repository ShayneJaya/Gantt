
const ganttInteraction = this.data;
const taskList = ganttInteraction.taskContexts; 
const initialTaskContext = taskList[0]; 


const timeChangeStart =
  getTime(ganttInteraction.start) - getTime(initialTaskContext.data.start);
const timeChangeEnd =
  getTime(ganttInteraction.end) - getTime(initialTaskContext.data.end);


const originalStartTime = getTime(initialTaskContext.data.start);
const originalEndTime = getTime(initialTaskContext.data.end);


const updatedStartTime = Math.min(
  originalEndTime,
  originalStartTime + timeChangeStart
);
const updatedEndTime = Math.max(
  originalStartTime,
  originalEndTime + timeChangeEnd
);


const chartRows = $("#myGantt_jet")
  .ojGantt("option", "rows")
  .sort((a, b) => (a.resource < b.resource ? -1 : 1));


const targetRow = findTaskById(chartRows, initialTaskContext.data.id, initialTaskContext.rowData.id);
if (targetRow) {
  targetRow.start = getString(updatedStartTime);
  targetRow.end = getString(updatedEndTime);
  console.log("Task ID:", initialTaskContext.data.id);
  console.log("Updated Start Time:", targetRow.start);
  console.log("Updated End Time:", targetRow.end);

  
  const formattedStart = convertToMMDDYYYY(targetRow.start);
  const formattedEnd = convertToMMDDYYYY(targetRow.end);

  saveTaskDates(initialTaskContext.data.id, formattedStart, formattedEnd, "resize");

}


$("#myGantt_jet").ojGantt(
  "option",
  "rows",
  chartRows.sort((a, b) => (a.resource < b.resource ? -1 : 1))
);


$("#myGantt_jet").ojGantt("refresh");

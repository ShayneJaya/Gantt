function(options) {
  $.extend(options, {
    dnd: { move: { tasks: "enabled" } }, // enables dragging and dropping of tasks
    taskDefaults: { resizable: "enabled", height: 30 }, // allows tasks to be resized and sets their height
    rowDefaults: { height: 40 } // sets the height of each row
  });
  var currDate = new Date();
  var referenceLine = [ { value: currDate.toISOString() } ];
  options.referenceObjects = referenceLine;
  console.log("options",options); // logs the options for debugging
  return options; // returns the updated options
}

export default (start) => {
  return [
    {
      Name: 'GANTT',
      Type: 'Gantt',
      GanttZoom: 'days',
      GanttRunSave: 2,
      GanttDataUnits: 'h',
      GanttRun: "events",
      GanttRunAdjust: 'Shrink',
      GanttRunTip: "*Text*"
    }
  ]
}

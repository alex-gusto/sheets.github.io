export default (start) => {
  return [
    {
      Name: 'GANTT',
      Type: 'Gantt',
      GanttZoom: 'days',
      GanttRunSave: 2,
      GanttDataUnits: 'h',
      GanttStart: "start",
      GanttEnd: "end",
      GanttRunAdjust: 'Shrink',
      GanttHtml: "*name*",
      GanttTip: "*name*",
      // GanttDescendants: "descendants",
      GanttAncestors: "ancestors",
      GanttTask: "All,Box",
      
      GanttMarkIncorrectDependencies: "2",
      GanttMarkDisabledDependencies: "2",
      GanttCorrectDependencies: "0",
      GanttDragDependenciesBetween: "2",
      GanttAssignDependencies: "1"
    }
  ]
}

export default {
  Cfg: {
    AutoUpdate: 1,
    Undo: 32,
    NoVScroll: 1,
    FastGantt: 1,
    GanttStyle: 'Standard'
  },
  Zoom: [
    {
      Name: "months",
      GanttUnits: "d",
      GanttWidth: "50", // 1 day equal 50px
      GanttDragUnits: 'h',
      GanttChartRound: "d",
      GanttHeader1: "M#MMMM yyyy"
    },
    {
      Name: "days",
      GanttUnits: "h",
      GanttWidth: "8", // 1 hour equal 8px
      GanttDragUnits: 'm',
      GanttChartRound: "d",
      GanttHeader1: "d#dddd dddddd MMMM yyyy",
      GanttHeader2: "h6#HH"
    },
    {
      Name: "hours",
      GanttUnits: "h",
      GanttWidth: "25", // 1 hour equal 25px
      GanttDragUnits: 'm',
      GanttChartRound: "h",
      GanttHeader1: "d#dddd dddddd MMMM yyyy",
      GanttHeader2: "h#HH"
    },
    {
      Name: "minutes",
      GanttUnits: "m",
      GanttWidth: "2", // 1 minute equal 2px
      GanttDragUnits: 's',
      GanttChartRound: "h",
      GanttHeader1: "d#dddd dddddd MMMM yyyy",
      GanttHeader2: "h#HH",
      GanttHeader3: "m15#mm"
    }
  ],
  Toolbar: {
    Visible: 0,
    Cells05: "Zoom",
    ZoomType: "SelectGanttZoom",
    ZoomWidth: "90"
  }
}

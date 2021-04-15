export default {
  Cfg: {
    AutoUpdate: 1,
    MainCol: 'name',
    Size: 'Small',
    GanttStyle: 'Standard'
  },
  Def: {
    Well: {
      GANTTGanttClass: 'Blue',
      Calculated: 1,
      startFormula: 'ganttstart()',
      endFormula: 'ganttend()'
    },
    Phase: {
      GANTTGanttClass: 'Aqua',
      Calculated: 1,
      startFormula: 'ganttstart()',
      endFormula: 'ganttend()'
    },
    R: {
      DefEmpty: 'R',
      DefParent: 'Sum'
    }
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
    Cells05: "Zoom",
    ZoomType: "SelectGanttZoom",
    ZoomWidth: "90"
  }
}

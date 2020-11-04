export default ({ isAux }) => {
    const cols = [
        {
            Name: 'afeHours',
            MinWidth: 80,
            CanEmpty: 1,
            Format: ',0.00',
            Type: 'Float'
        },
        {
            Name: 'targetHours',
            MinWidth: 80,
            CanEmpty: 1,
            Format: ',0.00',
            Type: 'Float'
        },
        {
            Name: 'dsvHours',
            MinWidth: 80,
            CanEmpty: 1,
            Format: ',0.00',
            Type: 'Float'
        },
        {
            Name: 'actualHours',
            MinWidth: 80,
            CanEmpty: isAux ? 0 : 1,
            Format: ',0.00',
            Type: 'Float'
        },
        {
            Name: 'nptHours',
            MinWidth: 80,
            CanEmpty: 1,
            Format: ',0.00',
            Type: 'Float'
        },
        {
            Name: 'wowHours',
            MinWidth: 80,
            CanEmpty: 1,
            Format: ',0.00',
            Type: 'Float'
        },
        {
            Name: '_tftHours',
            MinWidth: 80,
            Format: ',0.00',
            Type: 'Float',
            Formula: 'actualHours - nptHours - wowHours'
        },
        {
            Name: 'unPtHours',
            Visible: 0,
            CanHide: 0,
            CanPrint: 0,
            CanExport: 0
        },
        {
            Name: '_unPtHours',
            CanEmpty: 1,
            CanEdit: 1,
            OnChange: 'Grid.SetValue(Row, "unPtHours", Value, 1)',
            MinWidth: 80,
            Format: ',0.00',
            ClassFormula: 'Grid.Helpers.isEmpty(unPtHours) && "TSClassReadOnly"',
            Formula: 'Grid.Helpers.isNotEmpty(unPtHours) ? unPtHours : Grid.Helpers.isEmpty(afeHours) ? actualHours : ""',
            Type: 'Float'
        },
        {
            Name: '_iltHours',
            MinWidth: 80,
            Format: ',0.00',
            Type: 'Float',
            CanEmpty: 1,
            Formula: 'actualHours ? _tftHours - targetHours : ""'
        },
        {
            Name: 'plannedDepth',
            Type: 'Float',
            Visible: 0,
            CanHide: 0,
            CanPrint: 0,
            CanExport: 0
        },
        {
            Name: '_plannedDepth',
            MinWidth: 80,
            Format: ',0.00',
            Type: 'Float',
            CanEdit: 1,
            CanEmpty: 1,
            OnChange: 'Grid.SetValue(Row, "plannedDepth", Value, 1)',
            ClassFormula: 'Grid.Helpers.isEmpty(plannedDepth) && "TSClassReadOnly"',
            Formula: 'Grid.Component.props.getPlannedDepth(Grid, Row, Get, plannedDepth)'
        },
        {
            Name: 'actualDepth',
            Type: 'Float',
            Visible: 0,
            CanHide: 0,
            CanPrint: 0,
            CanExport: 0
        },
        {
            Name: '_actualDepth',
            MinWidth: 80,
            Format: ',0.00',
            Type: 'Float',
            CanEdit: 1,
            CanEmpty: 1,
            OnChange: 'Grid.SetValue(Row, "actualDepth", Value, 1)',
            ClassFormula: 'Grid.Helpers.isEmpty(actualDepth) && "TSClassReadOnly"',
            Formula: 'Grid.Component.props.getActualDepth(Grid, Row, Get, actualDepth)'
        },
        {
            Name: '_eventDuration',
            Type: 'Float',
            Visible: 0,
            CanHide: 0,
            CanPrint: 0,
            CanExport: 0,
            Formula: 'Grid.Component.props.getEventDuration(actualHours, dsvHours)'
        },
        {
            Name: 'start',
            Visible: 0,
            CanHide: 0,
            CanPrint: 0,
            CanExport: 0
        },
        {
            Name: '_start',
            Format: 'yyyy-M-d H:mm',
            Type: 'Date',
            CanEdit: 1,
            OnChange: `Grid.SetValue(Row, "start", Value, 1)`,
            ClassFormula: 'Grid.Helpers.isEmpty(start) && "TSClassReadOnly"',
            Formula: 'start ? start : Grid.Component.props.getEventStart(Grid, Row, Get)',
            MinWidth: 120
        },
        {
            Name: '_end',
            Format: 'yyyy-M-d H:mm',
            Type: 'Date',
            MinWidth: 120,
            Formula: 'Grid.Component.props.getEventEnd(_start, _eventDuration)'
        },
        {
            Name: 'deltaAfeActual',
            Type: 'Float',
            Visible: 0,
            CanHide: 0,
            CanPrint: 0,
            CanExport: 0,
            Formula: '(Grid.Helpers.isNotEmpty(afeHours) ? actualHours - afeHours : actualHours) / 24'
        },
        {
            Name: 'behindHours',
            MinWidth: 80,
            Type: 'Float',
            CanEmpty: 1,
            Format: '+,0.0; -,0.0; 0',
            Formula: 'Grid.Component.props.getBehindHours(Grid, Row, Get, deltaAfeActual)'
        },
        {
            Name: 'contractor',
            MinWidth: 120
        },
        {
            Name: 'comment',
            MinWidth: 120
        },
        {
            Name: 'experienceLinks',
            MinWidth: 80
        }
    ]

    return cols
}

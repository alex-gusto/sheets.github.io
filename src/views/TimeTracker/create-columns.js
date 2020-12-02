export default ({ isAux }) => {
    const cols = [
        {
            Name: 'targetHours',
            MinWidth: 80,
            CanEmpty: 1,
            Format: ',0.00',
            EditFormat: '',
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
        }
    ]

    return cols
}

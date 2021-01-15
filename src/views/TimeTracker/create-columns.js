export default ({ isAux }) => {
    const cols = [
        {
            Name: 'hours',
            MinWidth: 80,
            CanEmpty: 1,
            Format: ',0.00',
            EditFormat: '',
            Type: 'Float'
        },
        {
            Name: '_eventDuration',
            Type: 'Float',
            Visible: 0,
            CanHide: 0,
            CanPrint: 0,
            CanExport: 0,
            Formula: 'Grid.Component.props.getEventDuration(hours)'
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

export default ({ OperationStartDate, DerrickType, isAux }) => {
    const topBar = {
        id: 'topBar',
        Space: -1,
        Tag: 'timeGridTopBar',
        Cells: 'OperationStartDate',

        // OperationStartDate cell settings
        OperationStartDate,
        OperationStartDateLabel: 'Start operation: ',
        OperationStartDateWidth: 120,
        OperationStartDateFormat: 'yyyy-M-d H:mm',
        OperationStartDateType: 'Date',
        OperationStartDateRecalc: 256,
        OperationStartDateOnChange: 'Grid.Component.props.handleOperationStartDateChange(Grid,Value)',

        // DerrickType,
        // DerrickTypeType: 'Bool',
        // DerrickTypeLabel: 'Aux derrick: ',
        // DerrickTypeOnChange: 'Grid.Component.props.handleDerrickTypeChange(Grid,Value)',
    }

    const topBarAux = {
        id: 'topBarAux',
        Visible: 0,
        Cells: 'OperationStartDate',
        OperationStartDate,
        OperationStartDateRecalc: 256
    }

    return isAux ? [topBarAux] : [topBar]
}

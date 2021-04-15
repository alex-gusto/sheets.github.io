export default (OperationStartDate) => {
  const topBar = {
    id: 'topBar',
    Space: -1,
    Cells: 'OperationStartDate',
    
    // OperationStartDate cell settings
    OperationStartDate,
    OperationStartDateLabel: 'Start operation: ',
    OperationStartDateWidth: 120,
    OperationStartDateFormat: 'yyyy-M-d H:mm',
    OperationStartDateType: 'Date',
    OperationStartDateRecalc: 256,
    OperationStartDateOnChange: 'Grid.Component.props.handleOperationStartDateChange(Grid,Value)'
  }
  
  return [topBar]
}

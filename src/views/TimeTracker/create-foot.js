export default () => {
    const total = {
        id: 'Total',
        Class: 'time-grid-total',
        Color: '#D0E6F5',
        CanDelete: 0,
        CanEdit: 0,
        Calculated: 1,
        code: "SUM",

        // calculations
        dsvHoursFormula: 'sum()',
        actualHoursFormula: 'sum()',
        nptHoursFormula: 'sum()',
        wowHoursFormula: 'sum()',
        tftHoursFormula: 'sum()',
        targetHoursFormula: 'sum()',
        _plannedDepthFormula: '',
        _actualDepthFormula: '',
        _startFormula: '',
        _endFormula: 'Grid.GetLast() ? Get(Grid.GetLast(), "_end") : ""'
    }

    return [total]
}

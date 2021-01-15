export default () => {
    const total = {
        id: 'Total',
        Color: '#D0E6F5',
        CanDelete: 0,
        CanEdit: 0,
        Calculated: 1,
        code: "SUM",

        // calculations
        hoursFormula: 'sum()',
        _startFormula: '',
        _endFormula: 'Grid.GetLast() ? Get(Grid.GetLast(), "_end") : ""'
    }

    return [total]
}

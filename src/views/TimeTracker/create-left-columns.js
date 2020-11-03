export default () => {
    return [
        {
            Name: 'code',
            CanFilter: 1,
            MinWidth: 60,
            CaseSensitive: 0
        },
        {
            Name: 'name',
            RelWidth: 1,
            MinWidth: 250,
            Type: 'Text',
            CanFilter: 1,
            ClassFormula: 'afeHours === "" && "text-primary"',
            CaseSensitive: 0
        }
    ]
}

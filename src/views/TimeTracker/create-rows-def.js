export default () => {
    const commonGroupDef = {
        CanEdit: 0,
        Calculated: 1,

        nameCanEdit: 1,
        codeCanEdit: 1,

        // calculations
        hoursFormula: 'sum()',
        _startFormula: 'Row.firstChild ? Get(Row.firstChild, "_start") : ""',
        _endFormula: 'Row.lastChild ? Get(Row.lastChild, "_end") : ""',
    }

    const Well = {
        CDef: 'Phase',
        AcceptDef: 'Phase',

        Class: 'time-grid-well',
        Color: '#d7d7d7',

        ...commonGroupDef
    }

    const Phase = {
        CDef: 'Event',
        AcceptDef: 'Event',

        Class: 'time-grid-phase',
        Color: '#f0f0f0',

        ...commonGroupDef
    }

    const eventCalcOrder = [
        'nameClass',
        '_tftHours',
        '_plannedDepth',
        '_plannedDepthClass',
        '_actualDepth',
        '_actualDepthClass',
        '_eventDuration',
        '_start',
        '_startClass',
        '_end'
    ]

    const Event = {
        AcceptDef: '',

        CalcOrder: eventCalcOrder.join()
    }

    return { Well, Phase, Event }
}

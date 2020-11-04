export default () => {
    const commonGroupDef = {
        CanEdit: 0,
        Calculated: 1,

        nameCanEdit: 1,
        codeCanEdit: 1,

        // calculations
        dsvHoursFormula: 'sum()',
        actualHoursFormula: 'sum()',
        wowHoursFormula: 'sum()',
        nptHoursFormula: 'sum()',
        tftHoursFormula: 'sum()',
        afeHoursFormula: 'sum()',
        targetHoursFormula: 'sum()',
        _iltHoursFormula: 'sum()',
        _unPtHoursFormula: 'sum()',
        _plannedDepthFormula: 'calc("_plannedDepth ? _plannedDepth : Result")',
        _actualDepthFormula: 'calc("_actualDepth ? _actualDepth : Result")',
        _startFormula: 'Row.firstChild ? Get(Row.firstChild, "_start") : ""',
        _endFormula: 'Row.lastChild ? Get(Row.lastChild, "_end") : ""',
        behindHoursFormula: 'calc("behindHours ? behindHours : Result")'
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
        'deltaAfeActual',
        'behindHours',
        '_tftHours',
        '_unPtHours',
        '_unPtHoursClass',
        '_iltHours',
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

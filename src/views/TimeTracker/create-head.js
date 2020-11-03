import centerHeader from '../../components/TreeGridComponent/utils/center-header'

export default () => {
    const mainHeader = {
        Pos: 'Pos',
        name: "Name",
        code: "Code",
        afeHours: 'AFE',
        targetHours: 'Target',
        dsvHours: 'DSV',
        actualHours: 'Actual',
        nptHours: 'NPT',
        wowHours: 'WOW',
        _tftHours: 'TFT',
        _unPtHours: 'UN-PT',
        _iltHours: 'ILT',
        _plannedDepth: 'Planned',
        _actualDepth: 'Actual',
        _start: 'Start',
        _end: 'End',
        behindHours: 'Days -ahead/+behind',
        contractor: 'Contractor',
        comment: 'Comment',
        experienceLinks: 'Ex Links'
    }

    // set align for header' key
    // http://www.treegrid.com/Doc/ColBasics.htm#HeaderCellvalue
    Object.keys(mainHeader).forEach((key) => centerHeader(key, mainHeader))

    mainHeader.id = 'Header'

    const upHeader = {
        code: 'Identification',
        afeHours: 'Duration [h]',
        plannedDepth: 'End Depth [mMD]',
        start: 'Timing',
        contractor: 'Annotation'
    }

    Object.keys(upHeader).forEach((key) => centerHeader(key, upHeader))

    // merge spanning
    Object.assign(upHeader, {
        Kind: 'Header',
        Spanned: 1,
        Pos: '',
        PosSpan: 2,
        codeSpan: 2,
        afeHoursSpan: 10,
        plannedDepthSpan: 4,
        startSpan: 5,
        contractorSpan: 3
    })

    return [
        upHeader,
        mainHeader
    ]
}

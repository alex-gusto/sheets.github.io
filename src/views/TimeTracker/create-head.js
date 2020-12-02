import centerHeader from '../../components/TreeGridComponent/utils/center-header'

export default () => {
    const mainHeader = {
        Pos: 'Pos',
        name: "Name",
        code: "Code",
        targetHours: 'Rounding bug',
        dsvHours: 'DSV',
        actualHours: 'Actual',
        nptHours: 'NPT',
        wowHours: 'WOW',
        _tftHours: 'TFT',
        _plannedDepth: 'Planned',
        _actualDepth: 'Actual',
        _start: 'Start',
        _end: 'End'
    }

    // set align for header' key
    // http://www.treegrid.com/Doc/ColBasics.htm#HeaderCellvalue
    Object.keys(mainHeader).forEach((key) => centerHeader(key, mainHeader))

    mainHeader.id = 'Header'

    return [
        mainHeader
    ]
}

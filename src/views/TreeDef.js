export default {
    Cfg: {
        CfgId: 'Costs',
        ShowDeleted: "0",
        SuppressCfg: '0',
        AutoSort: "0",
        DateStrings: '1',
        ReloadChanged: '3',
        MainCol: 'name',
        NoVScroll: 0,
        Sorting: 0,
        Paging: 2,
        PageLength: 1,
        AutoUpdate: 0,
        StandardFilter: 3,
        SaveExpanded: 1,
        PersistentCfg: 2,
        Filtered: 0
    },
    Actions: {
        OnRightClickCell: 'Grid.Component.showCustomMenu(Row,Col)' // Custom event handler, shows the calling method of the framework component; Shows some custom popup menu on right click to any cell
    },
    Def: {
        R: {
            Expanded: 0
        },
        Cost: {},
        CostGroup: {
            CanEdit: 0,
            Calculated: 1,
            nameCanEdit: 1,
            codeCanEdit: 1,
            populateDailyFormula: 'sum()'
        }
    },
    DefCols: {
        C: {
            CanFilter: 0
        }
    },
    LeftCols: [
        { Name: 'name', RelWidth: 1, MinWidth: 250, Type: 'Text', CanFilter: 1, CaseSensitive: 0 },
        { Name: 'code', CanFilter: 1, CaseSensitive: 0 },
        {
            Name: 'type', Width: '80',
            Type: 'Enum',
            Enum: ['|tangible', 'intangible', 'consumable'].join('|')
        },
        {
            Name: 'unit',
            Width: '90',
            Type: 'Enum',
            Enum: ['|day rate', 'lump sum', 'unit cost', 'depth based'].join('|')
        },
        { Name: 'rate', Width: '90' },
        { Name: 'currency', Width: '90', Type: 'Enum', Enum: ["|AUD", "EUR", "GBP", "NOK", "USD"].join('|') },
        { Name: 'populateDaily', Width: '90', OnChange: "Grid.Component.populate(Grid, Row, Value)" }
    ],
    Cols: [
        { Name: 'prior' },
        {
            Name: 'day-2016-06-13',
            Formula: 'day-2016-06-13 ? day-2016-06-13 : Get(Row, "populatedDay-2016-06-13")',
            CanEdit: 1
        },
        {
            Name: 'day-2016-06-13/1'
        },
        { Name: 'day-2016-06-14' },
        { Name: 'day-2016-06-14/1' },
        { Name: 'day-2016-06-15' },
        { Name: 'afterOffhire' }
    ],
    Header: {
        name: "Name",
        code: "Code",
        type: "Type",
        unit: "Unit",
        rate: "Rate",
        currency: "Currency",
        populateDaily: "Populate Daily",
        prior: "Before onhire",
        'day-2016-06-13': "2016-06-13",
        'day-2016-06-13/1': "2016-06-13/1",
        'day-2016-06-14': "2016-06-14",
        'day-2016-06-14/1': "2016-06-14/1",
        'day-2016-06-15': "2016-06-15",
        afterOffhire: "After offhire"
    },
    // Root: { CDef: 'Node' },
    Head: [
        {
            Kind: 'Filter',
            nameFilter: 11,
            codeFilter: 11
        }
    ],
    Foot: [
        {
            id: 'Fix1',
            CanDelete: '0',
            CanEdit: '0',
            Calculated: '1',
            name: "Total income",
            populateDailyFormula: 'sum()'
        }
    ]
}

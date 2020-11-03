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
        AutoUpdate: 1,
        StandardFilter: 3,
        SaveExpanded: 1,
        PersistentCfg: 2,
        Filtered: 0,
        DebugCalc: 1
    },
    Actions: {
        OnRightClickCell: 'Grid.Component.showCustomMenu(Row,Col)' // Custom event handler, shows the calling method of the framework component; Shows some custom popup menu on right click to any cell
    },
    Def: {
        R: {
            Expanded: 1
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
            Name: 'day-2016-06-13_1',
            Formula: 'day-2016-06-13_1 ? day-2016-06-13_1 : Get(Row, "populatedDay-2016-06-13_1")',
            CanEdit: 0
        },
        {
            Name: 'X',
            Formula: 'Grid.Component.isAcc ? day-2016-06-13 + day-2016-06-13_1 : day-2016-06-13_1',
            OnChange: 'Grid.SetValue(Row,"day-2016-06-13_1",Value,1)',
            // Formula: 'day-2016-06-13_1 ? day-2016-06-13_1 : Get(Row, "populatedDay-2016-06-13_1")',
            CanEdit: 1
        },
        {
            Name: 'day-2016-06-14',
            CanEdit: 0
        },
        {
            Name: 'Y',
            Formula: 'Grid.Component.isAcc ? X + day-2016-06-14 : day-2016-06-14',
            OnChange: 'Grid.SetValue(Row,"day-2016-06-14",Value,1)',
            // Formula: 'day-2016-06-13_1 ? day-2016-06-13_1 : Get(Row, "populatedDay-2016-06-13_1")',
            CanEdit: 1
        },
        {
            Name: 'day-2016-06-14_1',
            // Formula: 'day-2016-06-14_1 ? day-2016-06-14_1 : Get(Row, "populatedDay-2016-06-14_1")',
            CanEdit: 1
        },
        {
            Name: 'day-2016-06-15',
            // Formula: 'day-2016-06-15 ? day-2016-06-15 : Get(Row, "populatedDay-2016-06-15")',
            CanEdit: 1
        },
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
        'day-2016-06-13_1': "2016-06-13/1",
        'day-2016-06-14': "2016-06-14",
        'day-2016-06-14_1': "2016-06-14/1",
        'day-2016-06-15': "<span class='vertical-lr'>2016-06-15</span>",
        afterOffhire: "After offhire",
        NoEscape: 1
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

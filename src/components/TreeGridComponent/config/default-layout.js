export default {
  Cfg: {
    Code: 'STRESBEJONTRYB', // licensed code
    FocusRect: 2,
    SelectingCells: 2,
    SelectingFocus: 1,
    ShowDeleted: 0,
    NoVScroll: 0
  },
  Actions: {
    OnCtrlDragRow: 'DragSelected',
    OnDragRow: 'FocusCells',
    OnDel: '!StartEditEmpty' // prevent delete rows on del button pressing
  },
  Toolbar: {
    Cells60Cfg: 'Columns,Help',
    Cells70Styles: 'Sizes'
  },
  Panel: {
    PanelCopyMenu:
      'CopyRowBelow,CopyRowsBelow@F,CopyTree,CopyRowsTreeBelow@F,CopySelected@S,CopySelectedTree@S,CopySelectedChildEnd,CopySelectedTreeChildEnd,-,AddRowBelow,AddRowsBelow@2,CopyEmptyBelow,CopyRowsEmptyBelow@2,CopySelectedEmpty,-,AddChildEnd,CopySelectedEmptyChildEnd'
  },
  Lang: {
    Format: {
      GroupSeparator: ' ',
      GMT: 0
    }
  }
}

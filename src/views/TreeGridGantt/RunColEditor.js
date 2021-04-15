import { GANTT_COL_NAME } from './create-col-name'

const cols = [
  {
    Name: 'Text',
    CanSort: 0
  },
  {
    Name: 'Start',
    Type: 'Date',
    MinWidth: 80,
    CanSort: 0
  },
  {
    Name: 'Duration',
    Type: 'Float',
    MinWidth: 80,
    CanSort: 0
  },
  {
    Name: 'End',
    Type: 'Date',
    MinWidth: 80,
    CanSort: 0,
    Formula: 'Start + Duration * 1000 * 60 * 60'
  }
]

function getPopupGridBody(cellValue) {
  return Function(`return ${cellValue}`)()
}

class RunColEditor {
  constructor({ id, colName = 'events' } = {}) {
    this.gridId = id
    this.colName = colName
  }
  
  createPopupLayout = cellValue => {
    const body = getPopupGridBody(cellValue)
    console.log(body)
    return {
      Toolbar: {
        Cells: 'Cancel,Ok',
        
        AddOnClick: 'AddRowEnd',
        
        Cancel: 'Cancel',
        CancelButton: 'Button',
        CancelOnClick: 'Grid.ParentDialog.Close(); return 1;',
        
        Ok: 'Save',
        OkButton: 'Button',
        OkOnClick: `Grids["${this.gridId}"].Component.props.handleRunEditorSave(Grid); Grid.ParentDialog.Close(); return 1;`
      },
      Cols: cols,
      Body: [body]
    }
  }
  
  onStartEdit = (grid, row, col) => {
    const cellValue = grid.GetValue(row, this.colName)
    return grid.ShowPopupGrid(row, col, this.createPopupLayout(cellValue))
  }
  
  onSave = grid => {
    if (!grid.HasChanges()) return
    grid.EndEdit(1) // Finishes editing if any http://www.treegrid.com/Doc/CellEdit.htm?Mark=EndEdit#EndEdit
    
    const { Row } = grid.ParentDialog
    const mainGrid = grid.ParentGrid
    const changes = JSON.parse(grid.GetChanges()).Changes
    changes.forEach(row => {
      const box = mainGrid.GetGanttRunBox(Row, GANTT_COL_NAME, row.id)
      console.log(box, row)
      console.log(mainGrid.SetGanttRunBox(Object.assign(box, row)))
    })
  }
}

export default RunColEditor

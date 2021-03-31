import React, { useEffect } from 'react'
import TreeGridComponent from '../../components/TreeGridComponent'
import createLayout from './create-layout'
import createBody from './create-body'
import dataService from '../../db/dataService'
import DataListManager from './DataListManager'

const GRID_ID = 'GANTT'

const { TGAddEvent } = window

const TreeGridGant = () => {
  const layout = createLayout()
  const body = createBody()
  let dialog = null
  
  useEffect(() => {
    TGAddEvent('OnDragGanttRun', GRID_ID, (grid, row, col, index, start, newData, oldData, change, dir, XY, keyPrefix, X, Y) => {
      const date = new Date(newData).toString().substr(0, 21)
      if (dialog) {
        const inputEl = dialog.Tag.getElementsByTagName("input")[0]
        inputEl.value = date
        return
      }
      
      dialog = window.ShowDialog(
        {
          Body: `<input type="text" style="width: 140px" value="${date}">`
        },
        {
          X, Y: Y + 12
        }
      )
    })
    
    TGAddEvent('OnEndDragGanttRun', GRID_ID, (grid, row, col, index, start, newData) => {
      dialog.Close()
      dialog = null
    })
  }, [])
  
  const onDataChanged = (newData) => {
    const dataManager = new DataListManager(dataService.getPhasesAux(), 'Items')
    const events = Function(`return ${newData[1].events}`)()
    events.forEach(({ Id, Start, Duration, Text }) => {
      dataManager.updateItem(Id, {
        start: +new Date(Start),
        hours: Duration,
        name: Text
      })
    })
    
    dataService.save('PhasesAux', dataManager.data)
  }
  
  return <TreeGridComponent id={GRID_ID} ganttRunKey={'events'} layout={layout} body={body}
                            onDataChanged={onDataChanged}/>
}

export default TreeGridGant

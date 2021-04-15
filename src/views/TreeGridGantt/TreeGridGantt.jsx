import React, { useEffect, useRef, useMemo } from 'react'
import TreeGridComponent from '../../components/TreeGridComponent'
import createLayout from './create-layout'
import createBody from './create-body'
import dataService from '../../db/dataService'
import DataListManager from './DataListManager'
import last from 'lodash/last'
import RunColEditor from './RunColEditor'

const GRID_ID = 'GANTT'

const { TGAddEvent } = window

const TreeGridGant = () => {
  const runEditor = useRef(new RunColEditor({ id: 'GANTT' }))
  const layout = useMemo(() => createLayout(), [])
  const body = useMemo(() => createBody(), [])
  let dialog = null
  let inputEl = null
  
  const handleRunColStartEdit = (...args) => runEditor.current.onStartEdit(...args)
  const handleRunEditorSave = (...args) => runEditor.current.onSave(...args)
  // useEffect(() => {
  //   TGAddEvent('OnDragGanttRun', GRID_ID, (grid, row, col, index, start, newData, oldData, change, dir, XY, keyPrefix, X, Y) => {
  //     const date = new Date(newData).toString().substr(0, 21)
  //     if (dialog) {
  //       inputEl = dialog.Tag.getElementsByTagName("input")[0]
  //       inputEl.value = date
  //       return
  //     }
  //
  //     dialog = window.ShowDialog(
  //       {
  //         Body: `<div style="display: flex; align-items: center;">
  //           <input type="text" style="width: 140px" value="${date}">
  //           <button class="TSDateRight date" style="background-color: transparent;border: 0;width: 20px;height: 20px;padding: 0;cursor: pointer;"></button>
  //           <button class="close" style="background-color: transparent;border: 0;width: 20px;height: 20px;padding: 0;cursor: pointer;">x</button>
  //         </div>`
  //       },
  //       {
  //         X, Y: Y + 12
  //       }
  //     )
  //
  //     const buttonEl = dialog.Tag.getElementsByClassName("date")[0]
  //     const closeButtonEl = dialog.Tag.getElementsByClassName("close")[0]
  //
  //     closeButtonEl.addEventListener("click", () => {
  //       dialog.Close();
  //       dialog = null
  //     })
  //
  //     buttonEl.addEventListener("click", () => {
  //       window.ShowCalendar(
  //         {
  //           Date: newData,
  //           HeadClose: 1,
  //           TimeFormat: 'HH:mm',
  //           OnSave(d) {
  //             inputEl.value = new Date(d).toString().substr(0, 21)
  //           }
  //         },
  //         {
  //           X, Y
  //         }
  //       )
  //     })
  //   })
  //
  //   TGAddEvent('OnEndDragGanttRun', GRID_ID, (grid, row, col, index, start, newData) => {
  //     // dialog.Close()
  //     // dialog = null
  //   })
  // }, [])
  
  const onDataChanged = (newData) => {
    // const dataManager = new DataListManager(dataService.data.PhasesAux, 'Items')
    
    newData.forEach(row => {
      let { events, CanEdit, id: gridID } = row
      
      const grid = window.Grids[gridID]
      if (!grid) return
      
      grid.StartUpdate()
      
      if (CanEdit === 0) return
      
      if (typeof events === 'string') {
        events = Function(`return ${events}`)()
      }
      events.forEach(({ Id, Start, Duration, Text, State }) => {
        if (!State) return
        
        const _row = grid.GetRowById(Id)
        
        grid.SetValue(_row, 'start', +new Date(Start))
        grid.SetValue(_row, 'hours', +Duration)
        grid.SetValue(_row, 'name', Text)
        
        // dataManager.updateItem(Id, {
        //   start: +new Date(Start),
        //   hours: Duration,
        //   name: Text
        // })
      })
      
      grid.EndUpdate()
    })
    
    // dataService.save('PhasesAux', dataManager.data)
  }
  
  return <TreeGridComponent id={GRID_ID} ganttRunKey={'events'} layout={layout} body={body}
                            onDataChanged={onDataChanged} handleRunEditorSave={handleRunEditorSave}
                            handleRunColStartEdit={handleRunColStartEdit}/>
}

export default TreeGridGant

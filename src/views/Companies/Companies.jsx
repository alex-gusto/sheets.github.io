import React, { useMemo, useState } from 'react'
import createLayout from './create-layout'
import TreeGridComponent from '../../components/TreeGridComponent'
import dataService from '../../db/dataService'

const GRID_ID = 'Companies'

const Companies = () => {
  const [body, setBody] = useState(dataService.getCompanies())
  const layout = useMemo(createLayout, [])
  
  const onDataChanged = (newData) => {
    setBody(newData)
    dataService.save('Companies', newData)
  }
  
  return <TreeGridComponent id={GRID_ID} layout={layout} onDataChanged={onDataChanged}
                            body={body}/>
}

export default Companies

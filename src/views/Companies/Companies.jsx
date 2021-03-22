import React, { useMemo } from 'react'
import createLayout from './create-layout'
import TreeGridComponent from '../../components/TreeGridComponent'
import dataService from '../../db/dataService'

const GRID_ID = 'Companies'

const Companies = () => {
  const layout = useMemo(createLayout, [])
  
  return <TreeGridComponent id={GRID_ID} layout={layout} body={dataService.getCompanies()}/>
}

export default Companies

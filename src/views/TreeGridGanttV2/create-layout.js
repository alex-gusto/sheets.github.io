import createLeftCols from './create-left-cols'
import createCols from './create-cols'
import mergeLayouts from '../../components/TreeGridComponent/utils/merge-layouts'
import staticLayout from './static-layout'
import createSolid from './create-solid'
import dataService from '../../db/dataService'

export default () => {
  const dynamicLayout = {
    LeftCols: createLeftCols(),
    Cols: createCols(dataService.getStartTime()),
    Solid: createSolid(dataService.getStartTime())
  }
  
  return mergeLayouts(staticLayout, dynamicLayout)
}

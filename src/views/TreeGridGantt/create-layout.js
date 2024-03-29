import createCols from './create-cols'
import createLeftCols from './create-left-cols'
import createRightCols from './create-right-cols'
import mergeLayouts from '../../components/TreeGridComponent/utils/merge-layouts'
import staticLayout from './static-layout'
import createSolid from './create-solid'
import dataService from '../../db/dataService'
import createHead from './create-head'

export default () => {
  const dynamicLayout = {
    Head: createHead(),
    Cols: createCols(),
    LeftCols: createLeftCols(),
    RightCols: createRightCols(dataService.getStartTime()),
    Solid: createSolid(dataService.getStartTime())
  }
  
  return mergeLayouts(staticLayout, dynamicLayout)
}

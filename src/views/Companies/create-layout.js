import mergeLayouts from '../../components/TreeGridComponent/utils/merge-layouts'
import staticLayout from './static-layout'
import createColumns from './create-columns'
import createHead from './create-head'
import createFoot from './create-foot'
import dataService from '../../db/dataService'
import createLeftColumns from './create-left-columns'

export default () => {
  const dynamicLayout = {
    Foot: createFoot(dataService.days),
    Head: createHead(dataService.days),
    LeftCols: createLeftColumns(),
    Cols: createColumns(dataService.days)
  }
  
  return mergeLayouts(staticLayout, dynamicLayout)
}

import mergeLayouts from '../../components/TreeGridComponent/utils/merge-layouts'
import staticLayout from './static-layout'
import createColumns from './create-columns'
import createHead from './create-head'
import createFoot from './create-foot'
import dataService from '../../db/dataService'
import createLeftColumns from './create-left-columns'

export default () => {
  const days = dataService.getDays()
  
  const dynamicLayout = {
    Foot: createFoot(days),
    Head: createHead(days),
    LeftCols: createLeftColumns(),
    Cols: createColumns(days)
  }
  
  return mergeLayouts(staticLayout, dynamicLayout)
}

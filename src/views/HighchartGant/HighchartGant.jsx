import React, { useState } from 'react'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import dataService from '../../db/dataService'

require('highcharts/modules/gantt')(Highcharts)
require('highcharts/modules/draggable-points')(Highcharts)

const HighchartGant = () => {
  var today = new Date(),
    day = 1000 * 60 * 60 * 24;

// Set to 00:00:00:000 today
  today.setUTCHours(0);
  today.setUTCMinutes(0);
  today.setUTCSeconds(0);
  today.setUTCMilliseconds(0);
  today = today.getTime();
  
  let prevEvent = null
  const start = dataService.getStartTime()
  const collectEvents = (acc, item) => {
    if (item.Items) {
      item.Items.reduce((ac, item) => collectEvents(ac, item), acc)
    } else {
      item.end = (item.start || start) + (item.hours * 60 * 60 * 1000)
      item.start = prevEvent ? prevEvent.end : start
      item.y = 0
      prevEvent = item
      acc.push(item)
    }
    
    return acc
  }
  
  const events = dataService.getPhases().reduce((acc, item) => collectEvents(acc, item), [])
  console.log(events)
  
  const [options] = useState({
    title: {
      text: 'Intraday jobs Scheduling'
    },
    xAxis: {
      currentDateIndicator: true
    },
    
    yAxis: {
      categories: ['Main', 'Aux']
    },
    
    plotOptions: {
      series: {
        dragDrop: {
          draggableX: true,
          dragMinY: 0,
          dragMaxY: 2,
          dragPrecisionX: 1000 * 60
        },
        dataLabels: {
          enabled: true,
          format: '{point.name}'
        },
        allowPointSelect: true,
        point: {
          events: {
            drag(e) {
              console.log(e)
            }
          }
        }
      }
    },
    
    series: [{
      name: 'Init M1, Import FIRT market data',
      data: events
    }]
  })
  
  return (
    <HighchartsReact
      containerProps={{ style: { height: '100%' } }}
      highcharts={Highcharts}
      constructorType='ganttChart'
      options={options}
    />
  )
}

export default HighchartGant

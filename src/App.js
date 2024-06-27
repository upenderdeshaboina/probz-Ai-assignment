import {useState} from 'react'
import './App.css'

import Chart from './components/chart'
import Timeframeselector from './components/Timeframeselector'

const App=()=>{
  const [timeFrame,setTimeFrame]=useState('daily')
  return (
    <div className='main-container'>
      <Timeframeselector selectOption={setTimeFrame}/>
      <Chart timeFrame={timeFrame}/>
    </div>
  )
}
export default App
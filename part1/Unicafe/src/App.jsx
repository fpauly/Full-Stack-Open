import { useState } from 'react'

const MyButton = (props) => {
  return (
    <button onClick={props.onClick}>
      {props.text}
    </button>
  )
}
const MyStatistic = (props) => {
  return (
    <div>
      <p>{props.text} {props.value}</p>
    </div>
  )
}
const MyAverage = (props)=>{
 
  const score = props.value[0]*1+props.value[1]*0+props.value[2]*-1
  const all = props.value[0]+props.value[1]+props.value[2]
  let value = 0
  let posValue = 0
 
  if (all!==0){
    value = score/all;
    
  }

  

  return (
    <div>
      <p>{props.text} {value}</p>
    </div>
  )
}

const MyPersentage = (props)=>{
 
  const score = props.value[0]
  const all = props.value[0]+props.value[1]+props.value[2]
  let value = 0.0
  
 
  if (all!==0){
  
    value = score/all;
   
    value = value*100;
   
  }

  

  return (
    <div>
      <p>{props.text} {value} %</p>
    </div>
  )
}
const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)



  return (
    <div>
      <h1>give feedback</h1>
      <MyButton onClick={() => setGood(good + 1)} text='good' />
      <MyButton onClick={() => setNeutral(neutral + 1)} text='neutral' />
      <MyButton onClick={() => setBad(bad + 1)} text='bad' />

      <MyStatistic text='good' value={good} />
      <MyStatistic text='neutral' value={neutral} />
      <MyStatistic text='bad' value={bad} />
      <MyStatistic text='all' value={good + neutral + bad} />
      
      <MyAverage text="Average" value={[good,neutral,bad]}/>
      <MyPersentage text="positive" value={[good,neutral,bad]}/>
    </div>
  )
}

export default App
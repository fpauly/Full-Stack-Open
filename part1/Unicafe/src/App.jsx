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
      <tr><td>{props.text} </td><td>{props.value}</td></tr>
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
      <tr><td>{props.text} </td><td>{value}</td></tr>
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
      <tr><td>{props.text} </td><td>{value} %</td></tr>
  )
}

const StatisticLine=(props)=>{
  switch(props.name){
    case 'good':
      return MyStatistic(props);
    case 'neutral':
      return MyStatistic(props);
    case 'bad':
      return MyStatistic(props);
    case 'all':
      return MyStatistic(props);
    case 'average':
      return MyAverage(props);
    case 'positive':
      return MyPersentage(props);
    
  }
}

const Statistics=(props)=>{
  const good = props.good;
  const neutral = props.neutral;
  const bad = props.bad;
  const all = good + neutral + bad
  if(all>0){
    return( 
      <div>
      <table>
      <tbody>
      <StatisticLine name='good' text='good' value={good} />
      <StatisticLine name='neutral' text='neutral' value={neutral} />
      <StatisticLine name='bad' text='bad' value={bad} />
      <StatisticLine name='all' text='all' value={good + neutral + bad} />
      <StatisticLine name='average' text="average" value={[good,neutral,bad]}/>
      <StatisticLine name='positive' text="positive" value={[good,neutral,bad]}/>
      </tbody>
      </table>
      </div>
    )
  }
  else  {
   
    return <div><p>No feedback given</p></div>
  }
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
      <h2>statistics</h2>
      <Statistics good = {good} neutral = {neutral} bad = {bad} />
    </div>
  )
}

export default App
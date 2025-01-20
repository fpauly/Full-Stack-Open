import { useState } from 'react'


const anecdotes = [
  'If it hurts, do it more often.',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
  'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
  'The only way to go fast, is to go well.'
]

const Anecdotes=(props)=>{

  return(
    <div>
    
      {anecdotes[props.selected]}
    </div>
  )
}

const VoteResult=(props)=>{
  if(props.max>0){
    return(
      <div>
      <div>
        {anecdotes[props.index]}
      </div>
      <div>
        has {props.max} votes
      </div>
      </div>
    )
  }
  else {
    return(<div>There are no votes yet. Please vote for your favorite.</div>)
    
  }
  
}
const ButtonNext=(props)=>{
  return(
    <button name={props.name} onClick={props.onClick}>{props.text}</button>
  )
}
const ButtonVote=(props)=>{
  return(
    <button name={props.name} onClick={props.onClick}>{props.text}</button>
  )
}

const VoteResults=(props)=>{
  return(
    <div>
      <p>has {props.voteResult} votes</p>
    </div>
  )
}
const App = () => {
  
   
  const [selected, setSelected] = useState(0)
  const [votes,setVotes] = useState(Array(8).fill(0))//8 anecdotes
  const [mostVoteIndex,setMostVoteIndex] =useState(0)
  let mostVote = 0
  
  
  // console.log(votes)

  const randomSelect=()=>{
    const max = 7
    const ranInt = Math.floor(Math.random()*(max+1))//0 to 7
    setSelected(ranInt)
  }

  const voteAnecdote=()=>{
    const newVotes = [...votes]
    newVotes[selected]+=1
    
    setVotes(newVotes)
    
    mostVote = Math.max(...newVotes)
    setMostVoteIndex(newVotes.indexOf(mostVote))
 
  }


  return (
    <div>
      <h1>Anecdote of the Day</h1>
      <Anecdotes name='anecdote' selected = {selected}/>
      <VoteResults name='voteResults' voteResult={votes[selected]}/>
      <ButtonVote name='vote' text='vote' onClick = {()=>voteAnecdote()}/>
      <ButtonNext name='random' text='next anecdote' onClick = {()=>randomSelect()}/>
      <h2>Anecdote with most votes</h2>
      <VoteResult name='most' max = {votes[mostVoteIndex]} index={mostVoteIndex}/>
    </div>
  )
}

export default App
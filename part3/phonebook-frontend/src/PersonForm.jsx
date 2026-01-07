const PersonForm = (props)=>{
    return(

        <form onSubmit={props.onSubmit}>
        <div>
          name: <input required value={props.newName} onChange={props.onNewNameChange} />
        </div>
        <div>
          number: <input required value={props.newNumber} onChange={props.onNewNumberChange} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    )
}

export default PersonForm
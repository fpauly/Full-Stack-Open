import axios from "axios";
const baseUrl = 'http://localhost:3001/persons';

const getAll = ()=> {
    return (axios.get(baseUrl))
}

const addNew = (newObj)=>{
    return( axios.post(baseUrl,newObj))
}

const update = (id,newObj)=>{
    const updateUrl = `${baseUrl}/${id}`
    console.log(updateUrl)
    return(axios.put(updateUrl,newObj))
}
const delRecord = (id)=>{
    const delUrl = `${baseUrl}/${id}`
    return (axios.delete(delUrl))
}


export default {
    getAll,
    addNew,
    update,
    delRecord
}
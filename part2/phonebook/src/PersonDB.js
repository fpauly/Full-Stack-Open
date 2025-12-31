import axios from "axios";
const baseUrl = 'http://localhost:3001/persons/';

const getAll = ()=> {
    return (axios.get(baseUrl))
}

const addNew = (newObj)=>{
    return( axios.post(baseUrl,newObj))
}

const update = (id,newObj)=>{
    const updateUrl = `${baseUrl}/${id}`
    return(axios.put(updateUrl,newObj))
}

export default {
    getAll,
    addNew,
    update
}
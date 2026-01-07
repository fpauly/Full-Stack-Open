import axios from "axios";
const baseUrl = '/api/persons';

const getAll = ()=> {
    return (axios.get(baseUrl).then(res => res.data))
}

const addNew = (newObj)=>{
    return( axios.post(baseUrl,newObj).then(res => res.data))
}

const update = (id,newObj)=>{
    const updateUrl = `${baseUrl}/${id}`
    console.log(updateUrl)
    return(axios.put(updateUrl,newObj).then(res => res.data))
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
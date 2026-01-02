import axios from 'axios'
const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api';

const getAll = async()=> {
    const response = await axios.get(`${baseUrl}/all`)
    return response.data
}

const findByName = async(name)=> {
    const {data} = await axios.get(`${baseUrl}/${encodeURIComponent(name)}`)
    return data
}




export default {
    getAll,
    findByName
}
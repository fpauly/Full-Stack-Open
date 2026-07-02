import axios from 'axios'

const baseUrl = '/api/login'

const login = async credentials => {
    try {
        const response = await axios.post(baseUrl, credentials)
        return response.data
    } catch (error) {
        console.log('RAW ERROR:', error)
        console.log('error.message:', error.message)
        console.log('error.code:', error.code)
        console.log('error.response:', error.response)
        throw error
    }
}

export default { login }
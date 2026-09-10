import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './utils/AxiosConfig'//引用一次处理token过期或者别的状况
import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Router>
    <App />
  </Router>
)

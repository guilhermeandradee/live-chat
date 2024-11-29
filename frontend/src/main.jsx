import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter } from 'react-router-dom'
import MainRoutes from './Routes.jsx';

import './components/init.jsx'

window.global = window;

createRoot(document.getElementById('root')).render(
  
  <BrowserRouter>
    <MainRoutes/>
  </BrowserRouter>,
  
  
)

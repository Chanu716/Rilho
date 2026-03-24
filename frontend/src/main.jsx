import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Expired from './pages/Expired.jsx'
import Protected from './pages/Protected.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard/:code" element={<Dashboard />} />
        <Route path="/expired" element={<Expired />} />
        <Route path="/protected/:code" element={<Protected />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)

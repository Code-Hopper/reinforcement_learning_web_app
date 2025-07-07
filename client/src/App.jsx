import React from 'react'
import { UserProvider } from "./context/userContext.jsx"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LoginRegisterPage from "./components/pages/LoginRegisterPage.jsx"
import Dashboard from './components/sections/dashboard/Dashboard.jsx'

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginRegisterPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </UserProvider>
  )
}

export default App

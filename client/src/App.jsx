import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import LoginRegisterPage from "./components/pages/LoginRegisterPage.jsx"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginRegisterPage />} />
      </Routes>
    </Router>
  )
}

export default App

import { Route, Routes, Navigate } from "react-router"
import LoginPage from "./pages/login.page"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
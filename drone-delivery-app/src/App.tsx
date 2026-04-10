import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/login'
import Shopping from './pages/shoping'
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/shopping" element={<Shopping />} />
    </Routes>
  )
}
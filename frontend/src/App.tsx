import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import { Landing } from './pages/Landing'
import Register from './pages/Register'
import Home from './pages/Home'
import SidebarLayout from './components/SidebarLayout'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route element={<SidebarLayout />}>
              <Route path={`/dashboard`} element={<Home />} />
            </Route>
            <Route path={`/register`} element={<Register />} />
            <Route path={`/`} element={<Landing />} />
          </Routes>
        </BrowserRouter >
      </div >
    </>
  )
}

export default App

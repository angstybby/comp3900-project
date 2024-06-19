import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import { Landing } from './pages/Landing'
import Register from './pages/Register'
import Home from './pages/Home'
import Upload from './pages/Upload'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route path={`/`} element={<Landing/>}/>
            <Route path={`/register`} element={<Register/>}/>
            <Route path={`/home`} element={<Home/>}/>
            <Route path={`/upload`} element={<Upload/>}/>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  )
}

export default App

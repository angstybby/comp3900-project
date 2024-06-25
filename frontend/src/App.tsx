import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import { Landing } from './pages/Landing'
import Register from './pages/Register'
import Home from './pages/Home'
import Upload from './pages/Upload'
import SidebarLayout from './components/SidebarLayout'
import Courses from './pages/Courses'
import Groups from './pages/Groups'
import Projects from './pages/Projects'
import Profile from './pages/Profile'
import CourseReco from './pages/CourseReco'
import Notifications from './pages/Notification'

function App() {
  return (
    <>
      <div>
        <BrowserRouter>
          <Routes>
            <Route element={<SidebarLayout />}>
              <Route path={`/dashboard`} element={<Home />} />
              <Route path={`/courses`} element={<Courses />} />
              <Route path={`/groups`} element={<Groups />} />
              <Route path={`/projects`} element={<Projects />} />
              <Route path={`/notifications`} element={<Notifications />} />
              <Route path={`/profile`} element={<Profile />} />
            </Route>
            <Route path={`/register`} element={<Register />} />
            <Route path={`/upload`} element={<Upload/>}/>
            <Route path={`/courseRecommendations`} element={<CourseReco/>}/>
            <Route path={`/`} element={<Landing />} />
          </Routes>
        </BrowserRouter >
      </div >
    </>
  )
}

export default App

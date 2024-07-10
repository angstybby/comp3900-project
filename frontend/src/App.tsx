import { Routes, Route, BrowserRouter } from 'react-router-dom'
import './App.css'
import Landing from '@/pages/Landing'
import Register from '@/pages/Register'
import Home from '@/pages/Home'
import Upload from '@/pages/Upload'
import SidebarLayout from './components/Sidebar/SidebarLayout'
import Courses from '@/pages/Courses'
import Groups from '@/pages/Groups'
import Projects from '@/pages/Projects'
import Profile from '@/pages/Profile'
import CourseReco from '@/pages/CourseReco'
import Admin from '@/pages/Admin'
import ResetPassword from '@/pages/ResetPassword'
import CourseDetails from '@/pages/CourseDetails'
import { ProfileProvider } from '@/contexts/ProfileContext'
import { ModalProvider } from '@/contexts/DeleteModalContext'

function App() {
  return (
    <ModalProvider>
      <ProfileProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<SidebarLayout />}>
              <Route path={`/dashboard`} element={<Home />} />
              <Route path={`/courses`} element={<Courses />} />
              <Route path={`/groups`} element={<Groups />} />
              <Route path={`/projects`} element={<Projects />} />
              <Route path={`/profile`} element={<Profile />} />
              <Route path={`/course/:courseId`} element={<CourseDetails />} />
              <Route path={`/manage-users`} element={<Admin />} />
            </Route>
            <Route path={`/register`} element={<Register />} />
            <Route path={`/upload`} element={<Upload />} />
            <Route path={`/reset-password`} element={<ResetPassword />} />
            <Route path={`/courseRecommendations`} element={<CourseReco />} />
            <Route path={`/`} element={<Landing />} />
          </Routes>
        </BrowserRouter >
      </ProfileProvider>
    </ModalProvider>
  )
}

export default App

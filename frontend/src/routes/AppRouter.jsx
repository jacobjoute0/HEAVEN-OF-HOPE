import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
import MainLayout from '../layouts/MainLayout';
import StudentLayout from '../layouts/StudentLayout';
import TeacherLayout from '../layouts/TeacherLayout';
import ParentLayout from '../layouts/ParentLayout';
import AdminLayout from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages
import Home from '../pages/Home';
import About from '../pages/About';
import Academics from '../pages/Academics';
import Admissions from '../pages/Admissions';
import Gallery from '../pages/Gallery';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Events from '../pages/Events';
import News from '../pages/News';

// Auth Pages
import StudentLogin from '../pages/student/StudentLogin';
import TeacherLogin from '../pages/teacher/TeacherLogin';
import ParentLogin from '../pages/parent/ParentLogin';
import AdminLogin from '../pages/admin/AdminLogin';

// Student Pages
import StudentDashboard from '../pages/student/StudentDashboard';
import StudentProfile from '../pages/student/Profile';
import StudentAttendance from '../pages/student/Attendance';
import StudentResults from '../pages/student/Results';
import StudentAssignments from '../pages/student/Assignments';
import StudentTimetable from '../pages/student/Timetable';
import StudentFees from '../pages/student/Fees';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/TeacherDashboard';
import ManageAttendance from '../pages/teacher/ManageAttendance';
import UploadMarks from '../pages/teacher/UploadMarks';
import TeacherAssignments from '../pages/teacher/Assignments';
import TeacherAnnouncements from '../pages/teacher/Announcements';

// Parent Pages
import ParentDashboard from '../pages/parent/ParentDashboard';
import ChildAttendance from '../pages/parent/ChildAttendance';
import ChildResults from '../pages/parent/ChildResults';
import FeePayment from '../pages/parent/FeePayment';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';
import ManageStudents from '../pages/admin/ManageStudents';
import ManageTeachers from '../pages/admin/ManageTeachers';
import ManageParents from '../pages/admin/ManageParents';
import ManageAdmissions from '../pages/admin/ManageAdmissions';
import ManageEvents from '../pages/admin/ManageEvents';
import ManageNews from '../pages/admin/ManageNews';

function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-green-700 font-medium">Loading…</p>
      </div>
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* ===== Public Routes ===== */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/academics" element={<Academics />} />
            <Route path="/admissions" element={<Admissions />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/events" element={<Events />} />
            <Route path="/news" element={<News />} />
          </Route>

          {/* ===== Shared Login (legacy) ===== */}
          <Route path="/login" element={<Login />} />

          {/* ===== Role-Specific Login Pages ===== */}
          <Route path="/student/login"  element={<StudentLogin />} />
          <Route path="/teacher/login"  element={<TeacherLogin />} />
          <Route path="/parent/login"   element={<ParentLogin />} />
          <Route path="/admin/login"    element={<AdminLogin />} />

          {/* ===== Student Portal ===== */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<StudentLayout />}>
              <Route path="/student/dashboard"   element={<StudentDashboard />} />
              <Route path="/student/profile"     element={<StudentProfile />} />
              <Route path="/student/attendance"  element={<StudentAttendance />} />
              <Route path="/student/results"     element={<StudentResults />} />
              <Route path="/student/assignments" element={<StudentAssignments />} />
              <Route path="/student/timetable"   element={<StudentTimetable />} />
              <Route path="/student/fees"        element={<StudentFees />} />
            </Route>
          </Route>

          {/* ===== Teacher Portal ===== */}
          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route element={<TeacherLayout />}>
              <Route path="/teacher/dashboard"   element={<TeacherDashboard />} />
              <Route path="/teacher/attendance"  element={<ManageAttendance />} />
              <Route path="/teacher/marks"       element={<UploadMarks />} />
              <Route path="/teacher/assignments" element={<TeacherAssignments />} />
              <Route path="/teacher/announcements" element={<TeacherAnnouncements />} />
            </Route>
          </Route>

          {/* ===== Parent Portal ===== */}
          <Route element={<ProtectedRoute allowedRoles={['parent']} />}>
            <Route element={<ParentLayout />}>
              <Route path="/parent/dashboard"   element={<ParentDashboard />} />
              <Route path="/parent/attendance"  element={<ChildAttendance />} />
              <Route path="/parent/results"     element={<ChildResults />} />
              <Route path="/parent/fees"        element={<FeePayment />} />
            </Route>
          </Route>

          {/* ===== Admin Portal ===== */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard"   element={<AdminDashboard />} />
              <Route path="/admin/students"    element={<ManageStudents />} />
              <Route path="/admin/teachers"    element={<ManageTeachers />} />
              <Route path="/admin/parents"     element={<ManageParents />} />
              <Route path="/admin/admissions"  element={<ManageAdmissions />} />
              <Route path="/admin/events"      element={<ManageEvents />} />
              <Route path="/admin/news"        element={<ManageNews />} />
            </Route>
          </Route>

          {/* ===== Catch-all ===== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

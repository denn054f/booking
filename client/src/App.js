import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import DoctorApplication from "./pages/DoctorApplication";
import Notifications from "./pages/Notifications";
import UserList from "./pages/admin/UserList";
import DoctorList from "./pages/admin/DoctorList";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import UserProfile from "./pages/user/UserProfile";
import BookAppointment from "./pages/BookAppointment";
import Appointments from "./pages/Appointments";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import { Spin } from "antd";

const App = () => {
  const { user } = useSelector((state) => state.user);
  const { loading } = useSelector((state) => state.loading);

  return (
    // define all the routes/paths in the app, using react-router-dom
    <BrowserRouter>
      {loading && (
        <div className="loader">
          <Spin size="large" spinning={true} color="blue" />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor-application"
          element={
            <ProtectedRoute>
              <DoctorApplication />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/UserList"
          element={
            <ProtectedRoute>
              {user && user.isAdmin && <UserList />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/DoctorList"
          element={
            <ProtectedRoute>
              {user && user.isAdmin && <DoctorList />}
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/profile/:userId"
          element={
            <ProtectedRoute>
              <DoctorProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/user/profile/:userId"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/book-appointment/:doctorId"
          element={
            <ProtectedRoute>
              <BookAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <Appointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/doctor/appointments"
          element={
            <ProtectedRoute>
              <DoctorAppointments />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

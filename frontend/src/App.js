import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";


// COMPONENTS
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Bookings from "./pages/Bookings";
import AdminPanel from "./pages/AdminPanel";
import Layout from "./components/Layout";

function App() {
  return (

    <Router>
      <Routes>
        <Route path="/"
          element={
            <Layout>
              <Home />
            </Layout>

          }
        />
        <Route path="/login" element={
          <Layout>
            <Login />
          </Layout>
        }
        />

        <Route path="/register" element={
          <Layout>
            <Register />
          </Layout>
        }
        />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Layout>
                <Profile />
              </Layout>
            </PrivateRoute>
          }
        />

        <Route
          path="/bookings"
          element={

            <Layout>
              <Bookings />
            </Layout>

          }
        />

        <Route
          path="/AdminPanel"
          element={
            <Layout>
              <AdminPanel />
            </Layout>
          }
        />
      </Routes>
    </Router>
  );

}

export default App;
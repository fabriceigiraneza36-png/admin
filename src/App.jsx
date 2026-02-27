import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Countries from "./pages/Countries";
import CountryForm from "./pages/CountryForm";
import Destinations from "./pages/Destinations";
import DestinationForm from "./pages/DestinationForm";
import Posts from "./pages/Posts";
import PostForm from "./pages/PostForm";
import Tips from "./pages/Tips";
import TipForm from "./pages/TipForm";
import Services from "./pages/Services";
import ServiceForm from "./pages/ServiceForm";
import Team from "./pages/Team";
import TeamForm from "./pages/TeamForm";
import Gallery from "./pages/Gallery";
import Bookings from "./pages/Bookings";
import BookingDetail from "./pages/BookingDetail";
import Faqs from "./pages/Faqs";
import FaqForm from "./pages/FaqForm";
import ContactMessages from "./pages/ContactMessages";
import Pages from "./pages/Pages";
import PageForm from "./pages/PageForm";
import VirtualTours from "./pages/VirtualTours";
import VirtualTourForm from "./pages/VirtualTourForm";
import Subscribers from "./pages/Subscribers";
import Settings from "./pages/Settings";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
}

function App() {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Routes>
      {/* Auth */}
      <Route
        path="/login"
        element={user ? <Navigate to="/" /> : <Login />}
      />

      {/* Dashboard */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="countries" element={<Countries />} />
        <Route path="countries/new" element={<CountryForm />} />
        <Route path="countries/:id/edit" element={<CountryForm />} />
        <Route path="destinations" element={<Destinations />} />
        <Route path="destinations/new" element={<DestinationForm />} />
        <Route path="destinations/:id/edit" element={<DestinationForm />} />
        <Route path="posts" element={<Posts />} />
        <Route path="posts/new" element={<PostForm />} />
        <Route path="posts/:id/edit" element={<PostForm />} />
        <Route path="tips" element={<Tips />} />
        <Route path="tips/new" element={<TipForm />} />
        <Route path="tips/:id/edit" element={<TipForm />} />
        <Route path="services" element={<Services />} />
        <Route path="services/new" element={<ServiceForm />} />
        <Route path="services/:id/edit" element={<ServiceForm />} />
        <Route path="team" element={<Team />} />
        <Route path="team/new" element={<TeamForm />} />
        <Route path="team/:id/edit" element={<TeamForm />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
        <Route path="faqs" element={<Faqs />} />
        <Route path="faqs/new" element={<FaqForm />} />
        <Route path="faqs/:id/edit" element={<FaqForm />} />
        <Route path="messages" element={<ContactMessages />} />
        <Route path="pages" element={<Pages />} />
        <Route path="pages/new" element={<PageForm />} />
        <Route path="pages/:id/edit" element={<PageForm />} />
        <Route path="virtual-tours" element={<VirtualTours />} />
        <Route path="virtual-tours/new" element={<VirtualTourForm />} />
        <Route path="virtual-tours/:id/edit" element={<VirtualTourForm />} />
        <Route path="subscribers" element={<Subscribers />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
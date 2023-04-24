import React from 'react';
import './App.css';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import MiniDrawer from './Pages/Home';

function App(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<MiniDrawer path="dashboard" />} />
        <Route path="/info" element={<MiniDrawer path="info" />} />
        <Route path="/services" element={<MiniDrawer path="services" />} />
        <Route path="/routes" element={<MiniDrawer path="routes" />} />
        <Route path="/consumers" element={<MiniDrawer path="consumers" />} />
        <Route path="/plugins" element={<MiniDrawer path="plugins" />} />
        <Route path="/upstreams" element={<MiniDrawer path="upstreams" />} />
        <Route
          path="/certificates"
          element={<MiniDrawer path="certificates" />}
        />
        <Route path="/users" element={<MiniDrawer path="users" />} />
        <Route
          path="/connections"
          element={<MiniDrawer path="connections" />}
        />
        <Route path="/snapshots" element={<MiniDrawer path="snapshots" />} />
        <Route path="/settings" element={<MiniDrawer path="settings" />} />
        <Route
          path="/services/:id/:isNew/"
          element={<MiniDrawer path="servicesDetail" />}
        />
        {/* <Route path="*" element={<Navigate to="/dashboard" />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;

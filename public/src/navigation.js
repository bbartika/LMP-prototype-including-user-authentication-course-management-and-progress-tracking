// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signup from './components/User/signup';
import Login from './components/User/login';
import Dashboard from './components/Dashboard';

function navigation() {
    return (
        <Router>
            <Routes>
                <Route path="/signup" element={<User/signup />} />
                <Route path="/login" element={<User/login />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
        </Router>
    );
}

export default naviigation;

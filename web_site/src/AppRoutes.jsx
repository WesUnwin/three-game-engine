import React from 'react';
import {
  Route,
  Routes
} from "react-router-dom";
import About from './About.jsx';
import Docs from "./Docs.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<About />} />
      <Route path="/docs" element={<Docs />} />
    </Routes>
  );
};

export default AppRoutes;
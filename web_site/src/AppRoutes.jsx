import React from 'react';
import {
  Route,
  Routes
} from "react-router-dom";
import About from './about/About.jsx';
import Docs from "./docs/Docs.jsx";
import Editor from './Editor.jsx';
import Examples from './Examples.jsx';

const AppRoutes = () => {
  return (
    <Routes>
      <Route exact path="/" element={<About />} />
      <Route path="/docs/:key" element={<Docs />} />
      <Route path="/docs" element={<Docs />} />
      <Route path="/examples" element={<Examples />} />
      <Route path="/editor" element={<Editor />} />
    </Routes>
  );
};

export default AppRoutes;
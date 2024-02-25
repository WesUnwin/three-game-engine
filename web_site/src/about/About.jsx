import React from 'react';
import HeroBanner from './HeroBanner.jsx';
import Libraries from './Libraries.jsx';
import SceneEditor from './SceneEditor.jsx';
import Features from './Features.jsx';
import DesktopAndMobile from './DesktopAndMobile.jsx';

const About = () => {
  return (
    <div className="container text-center">
      <HeroBanner />

      <Libraries />

      <br /><br />

      <SceneEditor />

      <br /><br />

      <Features />

      <br /><br />

      <DesktopAndMobile />

      <br /><br />
    </div>
  );
};

export default About;
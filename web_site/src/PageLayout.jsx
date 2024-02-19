import React from 'react';
import Header from './Header.jsx';

const PageLayout = ({ children }) => {
  return (
    <>
      <Header />

      {children}
    </>
  );
}

export default PageLayout;
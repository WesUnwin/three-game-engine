import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const goToTab = (e, tabName) => {
    e.preventDefault();
    navigate(tabName);
  };

  return (
    <div className="header">
      header

      <a onClick={e => goToTab(e, '')}>
        About
      </a>

      <a onClick={e => goToTab(e, '')}>
        Examples
      </a>

      <a onClick={e => goToTab(e, 'docs')}>
        Docs
      </a>

      <a onClick={e => goToTab(e, 'editor')}>
        Scene Editor
      </a>

      <a onClick={e => goToTab(e, 'github')}>
        GitHub Repo
      </a>
    </div>
  );
}

export default Header
import React from 'react';
import { useNavigate } from 'react-router-dom';

const links = [
  { label: 'About', to: '' },
  { label: 'Docs', to: 'docs' },
  { label: 'Examples', to: 'examples' },
  { label: 'Scene Editor', to: 'editor' }
];

const Header = () => {
  const navigate = useNavigate();

  const goToTab = (e, tabName) => {
    e.preventDefault();
    navigate(tabName);
  };

  const toGitHub = e => {
    e.preventDefault();
    window.location = "https://github.com/WesUnwin/three-game-engine";
  };

  const renderLink = linkData => (
    <a key={linkData.label} className={`header-link ${window.location.hash === `#/${linkData.to}` ? 'active' : ''}`} onClick={e => goToTab(e, linkData.to)}>
      {linkData.label}
    </a>
  );

  return (
    <div className="header">
      <div className="logo">
        three-game-engine
      </div>

      <div className="actions">
        {links.map(linkData => renderLink(linkData))}

        <a onClick={toGitHub}>
          GitHub Repo
        </a>
      </div>
    </div>
  );
}

export default Header
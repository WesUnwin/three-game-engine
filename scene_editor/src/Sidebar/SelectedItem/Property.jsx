import React from 'react';

const Property = ({ label, children }) => {
  return (
    <span className="property">
      <span className="property-label">
        {label}
      </span>
      <span className="property-children">
        {children}
      </span>
    </span>
  );
};

export default Property;
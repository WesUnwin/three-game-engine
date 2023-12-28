import React from 'react';

const PropertyGroup = ({ label, children }) => {
    return (
        <div className="property-group">
            <h5>{label}</h5>
            <div className="row">
                {children}
            </div>
        </div>
    );
};

export default PropertyGroup;
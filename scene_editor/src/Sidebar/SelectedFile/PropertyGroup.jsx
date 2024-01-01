import React from 'react';

const PropertyGroup = ({ label, children, inColumn }) => {
    return (
        <div className="property-group">
            <h5>{label}</h5>
            <div className={inColumn ? "col" : "row"}>
                {children}
            </div>
        </div>
    );
};

export default PropertyGroup;
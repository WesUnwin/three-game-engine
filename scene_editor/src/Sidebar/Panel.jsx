import React from 'react';

const Panel = ({ label, children }) => {
    return (
        <div style={{ margin: '10px' }}>
            <h5 style={{ color: 'white', marginBottom: '0px' }}>{label}</h5>
            <div style={{ border: '1px solid grey', padding: '5px', backgroundColor: '#606060', color: 'white' }}>
                {children}            
            </div>
        </div>
    );
};

export default Panel;
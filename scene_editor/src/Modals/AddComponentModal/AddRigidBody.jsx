import React, { useEffect, useState } from 'react';

const rigidBodyTypes = [
  'fixed',
  'dynamic',
  'kinematicPositionBased',
  'kinematicVelocityBased'
];

const AddRigidBody = ({ componentJSON, setComponentJSON, setErrors, dirHandle }) => {
    const [rigidBodyType, setRigidBodyType] = useState('fixed');

    useEffect(() => {
      setComponentJSON({ ...componentJSON, rigidBodyType });
    }, [rigidBodyType]);
  
    useEffect(() => {
      setErrors([]);
    }, []);
  
    return (
      <div className="row">
        <label>Rigid Body Type:</label>
        &nbsp;
        <select value={rigidBodyType} onChange={event => setRigidBodyType(event.target.value)}>
          {rigidBodyTypes.map(type => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
    );
}

export default AddRigidBody;
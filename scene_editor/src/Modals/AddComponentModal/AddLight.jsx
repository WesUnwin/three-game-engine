import React, { useEffect, useState } from 'react';

const lightTypes = [
  'AmbientLight',
  'DirectionalLight',
  'HemisphereLight',
  'PointLight',
  'RectAreaLight',
  'SpotLight'
];

const AddLight = ({ componentJSON, setComponentJSON, setErrors, dirHandle }) => {
    const [lightType, setLightType] = useState('AmbientLight');

    useEffect(() => {
      setComponentJSON({ ...componentJSON, lightType });
    }, [lightType]);
  
    useEffect(() => {
      setErrors([]);
    }, []);
  
    return (
      <div className="row">
        <label>Light Type:</label>
        &nbsp;
        <select value={lightType} onChange={event => setLightType(event.target.value)}>
          {lightTypes.map(lightType => (
            <option key={lightType} value={lightType}>
              {lightType}
            </option>
          ))}
        </select>
      </div>
    );
}

export default AddLight;
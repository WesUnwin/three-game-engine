import React from 'react';
import TreeView from '../../Hierarchy/TreeView.jsx';
import { FaTrash } from 'react-icons/fa';

const LightComponent = ({ componentIndex, componentJSON, removeComponent }) => {
  return (
    <TreeView
      label={`Light: ${componentJSON.lightType}`}
      actions={[
        { icon: <FaTrash />, onClick: () => removeComponent(componentIndex) }
      ]}
      onClick={() => {}}
    />
  );
};

export default LightComponent;
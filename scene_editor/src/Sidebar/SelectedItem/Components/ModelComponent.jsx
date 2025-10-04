import React from 'react';
import TreeView from '../../Hierarchy/TreeView.jsx';
import { FaTrash } from 'react-icons/fa';

const ModelComponent = ({ componentIndex, componentJSON, removeComponent }) => {
  return (
    <TreeView
      label={`Model: ${componentJSON.assetPath}`}
      actions={[
        { icon: <FaTrash />, onClick: () => removeComponent(componentIndex) }
      ]}
      onClick={() => {}}
    />
  );
};

export default ModelComponent;
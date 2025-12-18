import React from 'react';
import TreeView from '../../Hierarchy/TreeView.jsx';
import { FaTrash } from 'react-icons/fa';

const ModelComponent = ({ componentJSON, onRemove }) => {
  return (
    <TreeView
      label={`Model: ${componentJSON.assetPath}`}
      actions={[
        { icon: <FaTrash />, onClick: onRemove }
      ]}
      onClick={() => {}}
    />
  );
};

export default ModelComponent;
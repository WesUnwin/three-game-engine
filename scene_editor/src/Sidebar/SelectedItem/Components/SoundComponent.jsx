import React from 'react';
import TreeView from '../../Hierarchy/TreeView.jsx';
import { FaTrash } from 'react-icons/fa';

const SoundComponent = ({ componentJSON, onRemove }) => {
  return (
    <TreeView
      label={`Sound: ${componentJSON.assetPath}`}
      actions={[
        { icon: <FaTrash />, onClick: onRemove }
      ]}
      onClick={() => {}}
    />
  );
};

export default SoundComponent;
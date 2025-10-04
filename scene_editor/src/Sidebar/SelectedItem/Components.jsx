import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';
import { FaPlus } from 'react-icons/fa';

import ModelComponent from './Components/ModelComponent.jsx';
import LightComponent from './Components/LightComponent.jsx';
import RigidBodyComponent from './Components/RigidBodyComponent.jsx';
import SoundComponent from './Components/SoundComponent.jsx';

const Components = ({ componentsJSON, addComponent, removeComponent }) => {
  const reactComponentForComponentType = {
    model: ModelComponent,
    light: LightComponent,
    rigidBody: RigidBodyComponent,
    sound: SoundComponent
  };

  return (
    <TreeView
      label="Components:"
      expandOnClick={true}
      initiallyExpanded={true}
      actions={[
        { icon: <FaPlus />, onClick: addComponent }
      ]}
    >
      {componentsJSON.map((componentJSON, index) => {
        const ReactComponent = reactComponentForComponentType[componentJSON.type];

        return (
          <ReactComponent
            componentIndex={index}
            componentJSON={componentJSON}
          />
        );
      })}

      {componentsJSON.length === 0 ? (
        '(none)'
      ) : null}
    </TreeView>
  );
};

export default Components;

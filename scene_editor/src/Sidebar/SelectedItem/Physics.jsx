import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';
import PropertyGroup from './PropertyGroup.jsx';
import ColliderProperties from './ColliderProperties.jsx';
import { FaPlus } from 'react-icons/fa';

const rigidBodyTypes = [
    'fixed',
    'dynamic',
    'kinematicPositionBased',
    'kinematicVelocityBased'
];

const Physics = ({ rigidBody, changeProperty, addCollider }) => {
    const colliders = rigidBody?.colliders || [];

    const addRigidBody = () => {
        changeProperty(['rigidBody'], {
            type: 'fixed'
        });
    };

    const removeRigidBody = () => {
        changeProperty(['rigidBody'], null);
    };

    const onRigidBodyTypeChange = event => {
        changeProperty(['rigidBody', 'type'], event.target.value);
    };

    const onChangeCollider = (colliderIndex, updatedCollider) => {
        const updatedColliders = [...colliders];
        updatedColliders[colliderIndex] = updatedCollider;
        changeProperty(['rigidBody', 'colliders'], updatedColliders);
    };

    const deleteCollider = colliderIndex => {
        const updatedColliders = [...colliders];
        updatedColliders.splice(colliderIndex, 1);
        changeProperty(['rigidBody', 'colliders'], updatedColliders);
    };

    return (
        <TreeView label="Physics:" expandOnClick={true} initiallyExpanded={true}>
            <div style={{ marginLeft: '10px' }}>
                <div className="row">
                    <input type="checkbox" checked={rigidBody != null} onChange={() => rigidBody ? removeRigidBody() : addRigidBody()} />
                    <span>Has RigidBody, of type: &nbsp;</span>
                    <select value={rigidBody?.type || 'fixed'} disabled={!rigidBody} onChange={onRigidBodyTypeChange}>
                        {rigidBodyTypes.map(bodyType => (
                            <option
                                key={bodyType}
                                value={bodyType}
                                onChange={() => { /* Needed to prevent a react warning, even though select element onChange is set */ }}
                            >
                                {bodyType}
                            </option>
                        ))}
                    </select>
                </div>

                {rigidBody ? (
                    <div>
                        <div className="row" style={{ justifyContent: 'space-around' }}>
                            <PropertyGroup label="Enabled Translations:">
                                {['x', 'y', 'z'].map(axis => {
                                    let isChecked = true;
                                    if (('enabledTranslations' in rigidBody) && (axis in rigidBody.enabledTranslations)) {
                                        isChecked = rigidBody.enabledTranslations[axis];
                                    }
                                    return (
                                        <span key={axis}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => changeProperty(['rigidBody', 'enabledTranslations', axis], !isChecked)}
                                            />
                                            {axis} &nbsp;
                                        </span>
                                    );
                                })}
                            </PropertyGroup>
                            <PropertyGroup label="Enabled Rotations:">
                                {['x', 'y', 'z'].map(axis => {
                                    let isChecked = true;
                                    if (('enabledRotations' in rigidBody) && (axis in rigidBody.enabledRotations)) {
                                        isChecked = rigidBody.enabledRotations[axis];
                                    }
                                    return (
                                        <span key={axis}>
                                            <input
                                                type="checkbox"
                                                checked={isChecked}
                                                onChange={() => changeProperty(['rigidBody', 'enabledRotations', axis], !isChecked)}
                                            />
                                            {axis} &nbsp;
                                        </span>
                                    );
                                })}
                            </PropertyGroup>
                        </div>

                        <TreeView
                            label="Colliders:"
                            expandOnClick={true}
                            initiallyExpanded={true}
                            actions={[
                                { icon: <FaPlus />, onClick: addCollider }
                            ]}
                        >
                            {colliders.map((collider, index) => (
                                <ColliderProperties
                                    key={index}
                                    collider={collider}
                                    onChange={updatedCollider => onChangeCollider(index, updatedCollider)}
                                    onDelete={() => deleteCollider(index)}
                                />
                            ))}
                            {colliders.length === 0 ? (
                                '(none)'
                            ) : null}
                        </TreeView>
                    </div>
                ) : null}
            </div>
        </TreeView>
    );
};

export default Physics;
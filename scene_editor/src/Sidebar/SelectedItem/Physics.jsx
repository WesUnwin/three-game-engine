import React from 'react';
import TreeView from '../Hierarchy/TreeView.jsx';
import PropertyGroup from './PropertyGroup.jsx';

const rigidBodyTypes = [
    'fixed',
    'dynamic',
    'kinematicPositionBased',
    'kinematicVelocityBased'
];

const colliderProperties = {
    ball: ['radius'],
    capsule: ['halfHeight', 'radius'],
    cone: ['halfHeight', 'radius'],
    convexHull: ['points'],
    convexMesh: ['vertices', 'indices'],
    cuboid: ['hx', 'hy', 'hz'],
    cylinder: ['halfHeight', 'radius'],
    polyline: ['vertices', 'indices'],
    roundCone: ['halfHeight', 'radius', 'borderRadius'],
    roundConvexHull: ['points', 'borderRadius'],
    roundConvexMesh: ['vertices', 'indices', 'borderRadius'],
    roundCuboid: ['hx', 'hy', 'hz', 'borderRadius'],
    roundCylinder: ['halfHeight', 'radius', 'borderRadius'],
    roundTriangle: ['a', 'b', 'c', 'borderRadius'],
    trimesh: ['vertices', 'indices'],
    heightfield: ['nrows', 'ncols', 'heights', 'scale']
};

const Physics = ({ rigidBody }) => {
    const getColliderLabel = collider => {
        let label = `${collider.type}`;
        for (let p of colliderProperties[collider.type]) {
            label += ` ${p}: ${collider[p]}`;
        }
        return label;
    }

    const colliders = rigidBody?.colliders || [];

    const addRigidBody = () => {

    };

    const removeRigidBody = () => {

    };

    const onRigidBodyTypeChange = event => {

    };

    const changeProperty = (field, value) => {

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
                        <PropertyGroup label="Enabled Translations:">
                            {['x', 'y', 'z'].map(axis => {
                                const isChecked = (rigidBody.enabledTranslations && rigidBody.enabledTranslations[axis]) || true;
                                return (
                                    <span key={axis}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => changeProperty(['enableTranslations', axis], !isChecked)}
                                        />
                                        x &nbsp;
                                    </span>
                                );
                            })}
                        </PropertyGroup>
                        <PropertyGroup label="Enabled Rotations:">
                            {['x', 'y', 'z'].map(axis => {
                                const isChecked = (rigidBody.enabledRotations && rigidBody.enabledRotations[axis]) || true;
                                return (
                                    <span key={axis}>
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={() => changeProperty(['enabledRotations', axis], !isChecked)}
                                        />
                                        x &nbsp;
                                    </span>
                                );
                            })}
                        </PropertyGroup>
                        <TreeView label="Colliders:" expandOnClick={true} initiallyExpanded={true}>
                            {colliders.map((collider, index) => (
                                <TreeView key={index} label={getColliderLabel(collider)} />
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
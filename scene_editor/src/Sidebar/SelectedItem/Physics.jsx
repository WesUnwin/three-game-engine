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

    return (
        <TreeView label="Physics:" expandOnClick={true} initiallyExpanded={true}>
            <div style={{ marginLeft: '10px' }}>
                <div className="row">
                    <input type="checkbox" checked={rigidBody != null} />
                    <span>Has RigidBody, of type: &nbsp;</span>
                    <select value={rigidBody?.type || 'fixed'} disabled={!rigidBody}>
                        {rigidBodyTypes.map(bodyType => (
                            <option key={bodyType} value={bodyType}>{bodyType}</option>
                        ))}
                    </select>
                </div>

                {rigidBody ? (
                    <div>
                        <PropertyGroup label="Enabled Translations:">
                            <span><input type="checkbox" checked={rigidBody.enabledTranslations?.x || true} />x &nbsp;</span>
                            <span><input type="checkbox" checked={rigidBody.enabledTranslations?.y || true} />y &nbsp;</span>
                            <span><input type="checkbox" checked={rigidBody.enabledTranslations?.z || true} />z &nbsp;</span>
                        </PropertyGroup>
                        <PropertyGroup label="Enabled Rotations:">
                            <span><input type="checkbox" checked={rigidBody.enabledRotations?.x || true} />x &nbsp;</span>
                            <span><input type="checkbox" checked={rigidBody.enabledRotations?.y || true} />y &nbsp;</span>
                            <span><input type="checkbox" checked={rigidBody.enabledRotations?.z || true} />z &nbsp;</span>
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
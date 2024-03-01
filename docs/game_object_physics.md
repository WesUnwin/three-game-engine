## GameObject Physics
A GameObject can optionally have a RigidBody which gives it the ability to exist in the Rapier physics world parented by
the scene.

```
  gameObject.rapierRigidBody // null or a instance of rapier's RigidBody
```

### Rigid Body Types

| Rigid Body Type          | Description                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| fixed                    | For static, unmovable objects like terrain and parts of the environment.         | 
| dynamic                  |  |
| kinematicPositionBased   |  |
| kinematicVelocityBased   |  |


### Colliders
The rigid body in turn can possess a set of colliders. Colliders define the 3D shape of the rigid body, for purposes of collision detection and interactions with other colliders.

| Collider Type    | Properties               | Description                                                                    |
| ---------------- | ------------------------ | ---------------------------------------------------------------- |
| ball             | radius |
| capsule          | halfHeight, radius |
| cone             | halfHeight, radius |
| convexHull       | points |
| cuboid           | points |
| cylinder         | points |
| polyline         | points |
| roundCone        | points |
| roundConvexHull  | points |
| roundConvexMesh  | points |
| roundCuboid      | points |
| roundCylinder    | points |
| roundTriangle    |        |
| trimesh          |        |
| heightfield      |        | 
## GameObject Type JSON
You can define a "type" of GameObject by a .json file, to create re-usable, generalized GameObjects that all
are based off a common set of properties (eg. all share the same models/physics properties etc.)

This is similar to creating a pre-fab in engine's like Unity.

```
{
  // A GameObject can clone all the mesh data from a given .gltf or .glb file.
  // These will be addded as children of the GameObjects .threeJSGroup.
  "models": [
    { "assetPath": "models/player.glb" }
  ],

  // Similarly, game objects can parent ThreeJS lights of any type:
  "lights": [
    { "type": "PointLight", "position": { "x": 0, "y": 5, "z": 0 } }
  ],

  // A gameobject can optionally have a Rapier RigidBody, and colliders attached to it.
  "rigidBody": {
      "type": "kinematicPositionBased",
      "colliders": [
          { "type": "capsule", "halfHeight": 0.5, "radius", 0.5 }
      ],
      "enabledRotations": { "x": false, "y": true, "z": false }
  },

  // GameObjects can also contain MeshUIComponents
  // (created via three-mesh-ui) which will added to the GameObject's threeJSGroup
  "userInterfaces": [
    {
      "type": "Block",
      "children": [
        {
          "type": "Text",
          "content": "Hello world!"
        }
      ]
    }
  ]
}
```
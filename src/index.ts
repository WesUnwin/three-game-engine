import _Game from './Game'
import _Scene from './Scene'
import _GameObject from './GameObject'

import * as _THREE from 'three';
import _RAPIER from '@dimforge/rapier3d-compat';
import _ThreeMeshUI from 'three-mesh-ui'

// This file defines the API of this library.
// Only export things that should be publicly/directly exposed to applications.

export const Game = _Game
export const Scene = _Scene
export const GameObject = _GameObject

// Underlying libraries:
export const THREE = _THREE;
export const RAPIER = _RAPIER
export const ThreeMeshUI = _ThreeMeshUI;

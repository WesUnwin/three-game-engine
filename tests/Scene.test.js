const Scene = require('../src/Scene').default;
const GameObject = require('../src/GameObject').default;

describe('construction', () => {
    describe('gameObjects', () => {
        it('creates a scene with zero gameObjects by default', () => {
            const scene = new Scene();
            expect(scene.getRootGameObjects().length).toBe(0);
        });

        it('creates a scene with the specified gameObjects', () => {
            const scene = new Scene({
                gameObjects: [
                    { name: 'game-object-1' },
                    { name: 'game-object-2' }
                ]
            });
            expect(scene.getRootGameObjects().length).toBe(2);
        });

        it('creates GameObjects of the given GameObject sub-class', () => {
            class GameObjectSubClass extends GameObject {
            }

            const scene = new Scene({
                gameObjects: [
                    { klass: GameObjectSubClass, name: 'game-object-1' }
                ]
            });
            expect(scene.getRootGameObjects().length).toBe(1);
            const gameObject = scene.getRootGameObjects()[0];
            expect(gameObject instanceof GameObject).toBe(true);
            expect(gameObject instanceof GameObjectSubClass).toBe(true);
        });
    });
});

describe('addGameObjects', () => {
    it('adds the given GameObject to the scene', () => {
        const scene = new Scene();
        const gameObject = new GameObject(scene, { name: 'game-object-1' });
        scene.addGameObject(gameObject);
        expect(scene.getRootGameObjects().length).toBe(1);
        expect(scene.getRootGameObjects()[0].name).toEqual('game-object-1');
    });
});

describe('removeGameObject', () => {
    it('removes the given GameObject from the scene', () => {
        const scene = new Scene({
            gameObjects: [
                { name: 'game-object-1' }
            ]
        });
        const gameObject = scene.getGameObjectWithName('game-object-1');
        expect(scene.getRootGameObjects().length).toBe(1);
        scene.removeGameObject(gameObject);
        expect(scene.getRootGameObjects().length).toBe(0);
    });
});

describe('getRootGameObjects', () => {
    it('returns all top-level game-objects', () => {
        const scene = new Scene({
            gameObjects: [
                { name: 'game-object-1' },
                { 
                    name: 'game-object-2',
                    gameObjects: [
                        {
                            name: 'game-object-3' // not top-level
                        }
                    ]
                }
            ]
        });
        expect(scene.getRootGameObjects().length).toBe(2);
    });
});

describe('getGameObjectWithName', () => {
    it('returns the GameObject with the specified name', () => {
        const scene = new Scene({
            gameObjects: [
                { name: 'game-object-1' },
                { 
                    name: 'game-object-2',
                    gameObjects: [
                        {
                            name: 'game-object-3'
                        }
                    ]
                }
            ]
        });
        const gameObject = scene.getGameObjectWithName('game-object-3');
        expect(gameObject).not.toBe(null);
        expect(gameObject.name).toEqual('game-object-3');
    });

    it('returns null if no GameObject with the specified name exists', () => {
        const scene = new Scene({
            gameObjects: [
                { name: 'game-object-1' }
            ]
        });
        const gameObject = scene.getGameObjectWithName('game-object-2');
        expect(gameObject).toBe(null);
    });
});

describe('getGameObjectsWithTag', () => {
    it('returns the GameObjects that have the given tag', () => {
        const scene = new Scene({
            gameObjects: [
                { name: 'game-object-1' },
                { name: 'game-object-2', tags: ['enemy'] }
            ]
        });
        const gameObjects = scene.getGameObjectsWithTag('enemy');
        expect(gameObjects.length).toBe(1);
        expect(gameObjects[0].name).toBe('game-object-2');
    });
});
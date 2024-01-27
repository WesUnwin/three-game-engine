const GameObject = require('../src/GameObject').default;
const Game = require('../src/Game').default;
const Scene = require('../src/Scene').default;
const Group = require('three').Group;
const THREE = require('three');

describe('construction', () => {
    it('inits .threeJSGroup to a THREE.Group (by default)', () => {
        const scene = new Scene()
        const gameObject = new GameObject(scene)
        expect(gameObject.threeJSGroup instanceof Group).toBe(true)
    })
})

describe('getScene', () => {
    it('returns the scene that parents the game object', () => {
        const scene = new Scene();
        const parentObject = new GameObject(scene);
        const childObject = new GameObject(parentObject);
        expect(childObject.getScene()).toBe(scene);
    });
});

describe('load', () => {
    describe('lights', () => {
        describe('Light Types', () => {
            let gameObject;

            beforeEach(async () => {
                const game = new Game();
                const scene = new Scene();
                gameObject = new GameObject(scene, {
                    lights: [
                        { type: 'AmbientLight', color: 'red', intensity: 0.5 }
                    ]
                });
                await game.loadScene(scene);
            });

            it('creates an AmbientLight', () => {
                const light = gameObject.threeJSGroup.children().find(c => c instanceof THREE.AmbientLight);
                expect(light).not.toBe(null);
                console.log(gameObject.threeJSGroup.children());
                expect(light.color instanceof THREE.Color).toBe(true);
                expect(light.color.value).toBe('red');
                expect(light.intensity).toBe(0.5);
            });
        });
    });
});

describe('hasTag', () => {
    describe('GameObject has the specified Tag', () => {
        it('returns true', () => {
            const scene = new Scene();
            const gameObject = new GameObject(scene, {
                tags: ['enemy']
            });
            expect(gameObject.hasTag('enemy')).toBe(true)
        })
    })

    describe('GameObject does NOT have the specified Tag', () => {
        it('returns false', () => {
            const scene = new Scene();
            const gameObject = new GameObject(scene); // will have no tags by default
            expect(gameObject.hasTag('enemy')).toBe(false)
        })
    })
})

describe('addGameObjects', () => {
    it('adds the given GameObject to the parent object', () => {
        const scene = new Scene();
        const parentObject = new GameObject(scene);
        const childObject = new GameObject(scene, { name: 'game-object-1' });
        parentObject.addGameObject(childObject);
        expect(parentObject.getRootGameObjects().length).toBe(1);
        expect(parentObject.getRootGameObjects()[0]).toBe(childObject);
        expect(childObject.parent).toBe(parentObject)
    });
});

describe('removeGameObject', () => {
    it('removes the given GameObject from the parent object', () => {
        const scene = new Scene();
        const parentObject = new GameObject(scene);
        const childObject = new GameObject(parentObject);
        expect(parentObject.getRootGameObjects().length).toBe(1);
        parentObject.removeGameObject(childObject);
        expect(parentObject.getRootGameObjects().length).toBe(0);
    });
});

describe('getRootGameObjects', () => {
    it('returns all top-level game-objects', () => {
        const scene = new Scene();
        const parentObject = new GameObject(scene);
        new GameObject(parentObject);
        const aChild = new GameObject(parentObject);
        new GameObject(aChild); // child of a child (thus NOT a root game object)
        expect(parentObject.getRootGameObjects().length).toBe(2);
    });
});

describe('getGameObjectWithName', () => {
    it('returns the descendent GameObject with the specified name', () => {
        const scene = new Scene();
        const parentObject = new GameObject(scene);
        const childObject = new GameObject(parentObject, { name: 'child-object'});
        const gameObject = parentObject.getGameObjectWithName('child-object');
        expect(gameObject).toBe(childObject)
    });

    it('returns null if no GameObject with the specified name exists', () => {
        const scene = new Scene();
        const parentObject = new GameObject(scene);
        const gameObject = parentObject.getGameObjectWithName('game-object-2');
        expect(gameObject).toBe(null);
    });
});

describe('getGameObjectsWithTag', () => {
    it('returns the GameObjects that have the given tag', () => {
        const scene = new Scene();
        const parentObject = new GameObject(scene);
        const childWithTag = new GameObject(parentObject, { tags: ['enemy'] })
        new GameObject(parentObject)
        const gameObjects = parentObject.getGameObjectsWithTag('enemy');
        expect(gameObjects.length).toBe(1);
        expect(gameObjects[0]).toBe(childWithTag);
    });
});

describe('destroy', () => {
    it('removes the GameObject from its parent', () => {
        const scene = new Scene();
        const object = new GameObject(scene);
        object.destroy();
        expect(object.parent).toBe(null);
        expect(scene.getRootGameObjects().length).toBe(0);
    });
});
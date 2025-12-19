const GameObject = require('../src/GameObject').default;
const Game = require('../src/Game').default;
const Scene = require('../src/Scene').default;
const Group = require('three').Group;
const THREE = require('three');

describe('construction', () => {
    let scene;
    let gameObject;

    beforeEach(async () => {
        const game = new Game('/base_url');
        scene = new Scene(game);
        await scene.load(scene);
        gameObject = new GameObject(scene)
    });

    it('inits .threeJSGroup to a THREE.Group (by default)', () => {
        expect(gameObject.threeJSGroup instanceof Group).toBe(true)
    });

    describe('getScene', () => {
        it('returns the scene that parents the game object', () => {
            const childObject = new GameObject(gameObject);
            expect(childObject.getScene()).toBe(scene);
        });
    });

    describe('hasTag', () => {
        describe('GameObject has the specified Tag', () => {
            it('returns true', () => {
                const gameObject = new GameObject(scene, {
                    tags: ['enemy']
                });
                expect(gameObject.hasTag('enemy')).toBe(true)
            })
        })

        describe('GameObject does NOT have the specified Tag', () => {
            it('returns false', () => {
                const gameObject = new GameObject(scene); // will have no tags by default
                expect(gameObject.hasTag('enemy')).toBe(false)
            })
        })
    })

    describe('addGameObjects', () => {
        it('adds the given GameObject to the parent object', () => {
            const parentObject = gameObject;
            const childObject = new GameObject(scene, { name: 'game-object-1' });
            parentObject.addGameObject(childObject);
            expect(parentObject.getRootGameObjects().length).toBe(1);
            expect(parentObject.getRootGameObjects()[0]).toBe(childObject);
            expect(childObject.parent).toBe(parentObject)
        });
    });

    describe('removeGameObject', () => {
        it('removes the given GameObject from the parent object', () => {
             const parentObject = gameObject;
            const childObject = new GameObject(parentObject);
            expect(parentObject.getRootGameObjects().length).toBe(1);
            parentObject.removeGameObject(childObject);
            expect(parentObject.getRootGameObjects().length).toBe(0);
        });
    });

    describe('getRootGameObjects', () => {
        it('returns all top-level game-objects', () => {
            const parentObject = gameObject;
            new GameObject(parentObject);
            const aChild = new GameObject(parentObject);
            new GameObject(aChild); // child of a child (thus NOT a root game object)
            expect(parentObject.getRootGameObjects().length).toBe(2);
        });
    });

    describe('getGameObjectWithName', () => {
        it('returns the descendent GameObject with the specified name', () => {
            const parentObject = gameObject;
            const childObject = new GameObject(parentObject, { name: 'child-object'});
            const resultGameObject = parentObject.getGameObjectWithName('child-object');
            expect(resultGameObject).toBe(childObject)
        });

        it('returns null if no GameObject with the specified name exists', () => {
            const parentObject = gameObject;
            const resultGameObject = parentObject.getGameObjectWithName('game-object-2');
            expect(resultGameObject).toBe(null);
        });
    });

    describe('getGameObjectsWithTag', () => {
        it('returns the GameObjects that have the given tag', () => {
            const parentObject = gameObject;
            const childWithTag = new GameObject(parentObject, { tags: ['enemy'] })
            new GameObject(parentObject)
            const resultGameObject = parentObject.getGameObjectsWithTag('enemy');
            expect(resultGameObject.length).toBe(1);
            expect(resultGameObject[0]).toBe(childWithTag);
        });
    });

    describe('destroy', () => {
        it('removes the GameObject from its parent', () => {
            gameObject.destroy();
            expect(gameObject.parent).toBe(null);
            expect(scene.getRootGameObjects().length).toBe(0);
        });
    });
});
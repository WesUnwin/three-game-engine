const Game = require('../src/Game').default;
const Scene = require('../src/Scene').default;
const GameObject = require('../src/GameObject').default;

describe('construction', () => {
    let scene;

    beforeEach(() => {
        const game = new Game('/base_url');
        scene = new Scene(game, 'scenes/scene1.json');
    });

    describe('initial state', () => {
        it('has zero game objects', () => {
            expect(scene.getRootGameObjects()).toEqual([]);
        });
    });
});



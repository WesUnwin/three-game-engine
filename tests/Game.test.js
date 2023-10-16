const Game = require('../src/Game').default;
const AssetStore = require('../src/assets/AssetStore').default;
const Scene = require('../src/Scene').default;
const GameObject = require('../src/GameObject').default;

describe('contructor', () => {
    it('allows constructing a game object with no args', () => {
        const game = new Game();
        expect(game).toBeDefined();
    })
});

describe('getAssetStore', () => {
    it('returns the AssetStore instance', async () => {
        const game = new Game();
        const assetStore = await game.getAssetStore();
        expect(assetStore instanceof AssetStore).toBe(true);
    });
});

describe('loadScene', () => {
    it('loads the given scene and its GameObjects', async () => {
        const game = new Game();
        const scene = new Scene();
        const gameObject = new GameObject(scene);
        await game.loadScene(scene);
        expect(scene.game).toBe(game);
        expect(game.scene).toBe(scene);
        expect(gameObject.loaded).toBe(true);
    });
});
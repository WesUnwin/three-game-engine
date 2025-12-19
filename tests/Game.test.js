const Game = require('../src/Game').default;

describe('contructor', () => {
    it('allows constructing a game object with no args', () => {
        const game = new Game('/base_url');
        expect(game).toBeDefined();
    })
});

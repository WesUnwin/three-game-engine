import RAPIER from '@dimforge/rapier3d-compat';

let rapierInitialized = false;

// Initialize RAPIER physics library, if not already done
export const initRAPIER = async () => {
    // init the rapier library, only needs to be done once ever.
    if (!rapierInitialized) {
        console.log('Game: initializing RAPIER physics library...');
        await RAPIER.init();
        rapierInitialized = true;
    }
};

export const createRapierWorld = (gravity: { x: number, y: number, z: number }) => {
    if (['x', 'y', 'z'].some(prop => typeof gravity[prop] !== 'number')) {
        // This check is here is because elsewise funky thing start happening inside Rapier,
        // when given bad values such as undefined x/y/z values. This include behavior
        // such as colliders consistently adopting NaN translation() values.
        throw new Error(`createRapierWorld: a rapier world must be initialized with a gravity vector, containing a numer x, y, and z value. given: ${gravity}`);
    }

    return new RAPIER.World(gravity);
};

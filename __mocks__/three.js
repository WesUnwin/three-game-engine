
class Vector3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    set(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class Euler {
    constructor(x, y, z, order = 'XYZ') {
        this.x = x;
        this.y = y;
        this.z = z;
        this.order = order;
    }

    set(x, y, z, order) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.order = order;
    }
}

class Object3D {
    constructor() {
        this.childObjects = [];
        this.position = new Vector3(0,0,0);
        this.scale = new Vector3(0,0,0);
        this.rotation = new Euler(0,0,0);
    }

    add(object3D) {
        this.childObjects.push(object3D);
    }

    remove(object3D) {
        this.childObjects = this.childObjects.filter(obj => obj !== object3D);
    }

    clear() {
        this.childObjects = [];
    }

    children() {
        return this.childObjects;
    }
}

class Group extends Object3D {
}

class Scene extends Object3D {
}

class Color {
    constructor(value) {
        this.value = value;
    }
}

class Light extends Object3D {

}

class AmbientLight extends Light {

}

class WebGL1Renderer {
    constructor() {
        this.domElement = null;
        this.xr = {
            enabled: false,
            setSession: () => {}
        }
        this.shadowMap = {
            enabled: false,
            type: 0
        }
    }

    setPixelRatio() {

    }

    setSize() {

    }

    render() {

    }
}

class PerspectiveCamera extends Object3D {
    updateProjectionMatrix() {

    }
}

class AudioListener extends Object3D {

}

module.exports = {
    Group,
    Scene,
    Color,
    Light,
    AmbientLight,
    WebGL1Renderer,
    PerspectiveCamera,
    Vector3,
    AudioListener
}
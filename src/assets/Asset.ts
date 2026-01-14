import EventEmitter from "../util/EventEmitter";
import AssetStore from "./AssetStore";

class Asset {
    assetStore: AssetStore;

    baseURL: string | null;
    dirHandle: FileSystemDirectoryHandle | null;

    path: string;
    data: any;

    objectURL: string | null;

    eventEmitter: EventEmitter;

    constructor(baseURLorDirHandle: string | FileSystemDirectoryHandle, path: string, assetStore: AssetStore) {
        this.assetStore = assetStore;

        if (typeof baseURLorDirHandle === 'string') {
            this.baseURL = baseURLorDirHandle;
            if (this.baseURL.endsWith('/')) {
                this.baseURL = this.baseURL.slice(0, this.baseURL.length - 1);
            }
            this.dirHandle = null;
        } else {
            this.baseURL = null;
            this.dirHandle = baseURLorDirHandle;
        }

        this.path = path;
        this.data = null;
        this.eventEmitter = new EventEmitter();
    }

    /**
     * Obtains the full url (baseURL + path), or if using a FileSystemDirectoryHandle instead of a baseURL,
     * this will get an Object URL (a data url) that can be used to read the file contents.
     * @returns 
     */
    async getFullURL(): Promise<string> {
        if (this.baseURL) {
            return `${this.baseURL}/${this.path}`;
        } else if (this.dirHandle) {
            if (this.objectURL) { // used cached value to avoid allocating duplicate Object URLs
                return this.objectURL;
            } else {
                const file = await Asset.getFileAtPath(this.dirHandle, this.path);
                this.objectURL = URL.createObjectURL(file);
                return this.objectURL;
            }
        } else {
            throw new Error('Asset.getFullURL(): baseURL or dirHandle must be set');
        }
    }

    static async getFileAtPath(dirHandle: FileSystemDirectoryHandle, path: string) {
        let pathSegments = path.split('/');

        if (pathSegments[pathSegments.length - 1] === '/') {
            pathSegments = pathSegments.slice(0, pathSegments.length - 1);
        }
    
        let currentDirHandle = dirHandle;
        for (let i = 0; i<pathSegments.length; i++) {
            const currentSegment = pathSegments[i];
            if (i === (pathSegments.length - 1)) {
                const fileHandle = await currentDirHandle.getFileHandle(currentSegment);
                const file = await fileHandle.getFile();
                return file;
            } else {
                currentDirHandle = await currentDirHandle.getDirectoryHandle(currentSegment);
            }
        }
    }

    async load(): Promise<void> {
        // Override this in sub-class, with logic specific to the type of asset
        // this may involve using a loader specificto the type of asset, and
        // setting this.data to something
    }

    getData() {
        return this.data;
    }

    // Allows you to change the data of an Asset to a given state, without reloading it from file.
    // useful for making in memory changes without yet saving/modifying the underlying asset file. (as with the Scene Editor)
    setData(data) {
        this.data = data;
        this.eventEmitter.emit('change');
    }

    once(eventName, fn) {
        this.eventEmitter.once(eventName, fn);
    }

    unload() {
        if (this.objectURL) {
            URL.revokeObjectURL(this.objectURL);
        }
    }
}

export default Asset;
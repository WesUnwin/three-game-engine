class Asset {
    constructor(baseURL, path) {
        this.baseURL = baseURL;
        this.path = path;
        this.data = null;
    }

    getFullURL() {
        return `${this.baseURL}/${this.path}`;
    }

    async load() {
        // Override this in sub-class, with logic specific to the type of asset
        // this may involve using a loader specificto the type of asset, and
        // setting this.data to something
    }

    getData() {
        return this.data;
    }
}

export default Asset
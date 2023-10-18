class Asset {
    baseURL: string;
    path: string;
    data: any;

    constructor(baseURL: string, path: string) {
        this.baseURL = baseURL;
        this.path = path;
        this.data = null;
    }

    getFullURL(): string {
        return `${this.baseURL}/${this.path}`;
    }

    async load(): Promise<void> {
        // Override this in sub-class, with logic specific to the type of asset
        // this may involve using a loader specificto the type of asset, and
        // setting this.data to something
    }

    getData() {
        return this.data;
    }
}

export default Asset
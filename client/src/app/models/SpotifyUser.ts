export class SpotifyUser {
    country: string = null;
    displayName: string = null;
    email: string = null;
    href: string = null;
    id: string = null;

    constructor(instanceData?: SpotifyUser) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: SpotifyUser) {
        const keys = Object.keys(this);
        keys.forEach(key => {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        });
    }
}

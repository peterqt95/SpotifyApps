export class SpotifyAuthUrl {
    authUrl: string = null;

    constructor(instanceData?: SpotifyAuthUrl) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: SpotifyAuthUrl) {
        const keys = Object.keys(this);
        keys.forEach(key => {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        });
    }
}

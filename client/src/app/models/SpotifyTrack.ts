import { BaseModel } from './BaseModel';

export class SpotifyArtist extends BaseModel {
    name: string = null;
    id: string = null;
    artistUrl: string = null;

    constructor(instanceData?: SpotifyArtist) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}

export class SpotifyTrack extends BaseModel {

    album: string = null;
    albumId: string = null;
    albumUrl: string = null;
    artists: SpotifyArtist[] = [];
    url: string = null;
    name: string = null;
    duration: number = null;
    id: string = null;
    popularity: number = null;

    constructor(instanceData?: SpotifyTrack) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);

            // Make sure artists get model
            this.toArtist(this.artists);
        }
    }

    private toArtist(tempArr: any[]): void {
        const artists: SpotifyArtist[] = [];
        tempArr.forEach(temp => {
            artists.push(new SpotifyArtist(temp));
        });
        this.artists = artists;
    }
}

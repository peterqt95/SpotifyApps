
import { BaseModel } from './BaseModel';
import { SpotifyArtist, SpotifyTrack } from './SpotifyTrack';


export class SpotifyAlbum extends BaseModel {

    name: string = null;
    id: string = null;
    image: string = null;
    url: string = null;
    releaseDate: string = null;
    popularity: number = null;
    artists: SpotifyArtist[] = [];
    tracks: SpotifyTrack[] = [];

    constructor(instanceData?: SpotifyAlbum) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);

            // Make sure artists get model
            this.toArtist(this.artists);
            this.toTrack(this.tracks);
        }
    }

    private toArtist(tempArr: any[]): void {
        const artists: SpotifyArtist[] = [];
        tempArr.forEach(temp => {
            artists.push(new SpotifyArtist(temp));
        });
        this.artists = artists;
    }

    private toTrack(tempArr: any[]): void {
        const tracks: SpotifyTrack[] = [];
        tempArr.forEach(temp => {
            tracks.push(new SpotifyTrack(temp));
        });
        this.tracks = tracks;
    }
}

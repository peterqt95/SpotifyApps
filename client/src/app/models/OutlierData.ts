import { SpotifyTrack } from './SpotifyTrack';

export class OutlierData {

    tracks: SpotifyTrack[] = [];

    constructor(tracks: SpotifyTrack[]) {
        this.tracks = tracks;
    }

}
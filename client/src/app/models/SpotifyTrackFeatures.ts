import { BaseModel } from './BaseModel';

export class SpotifyTrackFeatures extends BaseModel {

    danceability: number = null;
    energy: number = null;
    key: number = null;
    mode: number = null;
    speechiness: number = null;
    acousticness: number = null;
    instrumentalness: number = null;
    liveness: number = null;
    valence: number = null;
    tempo: number = null;
    id: string = null;
    time_signature: number = null;
    duration: string = null;

    constructor(instanceData?: SpotifyTrackFeatures) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}

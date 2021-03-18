import { BaseModel } from './BaseModel';
import { SpotifyTrack } from './SpotifyTrack';
import { SpotifyTrackFeatures } from './SpotifyTrackFeatures';

export class TrackStats extends BaseModel {
    trackInfo: SpotifyTrack = null;
    trackAudioFeature: SpotifyTrackFeatures = null;

    constructor(instanceData?: TrackStats) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}

import { BaseModel } from './BaseModel';
import { SpotifyTrack } from './SpotifyTrack';
import { SpotifyTrackFeatures } from './SpotifyTrackFeatures';

export class DescriptiveStats extends BaseModel {

    count: number = null;
    mean: number = null;
    std: number = null;
    min: number = null;
    lower_perc: number = null;
    median: number = null;
    upper_perc: number = null;
    max: number = null;
    type: string = null;

    constructor(instanceData?: DescriptiveStats) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}

export class PCACord extends BaseModel {
    x: number = null;
    y: number = null;
    anomaly: number = null;
    id: string = null;

    constructor(instanceData?: PCACord) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}

export class SpotifyAudioAnalysis extends BaseModel {

    featureDescriptions: DescriptiveStats[] = [];
    outliers: string[] = [];
    spotifyCords: PCACord[] = [];

    constructor(instanceData?: SpotifyAudioAnalysis) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);

            // Model the descriptive stats
            this.toDescriptiveStats(this.featureDescriptions);
        }
    }

    private toDescriptiveStats(tempArr: any[]): void {
        const descriptiveStats: DescriptiveStats[] = [];
        tempArr.forEach(temp => {
            descriptiveStats.push(new DescriptiveStats(temp));
        });
        this.featureDescriptions = descriptiveStats;
    }
}

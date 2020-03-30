import { BaseModel } from './BaseModel';

export class SpotifyAuthUrl extends BaseModel {
    authUrl: string = null;

    constructor(instanceData?: SpotifyAuthUrl) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}

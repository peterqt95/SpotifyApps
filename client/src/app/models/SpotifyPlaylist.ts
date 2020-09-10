import { BaseModel } from './BaseModel';

export class SpotifyPlaylistInfo extends BaseModel {

    name: string = null;
    id: string = null;
    owner: string = null;
    externalUrl: string = null;
    image: string = null;
    playlistLength: string = null;

    constructor(instanceData?: SpotifyPlaylistInfo) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}

import { BaseModel } from './BaseModel';

export class SpotifyUser extends BaseModel {
    country: string = null;
    displayName: string = null;
    email: string = null;
    href: string = null;
    id: string = null;

    constructor(instanceData?: SpotifyUser) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}

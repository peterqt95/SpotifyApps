export class BaseModel {
    public constructor(instanceData?: any) {
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }

    public deserialize(instanceData: any, self) {
        const keys = Object.keys(self);
        keys.forEach(key => {
            if (instanceData.hasOwnProperty(key)) {
                self[key] = instanceData[key];
            }
        });
    }
}
import { BaseModel } from '@app/models/BaseModel';

export class BarChartData extends BaseModel {

    name: string = null;
    value: number = null;

    constructor(instanceData?: any) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}
import { BaseModel } from '@app/models/BaseModel';
import { BubbleChartDataItem } from '@swimlane/ngx-charts';

export class BubbleChartData extends BaseModel {
    name: string = null;
    series: BubbleChartDataItem[] = [];

    constructor(instanceData?: any) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}
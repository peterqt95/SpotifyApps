import { ChartDataPoint } from './ChartDataPoint';
import { BaseModel } from '@app/models/BaseModel';

export class GroupedBarChartData extends BaseModel{
    name: string = null;
    series: ChartDataPoint[] = [];

    constructor(instanceData?: any) {
        super(instanceData);
        if (instanceData) {
            this.deserialize(instanceData, this);
        }
    }
}
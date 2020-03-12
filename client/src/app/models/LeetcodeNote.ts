export class LeetcodeNote {
    solution: string = null;
    message: string = null;
    problem: string = null;
    userId: number = null;
    myId: number = null;
    dateCreated: number = null;
    title: string = null;

    constructor(instanceData?: LeetcodeNote) {
        if (instanceData) {
            this.deserialize(instanceData);
        }
    }

    private deserialize(instanceData: LeetcodeNote) {
        const keys = Object.keys(this);
        keys.forEach(key => {
            if (instanceData.hasOwnProperty(key)) {
                this[key] = instanceData[key];
            }
        });
    }
}

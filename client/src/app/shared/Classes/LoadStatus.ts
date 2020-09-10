export class LoadStatus {
    isLoaded: boolean;
    isError: boolean;
    errorMsg: string;

    constructor() {
        this.isLoaded = false;
        this.isError = false;
        this.errorMsg = '';
    }
}
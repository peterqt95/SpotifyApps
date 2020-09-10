import { Type } from '@angular/core';

export class ModalItem {

    constructor(public component: Type<any>, public title: string, public data: any) {}
}
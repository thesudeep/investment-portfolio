import { NgModule } from '@angular/core';
import { ShortNumberPipe } from './pipe/short-number.pipe';

@NgModule({
    declarations: [ShortNumberPipe],
    exports: [ShortNumberPipe]

})
export class SharedModule { }
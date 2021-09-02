import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortNumberPipe } from './pipe/short-number.pipe';
import { PercentChangeComponent } from './components/percent-change/percent-change.component';

@NgModule({
    declarations: [ShortNumberPipe, PercentChangeComponent],
    imports: [CommonModule],
    exports: [ShortNumberPipe, PercentChangeComponent]

})
export class SharedModule { }
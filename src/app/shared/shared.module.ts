import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShortNumberPipe } from './pipe/short-number.pipe';
import { PercentChangeComponent } from './components/percent-change/percent-change.component';
import { SearchFilterPipe } from './pipe/search-filter.pipe';

@NgModule({
    declarations: [ShortNumberPipe, SearchFilterPipe, PercentChangeComponent],
    imports: [CommonModule],
    exports: [ShortNumberPipe, SearchFilterPipe, PercentChangeComponent]

})
export class SharedModule { }
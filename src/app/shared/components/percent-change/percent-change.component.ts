import {Component, ViewChild, AfterViewInit, Inject, Input} from '@angular/core';

@Component({
  selector: 'app-percent-change',
  templateUrl: './percent-change.component.html',
  styleUrls: ['./percent-change.component.scss']
})
export class PercentChangeComponent  {
  @Input() value: number = 0;
  constructor() {}

  ngOnInit() {

  }

}

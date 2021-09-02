import { Component, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { logos }  from '../../util/logos'; 
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-assets-cards',
  templateUrl: './assets-cards.component.html',
  styleUrls: ['./assets-cards.component.scss'],
  encapsulation: ViewEncapsulation.None

})
export class AssetsCardsComponent {

  showDetail: boolean = false; 
  logoUrl: string = '';

  @Input() ticker: any;

  @ViewChild(MatPaginator) paginator: any;

  constructor(public dialog: MatDialog) {

  }
  ngOnInit(): void {
    this.logoUrl = logos.find((logo: any) => logo.ticker === this.ticker)? logos.find((logo: any) => logo.ticker === this.ticker).url : '';
  }



}


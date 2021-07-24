import { AfterViewInit, Component, ViewChild, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { logos }  from '../../util/logos'; 
@Component({
  selector: 'app-assets-cards',
  templateUrl: './assets-cards.component.html',
  styleUrls: ['./assets-cards.component.scss']
})
export class AssetsCardsComponent implements AfterViewInit{
  // displayedColumns: string[] = ['date', 'unitPrice', 'fees', 'quantity', 'price'];
  // dataSource = new MatTableDataSource<any>()
  showDetail: boolean = false; 
  logoUrl: string = '';

  @Input() ticker: any;
  @Input() transaction: any;
  // @Input() transactionByMonthYearTicker: any;

  @ViewChild(MatPaginator) paginator: any;

  constructor() {

  }
  ngOnInit(): void {
    this.logoUrl = logos.find((logo: any) => logo.ticker === this.ticker)? logos.find((logo: any) => logo.ticker === this.ticker).url : '';

    // this.transactionByMonthYearTicker.forEach((item: any) => {
    //   this.dataSource.data.push(item);
    // });

    // console.log(this.transactionByMonthYearTicker)
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator;
  }

  toggleDetails() {
    this.showDetail = !this.showDetail;
  }

}

export interface AssetsElement {
  date: string;
  product: string;
  unitPrice: number;
  fees: number;
  quantity: number;
  price: number;
}


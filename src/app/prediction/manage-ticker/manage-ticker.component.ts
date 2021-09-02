import { Component, OnInit, Inject, Input, HostListener, ElementRef, Output, EventEmitter, ɵLocaleDataIndex } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-manage-ticker',
  templateUrl: './manage-ticker.component.html',
  styleUrls: ['./manage-ticker.component.scss']
})
export class ManageTickerComponent implements OnInit {
  public brokerType: string = '';
  filteredTickers: any = [];
  totalTickers = 1;
  defaultRecords: any = 40;
  pageEvent: any;
  constructor(public dialogRef: MatDialogRef<ManageTickerComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public appService: AppService) { }

  ngOnInit(): void {
    this.totalTickers = this.data.tickers.length;
    // if(this.data.type === 'coinbase') {
    //   this.brokerType = 'coinbaseData';
    //   let localData = window.localStorage.getItem(this.brokerType);
    //   if(localData) {
    //     this.coinbaseData = JSON.parse(localData);
    //   }
    // } else if(this.data.type === 'binance') {
    //   this.brokerType = 'binanceData';
    //   let localData = window.localStorage.getItem(this.brokerType);
    //   if(localData) {
    //     this.binanceData = JSON.parse(localData);
    //   }
    // } 
    this.filteredTickers = this.data.tickers.slice(0, this.defaultRecords);

  }

  onPaginateChange(data: any) {
    this.filteredTickers = this.data.tickers.slice(data.pageIndex * data.pageSize, data.pageIndex*data.pageSize + data.pageSize);
  }


  close(): void {
    this.dialogRef.close();
  }

  updateTicker($event: any, ticker: any) {
    this.data.tickers.find((ticker:any)=> ticker.id === ticker.id).selected = $event.checked;
    this.appService.manageCrypto(this.data.tickers);
  }

}

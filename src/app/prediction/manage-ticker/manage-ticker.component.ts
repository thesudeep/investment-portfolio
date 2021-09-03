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
  public searchTerm: string = '';

  constructor(public dialogRef: MatDialogRef<ManageTickerComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public appService: AppService) { }

  ngOnInit(): void {
    this.totalTickers = this.data.tickers.length;
    this.filteredTickers = this.data.tickers.filter((item: any) => item['symbol'].search(new RegExp(this.searchTerm, 'i')) > -1).slice(0, this.defaultRecords);

  }

  onPaginateChange(data: any) {
    this.filteredTickers = this.data.tickers.filter((item: any) => item['symbol'].search(new RegExp(this.searchTerm, 'i')) > -1).slice(data.pageIndex * data.pageSize, data.pageIndex * data.pageSize + data.pageSize);
  }

  search(event: any): void {
    this.searchTerm = event.target.value.trim();
    this.filteredTickers = this.data.tickers.filter((item: any) => item['symbol'].search(new RegExp(this.searchTerm, 'i')) > -1).slice(0, this.defaultRecords);
  }

  close(): void {
    this.dialogRef.close();
  }

  updateTicker($event: any, ticker: any) {
    this.data.tickers.find((item: any) => item.id === ticker.id).selected = $event.checked;
    this.appService.manageCrypto(this.data.tickers);
  }

  clearSearchFilter() {
    this.filteredTickers = this.data.tickers.slice(0, this.defaultRecords);
  }

}

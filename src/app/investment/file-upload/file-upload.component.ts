import { Component, OnInit, Inject, Input, HostListener, ElementRef, Output, EventEmitter, ɵLocaleDataIndex } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() progress: any;
  public files: any = [];
  public coinbaseData: any = [];
  public binanceData: any = [];
  public robinhoodData: any = [];
  public brokerType: string = '';


  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.files.push(file);
  }

  constructor(public dialogRef: MatDialogRef<FileUploadComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public appService: AppService) { }

  ngOnInit(): void {
    if(this.data.type === 'coinbase') {
      this.brokerType = 'coinbaseData';
      let localData = window.localStorage.getItem(this.brokerType);
      if(localData) {
        this.coinbaseData = JSON.parse(localData);
      }
    } else if(this.data.type === 'binance') {
      this.brokerType = 'binanceData';
      let localData = window.localStorage.getItem(this.brokerType);
      if(localData) {
        this.binanceData = JSON.parse(localData);
      }
    } 

  }


  close(): void {
    this.dialogRef.close();
    this.files = [];
  }

  process(): void {
    if(this.brokerType === 'coinbaseData') {
      this.processCoinbase();
    } else if(this.brokerType === 'binanceData') {
      this.processBinance();
    }
  }

  removeFile(file: any) {
    let index = this.files.findIndex((item:any) => item === file);
    if(index !== -1) {
      this.files.splice(index, 1);
    }

  }

  private processCoinbase() {
    window.localStorage.removeItem(this.brokerType);
    for(const [i, file] of this.files.entries()) {
      var reader = new FileReader();
      reader.readAsText(file);
  
      reader.onload = ((event: any) => {
        let data = this.transformCoinbase(event.target.result);
        if (data.length > 0) {
          if (this.coinbaseData.length === 0) {
            window.localStorage.setItem(this.brokerType, JSON.stringify(data));
          } else {
            let newData = this.coinbaseData;
            for (let i = 0; i < data.length; i++) {
              if (!this.coinbaseData.map((item: any) => item.id).includes(data[i].id)) {
                newData.push(data[i]);
              }
            }
            window.localStorage.setItem(this.brokerType, JSON.stringify(newData));
          }
          let localData = window.localStorage.getItem(this.brokerType);
          if (localData) {
            this.coinbaseData = JSON.parse(localData);
          }

          if(i=== this.files.length-1) {
            this.dialogRef.close();
            this.files = [];
            this.appService.trigger();
          }
        }
      });
  
      reader.onerror = ((err) => {
        console.log(err)
        // clear file
      });
    }
  }

  private processBinance() {
    window.localStorage.removeItem(this.brokerType);
    for(const [i, file] of this.files.entries()) {
      var reader = new FileReader();
      reader.readAsText(file);

      reader.onload = ((event: any) => {
        let data = this.transformBinance(event.target.result);
        if (data.length > 0) {
          if (this.binanceData.length === 0) {
            window.localStorage.setItem(this.brokerType, JSON.stringify(data));
          } else {
            let newData = this.binanceData;
            for (let i = 0; i < data.length; i++) {
              if (!this.binanceData.map((item: any) => item.id).includes(data[i].id)) {
                newData.push(data[i]);
              }
            }
            window.localStorage.setItem(this.brokerType, JSON.stringify(newData));
          }
          let localData = window.localStorage.getItem(this.brokerType);
          if (localData) {
            this.binanceData = JSON.parse(localData);
          }

          if(i=== this.files.length-1) {
            this.dialogRef.close();
            this.files = [];
            this.appService.trigger();
          }
        }
      });
  
      reader.onerror = ((err) => {
        console.log(err)
        // clear file
      });
    }
  }

  private transformCoinbase(contents: string) {
    const allRows = contents.trim().split(/\r\n|\n/);
    let data = [];
    for (let i = 1; i < allRows.length; i++) {
      let row = allRows[i].split(',');
      let item = {
        id: `coin_${row[1]}`,
        product: row[2],
        productName: row[6], 
        type: row[3],
        date: new Date(row[4]),
        quantity: parseFloat(row[5]),
        price: parseFloat(row[9]),
        unitPrice: parseFloat(row[7]),
        fees: parseFloat(row[8]),
        unitFees: parseFloat(row[8])/parseFloat(row[5]),
        remaining: parseFloat(row[5]),
        realizedGainLoss: 0,
        unrealizedGainLoss: 0,
        currentValue:0

      }
      // if(item.product === "FIL") {
      //   data.push(item);
      // }
      data.push(item);

    }
    return data;
  }

  private transformBinance(contents: string) {
    const allRows = contents.trim().split(/\r\n|\n/);
    let data = [];
    for (let i = 1; i < allRows.length; i++) {
      let row = allRows[i].split(',');
      let id = `binance_${i}`;
      let product = row[1].replace('USDT', 'USD');;
      let productName = product.replace('USDT', '').replace('USD', '');
      let type = row[2];
      let date = new Date(row[0]);
      let quantity = parseFloat(row[4]);
      let price = parseFloat(row[5]);
      let unitPrice = parseFloat(row[3]);
      let fees = parseFloat(row[6]) * unitPrice;
      let unitFees = fees/unitPrice;

      let item = {
        id: id,
        product: product,
        productName: productName, 
        type: type,
        date: date,
        quantity: quantity,
        price: price,
        unitPrice: unitPrice,
        fees: fees, //
        unitFees: unitFees,
        remaining: quantity,
        realizedGainLoss: 0,
        unrealizedGainLoss: 0,
        currentValue:0

      }
      // if(item.product === "FIL") {
      //   data.push(item);
      // }
      data.push(item);

    }
    return data;
  }
  

}

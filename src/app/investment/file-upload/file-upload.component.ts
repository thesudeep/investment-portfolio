import { Component, OnInit, Inject, Input, HostListener, ElementRef, Output, EventEmitter, ɵLocaleDataIndex } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit {
  @Input() progress: any;
  public file: any = null;
  public transactionsData: any = [];

  @HostListener('change', ['$event.target.files']) emitFiles(event: FileList) {
    const file = event && event.item(0);
    this.file = file;
  }

  constructor(public dialogRef: MatDialogRef<FileUploadComponent>, public appService: AppService) { }

  ngOnInit(): void {
    let localData = window.localStorage.getItem('transactionsData');
    if (localData) {
      this.transactionsData = JSON.parse(localData);
    }
  }


  close(): void {
    this.dialogRef.close();
    this.file = null;
  }

  process(): void {

    var reader = new FileReader();
    reader.readAsText(this.file);

    reader.onload = ((event: any) => {
      let data = this.transformCoinbase(event.target.result);
      if (data.length > 0) {
        window.localStorage.removeItem('transactionsData');
        if (this.transactionsData.length === 0) {
          window.localStorage.setItem('transactionsData', JSON.stringify(data));
        } else {
          let newData = this.transactionsData;
          for (let i = 0; i < data.length; i++) {
            if (!this.transactionsData.map((item: any) => item.id).includes(data[i].id)) {
              newData.push(data[i]);
            }
          }
          window.localStorage.setItem('transactionsData', JSON.stringify(newData));
        }
        let localData = window.localStorage.getItem('transactionsData');
        if (localData) {
          this.transactionsData = JSON.parse(localData);
        }
      }
      this.dialogRef.close();
      this.file = null;
      this.appService.trigger();
  
    });

    reader.onerror = ((err) => {
      console.log(err)
      // clear file
    })

  }

  private transformCoinbase(contents: string) {
    const allRows = contents.trim().split(/\r\n|\n/);
    let data = [];
    for (let i = 1; i < allRows.length; i++) {
      let row = allRows[i].split(',');
      let item = {
        id: `coin_${row[1]}`,
        product: row[6], // row[2] shows USD or USDC
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

}

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root'})
export class AppService {

  public uploadSubject = new Subject<string>();
  public toggleShowCurrentAssetsSubject = new Subject<boolean>();

  public manageCryptoSubject = new Subject<any>();


  trigger() {
    this.uploadSubject.next();
  }

  toggleShowCurrentAssets(value: boolean) {
    this.toggleShowCurrentAssetsSubject.next(value);
  }

  manageCrypto(tickers: any) {
    this.manageCryptoSubject.next(tickers);
  }

}
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';


@Injectable({ providedIn: 'root'})
export class AppService {

  public uploadSubject = new Subject<string>();

  trigger() {
    this.uploadSubject.next();
  }

}
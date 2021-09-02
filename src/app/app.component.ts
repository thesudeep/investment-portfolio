import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'investment-portfolio';
  showOnlyCurrentAssets = true;

  assetsToggleControl = new FormControl(true);

  constructor(private overlay: OverlayContainer, public appService: AppService) { }

  ngOnInit(): void {    
    this.assetsToggleControl.valueChanges.subscribe((showOnlyCurrentAssets) => {
      this.showOnlyCurrentAssets = showOnlyCurrentAssets;
      this.appService.toggleShowCurrentAssets(this.showOnlyCurrentAssets);
    });
    
  }

}

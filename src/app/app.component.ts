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


  @HostBinding('class') className = '';

  themeToggleControl = new FormControl(true);
  assetsToggleControl = new FormControl(true);

  constructor(private overlay: OverlayContainer, public appService: AppService) { }

  ngOnInit(): void {

    
    const darkClassName = 'darkMode';
    this.className = darkClassName;
    this.overlay.getContainerElement().classList.add(darkClassName);
    this.themeToggleControl.valueChanges.subscribe((darkMode) => {
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });

    this.assetsToggleControl.valueChanges.subscribe((showOnlyCurrentAssets) => {
      this.showOnlyCurrentAssets = showOnlyCurrentAssets;
      this.appService.toggleShowCurrentAssets(this.showOnlyCurrentAssets);
    });
    
  }

  updateTheme(val: boolean) {
    this.themeToggleControl.setValue(val);
  }

}

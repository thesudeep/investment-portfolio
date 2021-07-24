import { Component, HostBinding } from '@angular/core';
import { FormControl } from '@angular/forms';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'investment-portfolio';


  @HostBinding('class') className = '';

  toggleControl = new FormControl(true);

  constructor(private overlay: OverlayContainer) { }

  ngOnInit(): void {

    
    const darkClassName = 'darkMode';
    this.className = darkClassName;
    this.overlay.getContainerElement().classList.add(darkClassName);
    this.toggleControl.valueChanges.subscribe((darkMode) => {
      this.className = darkMode ? darkClassName : '';
      if (darkMode) {
        this.overlay.getContainerElement().classList.add(darkClassName);
      } else {
        this.overlay.getContainerElement().classList.remove(darkClassName);
      }
    });
    
  }

  updateTheme(val: boolean) {
    this.toggleControl.setValue(val);
  }

}

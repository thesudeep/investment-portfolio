import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatRadioModule  } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AssetsCardsComponent } from './assets-cards/assets-cards.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { FileUploadComponent } from './file-upload/file-upload.component';

@NgModule({
  declarations: [
    PortfolioComponent,
    AssetsCardsComponent,
    SearchFilterPipe,
    FileUploadComponent

  ],
  imports: [
    CommonModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatMenuModule,
    MatRadioModule,
    MatDialogModule,
    MatFormFieldModule

  ]
})
export class InvestmentModule { }

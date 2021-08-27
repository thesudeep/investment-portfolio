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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { PortfolioHeaderComponent } from './portfolio-header/portfolio-header.component';
import { CoinbaseComponent } from './coinbase/coinbase.component';
import { AssetsCardsComponent } from './assets-cards/assets-cards.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { SharedModule } from '../shared/shared.module';
import { BinanceComponent } from './binance/binance.component';

@NgModule({
  declarations: [
    PortfolioHeaderComponent,
    CoinbaseComponent,
    BinanceComponent,
    AssetsCardsComponent,
    SearchFilterPipe,
    FileUploadComponent,
    TransactionDetailsComponent

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
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    SharedModule
  ]
})
export class InvestmentModule { }

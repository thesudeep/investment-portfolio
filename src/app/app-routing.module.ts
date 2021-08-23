import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoinbaseComponent } from './investment/coinbase/coinbase.component';

const routes: Routes = [
  { path: '', redirectTo: '/coinbase', pathMatch: 'full' },
  { path: 'coinbase', component: CoinbaseComponent },
  { path: 'robinhood', component: CoinbaseComponent },
  { path: 'binance', component: CoinbaseComponent },
  { path: 'cryptoprediction', component: CoinbaseComponent },
  { path: 'stockprediction', component: CoinbaseComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

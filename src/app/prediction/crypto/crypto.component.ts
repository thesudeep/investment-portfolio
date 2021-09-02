import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit {

  predictionType = "cryptoData";
  cryptoData: any[] = [];
  filteredCryptoData: any[] = [];
  

  constructor(private http: HttpClient, public dialog: MatDialog, public appService: AppService) { }

  ngOnInit(): void {
    let cryptData = window.localStorage.getItem(this.predictionType);
    if (cryptData) {
      this.cryptoData = JSON.parse(cryptData);
      console.log(this.cryptoData)
      this.filteredCryptoData = this.cryptoData.filter((ticker: any) => ticker.selected === true)
    }

    let existingPortfolio = new Set();
    let localCoinbaseData = window.localStorage.getItem("coinbaseData");
    if (localCoinbaseData) {
      let coinbaseData = JSON.parse(localCoinbaseData);
      for (const coinbase of coinbaseData) {
        existingPortfolio.add(coinbase.productName);
      }
    }

    let localbinanceData = window.localStorage.getItem("binanceData");
    if (localbinanceData) {
      let binanceData = JSON.parse(localbinanceData);
      for (const binance of binanceData) {
        existingPortfolio.add(binance.productName);
      }
    }


    let url = 'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=1&limit=1000&sortBy=market_cap&sortType=desc&convert=USD&audited=false&aux=ath,atl,high24h,low24h,num_market_pairs,cmc_rank,date_added,tags,platform,max_supply,circulating_supply,total_supply,volume_7d,volume_30d';
    this.http.get<any>(url).subscribe((response: any) => {
      console.log(response)
      let existingTickers = [... new Set(existingPortfolio)]
      if (this.cryptoData.length === 0) {
        response.data.cryptoCurrencyList.forEach((ticker: any) => {
          let portfolioExists = existingTickers.includes(ticker.symbol);
          let quotes = ticker.quotes[0];
          quotes.ath = ticker.ath;
          quotes.atl = ticker.atl;
          quotes.high24h = ticker.high24h;
          quotes.low24h = ticker.low24h;
          this.cryptoData.push({
            id: ticker.id,
            name: ticker.name,
            symbol: ticker.symbol,
            portfolioExists: portfolioExists,
            imageUrl: `https://s2.coinmarketcap.com/static/img/coins/64x64/${ticker.id}.png`,
            selected: portfolioExists,
            quotes: ticker.quotes[0]
          });
        });
        window.localStorage.setItem(this.predictionType, JSON.stringify(this.cryptoData));
        this.filteredCryptoData = this.cryptoData.filter((ticker: any) => ticker.selected === true)
      }
    })

    this.appService.manageCryptoSubject.subscribe((response: any) => {
      window.localStorage.setItem(this.predictionType, JSON.stringify(response));
      this.filteredCryptoData = response.filter((ticker: any) => ticker.selected === true)

    });    



  }

  ngOnDestroy() {
  }

  reset(): void {
    window.localStorage.removeItem(this.predictionType);
    window.localStorage.setItem(this.predictionType, JSON.stringify(this.cryptoData));
  }

  filter(filterText: string): void {
  }

  sorted(selectedSortedItem?: any): void {

  }

}

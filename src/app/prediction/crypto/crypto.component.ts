import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';
import { AppService } from 'src/app/app.service';
import { defaultSelectedOption } from '../prediction-header/sortedOptions';

@Component({
  selector: 'app-crypto',
  templateUrl: './crypto.component.html',
  styleUrls: ['./crypto.component.scss']
})
export class CryptoComponent implements OnInit {

  predictionType = "cryptoData";
  cryptoData: any[] = [];
  filteredCryptoData: any[] = [];
  public searchTerm: string = '';
  public selectedSortedItem: any;

  public sortedTickers: any = [];
  public timeInterval: Subscription;


  constructor(private http: HttpClient, public dialog: MatDialog, public appService: AppService) { }

  ngOnInit(): void {
    this.selectedSortedItem = defaultSelectedOption;

    let cryptData = window.localStorage.getItem(this.predictionType);
    if (cryptData) {
      this.cryptoData = JSON.parse(cryptData);
      this.filteredCryptoData = this.cryptoData.filter((ticker: any) => ticker.selected === true);
      this.sorted();
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
        this.sorted();

      }
    })

    this.appService.manageCryptoSubject.subscribe((response: any) => {
      window.localStorage.setItem(this.predictionType, JSON.stringify(response));
      this.filteredCryptoData = response.filter((ticker: any) => ticker.selected === true)
      this.sorted();
    });

    this.timeInterval = interval(5000).pipe().subscribe(() => {
      this.http.get<any>(url).subscribe((response: any) => {

        this.cryptoData.forEach((item: any) => {
          let updatedTicker = response.data.cryptoCurrencyList.find((cryptoCurrency: any) => cryptoCurrency.id === item.id);
          if(updatedTicker) {
            item.quotes = updatedTicker.quotes[0];
            item.quotes.ath = updatedTicker.ath;
            item.quotes.atl = updatedTicker.atl;
            item.quotes.high24h = updatedTicker.high24h;
            item.quotes.low24h = updatedTicker.low24h;
          }
        });
        this.filteredCryptoData = this.cryptoData.filter((ticker: any) => ticker.selected === true)
        this.sorted();


      })
    });

  }

  ngOnDestroy() {
  }

  reset(): void {
    window.localStorage.removeItem(this.predictionType);
    window.localStorage.setItem(this.predictionType, JSON.stringify(this.cryptoData));
  }

  filter(filterText: string): void {
    this.searchTerm = filterText;
  }

  sorted(selectedSortedItem?: any): void {
    if (selectedSortedItem) {
      this.selectedSortedItem = selectedSortedItem;
    }
    let sortedTickers = this.filteredCryptoData.sort((a: any, b: any) => {
      if (this.selectedSortedItem.orderIndex > 0) {
        return a["quotes"][this.selectedSortedItem.name] - b["quotes"][this.selectedSortedItem.name];
      }
      return b["quotes"][this.selectedSortedItem.name] - a["quotes"][this.selectedSortedItem.name];
    })
    this.sortedTickers = [...sortedTickers];
  }

}

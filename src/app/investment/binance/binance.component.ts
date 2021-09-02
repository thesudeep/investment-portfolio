import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { groupBy } from '../../util/util';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';
import { FileUploadComponent } from '../file-upload/file-upload.component';
import { defaultSelectedOption } from '../portfolio-header/sortedOptions';

@Component({
  selector: 'app-binance',
  templateUrl: './binance.component.html',
  styleUrls: ['./binance.component.scss']
})
export class BinanceComponent implements OnInit {

  public portfolio: any;
  public sortedTickers: any = [];
  public searchTerm: string = '';


  public selectedSortedItem: any;

  public timeInterval: Subscription = new Subscription();

  constructor(private http: HttpClient, public dialog: MatDialog, public appService: AppService) { }

  ngOnInit(): void {
    this.selectedSortedItem = defaultSelectedOption;
    this.portfolio = {
      assets: [],
      totalRealizedGainLoss: 0,
      totalUnrealizedGainLoss: 0,
      totalGainLoss: 0,
      totalCurrentValue: 0,
      totalFees: 0,
      totalPurchase: 0,
      totalSales: 0,
      totalVolume: 0
    }
    this.appService.uploadSubject.subscribe(() => {
      this.initializeData();
    })
    this.initializeData();
    this.timeInterval = interval(500).pipe().subscribe(() => {
      this.calculateAggregations();
    });
  }

  ngOnDestroy() {
    this.timeInterval.unsubscribe();
  }

  delete(): void {
    localStorage.removeItem('binanceData');
    this.portfolio.assets = [];
    this.portfolio.totalRealizedGainLoss = 0;
    this.portfolio.totalUnrealizedGainLoss = 0;
    this.portfolio.totalGainLoss = 0;
    this.portfolio.totalCurrentValue = 0;
    this.portfolio.totalFees = 0;
    this.portfolio.totalPurchase = 0;
    this.portfolio.totalSales = 0;
    this.portfolio.totalVolume = 0;
    this.sortedTickers = [];
  }

  filter(filterText: string): void {
    this.searchTerm = filterText;
  }

  sorted(selectedSortedItem?: any): void {
    if (selectedSortedItem) {
      this.selectedSortedItem = selectedSortedItem;
    }
    let items: any[] = [];
    Object.keys(this.portfolio.assets).forEach((item) => {
      items.push({
        name: item,
        value: this.portfolio.assets[item][this.selectedSortedItem.name]
      })
    });
    let sortedTickers = items.sort((a: any, b: any) => {
      if (this.selectedSortedItem.orderIndex > 0) {
        return a.value - b.value;
      }
      return b.value - a.value
    })
    this.sortedTickers = sortedTickers.map((item: any) => item.name);
  }

  private initializeData() {
    let localData = window.localStorage.getItem('binanceData');
    if (localData) {
      let transactionData = JSON.parse(localData);
      const groupByTicker = groupBy("productName");
      this.portfolio.assets = groupByTicker(transactionData);
      //this.calculateAggregations();
    }
  }

  private calculateAggregations() {
    let tickers = Object.keys(this.portfolio.assets)
    let totalRealizedGainLoss = 0;
    let totalUnrealizedGainLoss = 0;
    let totalGainLoss = 0;
    let totalCurrentValue = 0;
    let totalFees = 0;
    let totalPurchase = 0;
    let totalSales = 0;
    let totalVolume = 0;
    this.getCurrentPrice(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${tickers.join(",")}&tsyms=USD`).subscribe(currentPrices => {
      tickers.forEach((ticker: string) => {
        let transactions = this.portfolio.assets[ticker].sort((a: any, b: any) => {
          let d1: any = new Date(a.date);
          let d2: any = new Date(b.date);
          return d1 - d2;
        });

        this.portfolio.assets[ticker].totalPurchase = Math.abs(this.portfolio.assets[ticker].filter((item: any) => item.type === "BUY").reduce((a: number, b: any) => +a + +b.price, 0));
        this.portfolio.assets[ticker].totalSales = Math.abs(this.portfolio.assets[ticker].filter((item: any) => item.type === "SELL").reduce((a: number, b: any) => +a + +b.price, 0));
        this.portfolio.assets[ticker].totalVolume = this.portfolio.assets[ticker].totalPurchase + this.portfolio.assets[ticker].totalSales;
        for (let i = 0; i < transactions.length; i++) {
          if (transactions[i].type === "SELL") {
            while (transactions[i].remaining != 0) {
              let remainingPurchaseTransactions = transactions.filter((item: any) => item.type === "BUY" && item.remaining > 0);
              if(remainingPurchaseTransactions.length === 0) {
                break;
              }
              for(let j=0; j<remainingPurchaseTransactions.length;j++) {
                if(transactions[i].remaining-remainingPurchaseTransactions[j].remaining >= 0) {
                  transactions[i].remaining = transactions[i].remaining-remainingPurchaseTransactions[j].remaining;
                  remainingPurchaseTransactions[j].remaining = 0;
                } else {
                  remainingPurchaseTransactions[j].remaining = remainingPurchaseTransactions[j].remaining - transactions[i].remaining;
                  transactions[i].remaining = 0;
                  break;
                }
              }
            }
          }
        }
        // calculate realized gain/loss
        for (let i = 0; i < transactions.length; i++) {
          if (transactions[i].type === "BUY" && transactions[i].remaining > 0) {
            while (transactions[i].remaining != 0) {
              let sellTransactions = transactions.find((item: any) => item.type === "SELL" && item.remaining > 0);
              if (sellTransactions) {
                if (sellTransactions.remaining > transactions[i].remaining) {
                  sellTransactions.remaining -= transactions[i].remaining;
                  transactions[i].realizedGainLoss += this.updateRealizedGainLoss(transactions[i].remaining, transactions[i].unitPrice, transactions[i].unitFees, sellTransactions.unitPrice, sellTransactions.unitFees)
                  transactions[i].remaining = 0;
                } else {
                  transactions[i].remaining -= sellTransactions.remaining;
                  transactions[i].realizedGainLoss += this.updateRealizedGainLoss(sellTransactions.remaining, transactions[i].unitPrice, transactions[i].unitFees, sellTransactions.unitPrice, sellTransactions.unitFees)
                  sellTransactions.remaining = 0;
                }
              } else {
                break;
              }
            }
            // calculate unrealized gain/loss
            if (transactions[i].remaining > 0) {
              let currentPrice = currentPrices[ticker]["USD"];
              let unrealizedGainLossSellPrice = transactions[i].remaining * currentPrice;
              let unrealizedGainLossPurchasePrice = transactions[i].remaining * transactions[i].unitPrice + transactions[i].unitFees;
              transactions[i].unrealizedGainLoss = unrealizedGainLossSellPrice - unrealizedGainLossPurchasePrice;
              transactions[i].currentValue = unrealizedGainLossSellPrice;
            }
          }
        }

        this.portfolio.assets[ticker].totalRealizedGainLoss = this.portfolio.assets[ticker].reduce((a: number, b: any) => +a + +b.realizedGainLoss, 0);
        this.portfolio.assets[ticker].totalUnrealizedGainLoss = this.portfolio.assets[ticker].reduce((a: number, b: any) => +a + +b.unrealizedGainLoss, 0);
        this.portfolio.assets[ticker].totalGainLoss = this.portfolio.assets[ticker].totalRealizedGainLoss + this.portfolio.assets[ticker].totalUnrealizedGainLoss;
        this.portfolio.assets[ticker].remaining = this.portfolio.assets[ticker].reduce((a: number, b: any) => +a + +b.remaining, 0);
        this.portfolio.assets[ticker].totalCurrentValue = this.portfolio.assets[ticker].reduce((a: number, b: any) => +a + +b.currentValue, 0);
        this.portfolio.assets[ticker].stats = this.getStats(currentPrices, `${ticker}`);
        this.portfolio.assets[ticker].totalFees = this.portfolio.assets[ticker].reduce((a: number, b: any) => +a + +b.fees, 0);
        this.portfolio.assets[ticker].change = (this.portfolio.assets[ticker].stats.current - this.portfolio.assets[ticker].stats.open) / this.portfolio.assets[ticker].stats.open * 100;



        totalRealizedGainLoss += this.portfolio.assets[ticker].totalRealizedGainLoss;
        totalUnrealizedGainLoss += this.portfolio.assets[ticker].totalUnrealizedGainLoss;
        totalGainLoss += this.portfolio.assets[ticker].totalGainLoss;
        totalCurrentValue += this.portfolio.assets[ticker].totalCurrentValue;
        totalFees += this.portfolio.assets[ticker].totalFees;

        totalPurchase += this.portfolio.assets[ticker].totalPurchase;
        totalSales += this.portfolio.assets[ticker].totalSales;
        totalVolume += this.portfolio.assets[ticker].totalVolume;
      });
      this.portfolio.totalRealizedGainLoss = totalRealizedGainLoss;
      this.portfolio.totalUnrealizedGainLoss = totalUnrealizedGainLoss;
      this.portfolio.totalGainLoss = totalGainLoss;
      this.portfolio.totalCurrentValue = totalCurrentValue;
      this.portfolio.totalFees = totalFees;
      this.portfolio.totalPurchase = totalPurchase;
      this.portfolio.totalSales = totalSales;
      this.portfolio.totalVolume = totalVolume;
      this.sorted();
    });
  }

  private updateRealizedGainLoss(totalSoldQuantity: number, purchaseUnitPrice: number, purchaseUnitFees: number, salesUnitPrice: number, salesUnitFees: number): number {
    return (totalSoldQuantity * salesUnitPrice - totalSoldQuantity * salesUnitFees) - (totalSoldQuantity * purchaseUnitPrice + totalSoldQuantity * purchaseUnitFees);
  }

  private getCurrentPrice(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  private getStats(currentPrices: any, ticker: string) {
    let currentPrice = currentPrices[ticker]['USD'];
    if(ticker === 'USD') {
      currentPrices = 1;
    }
    return {
      current: currentPrice,
      open: currentPrice,
      low: currentPrice,
      high: currentPrice,
      volume: null
    };
  }

}

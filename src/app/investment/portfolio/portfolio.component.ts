import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { groupBy } from '../../util/util';
import { AppService } from '../../app.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, interval } from 'rxjs';
import { FileUploadComponent } from '../file-upload/file-upload.component';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  public portfolio: any;
  public sortedTickers: any = [];
  public searchTerm: string = '';
  public sortedOptions = [
    {
      value: 1,
      text: 'Highest Realized Gain',
      name: 'totalRealizedGainLoss',
      orderIndex: -1
    },
    {
      value: 2,
      text: 'Highest Realized Loss',
      name: 'totalRealizedGainLoss',
      orderIndex: 1
    },
    {
      value: 3,
      text: 'Highest Unrealized Gain',
      name: 'totalUnrealizedGainLoss',
      orderIndex: -1
    },
    {
      value: 4,
      text: 'Highest Unrealized Loss',
      name: 'totalUnrealizedGainLoss',
      orderIndex: 1
    },
    {
      value: 5,
      text: 'Highest Current Gain',
      name: 'totalGainLoss',
      orderIndex: -1
    },
    {
      value: 6,
      text: 'Highest Current Loss',
      name: 'totalGainLoss',
      orderIndex: 1
    },
    {
      value: 7,
      text: 'Highest Current Value',
      name: 'totalCurrentValue',
      orderIndex: -1
    },
    {
      value: 8,
      text: 'Highest Fee',
      name: 'totalFees',
      orderIndex: -1
    },
    {
      value: 9,
      text: 'Todays Best',
      name: 'change',
      orderIndex: -1
    },
    {
      value: 10,
      text: 'Todays Worst',
      name: 'change',
      orderIndex: 1
    }
  ];

  public selectedSortedValue = 7;

  public timeInterval: Subscription;

  constructor(private http: HttpClient, public dialog: MatDialog, public appService: AppService) { }

  ngOnInit(): void {
    this.portfolio = {
      assets: null,
      totalRealizedGainLoss: 0,
      totalUnrealizedGainLoss: 0,
      totalGainLoss: 0,
      totalCurrentValue: 0,
      totalFees: 0,
      totalPurchase: 0,
      totalSales:  0,
      totalVolume: 0
    }
    this.appService.uploadSubject.subscribe(() => {
      this.initializeData();
    })
    this.initializeData();
    this.timeInterval = interval(10000).pipe().subscribe(() => {
      this.calculateAggregations();
    });
  }

  clear(): void {
    localStorage.removeItem('transactionsData');
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

  search(event: any): void {
    this.searchTerm = event.target.value;
  }

  onSorted(event: any): void {
    this.selectedSortedValue = event.value;
    const selectedSortedItem = this.sortedOptions.find((item: any) => item.value === this.selectedSortedValue);
    if (selectedSortedItem) {
      let items: any[] = [];
      Object.keys(this.portfolio.assets).forEach((item) => {
        items.push({
          name: item,
          value: this.portfolio.assets[item][selectedSortedItem.name]
        })
      });
      let sortedTickers = items.sort((a: any, b: any) => {
        if (selectedSortedItem.orderIndex > 0) {
          return a.value - b.value;
        }
        return b.value - a.value
      })
      this.sortedTickers = sortedTickers.map((item: any) => item.name);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FileUploadComponent, {
      width: '1450px',
      height: 'auto',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  public clearSearchFilter() {
    this.searchTerm = '';
  }


  private initializeData() {
    let localData = window.localStorage.getItem('transactionsData');
    if (localData) {
      let transactionData = JSON.parse(localData);
      const groupByTicker = groupBy("productName");
      this.portfolio.assets = groupByTicker(transactionData);
      this.calculateAggregations();
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
    this.getCurrentPrice(`https://api.pro.coinbase.com/products/stats`).subscribe(productStats => {
      tickers.forEach((ticker: string) => {
        let transactions = this.portfolio.assets[ticker].sort((a: any, b: any) => {
          let d1: any = new Date(a.date);
          let d2: any = new Date(b.date);
          return d1 - d2;
        });

        this.portfolio.assets[ticker].totalPurchase = Math.abs(this.portfolio.assets[ticker].filter((item: any) => item.type === "BUY").reduce((a: number, b: any) => +a + +b.price, 0));
        this.portfolio.assets[ticker].totalSales = Math.abs(this.portfolio.assets[ticker].filter((item: any) => item.type === "SELL").reduce((a: number, b: any) => +a + +b.price, 0));
        this.portfolio.assets[ticker].totalVolume = this.portfolio.assets[ticker].totalPurchase + this.portfolio.assets[ticker].totalSales;

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
              let currentPrice = this.getLastPrice(productStats, transactions[i].product);
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
        this.portfolio.assets[ticker].stats = this.getStats(productStats, `${ticker}`);
        this.portfolio.assets[ticker].totalFees = this.portfolio.assets[ticker].reduce((a: number, b: any) => +a + +b.fees, 0);
        this.portfolio.assets[ticker].change = (this.portfolio.assets[ticker].stats.stats_24hour.last - this.portfolio.assets[ticker].stats.stats_24hour.open) / this.portfolio.assets[ticker].stats.stats_24hour.open * 100;


 
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
      this.onSorted({ value: this.selectedSortedValue }); //sorted by highest value
      console.log(this.portfolio)
    });
  }

  private updateRealizedGainLoss(totalSoldQuantity: number, purchaseUnitPrice: number, purchaseUnitFees: number, salesUnitPrice: number, salesUnitFees: number): number {
    return (totalSoldQuantity * salesUnitPrice - totalSoldQuantity * salesUnitFees) - (totalSoldQuantity * purchaseUnitPrice + totalSoldQuantity * purchaseUnitFees);
  }

  private getCurrentPrice(url: string): Observable<any> {
    return this.http.get<any>(url);
  }

  private getLastPrice(productStats: any, ticker: string) {
    return productStats[ticker]["stats_24hour"]["last"];
  }

  private getStats(productStats: any, ticker: string) {
    let stats = productStats[`${ticker}-USD`] || productStats[`${ticker}-USDC`];
    return stats;
  }

}

export const sortedOptions = [
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


  export const defaultSelectedOption =  {
    value: 7,
    text: 'Highest Current Value',
    name: 'totalCurrentValue',
    orderIndex: -1
  }
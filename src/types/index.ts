export interface ILogin {
  email: string;
  password: string;
}

export interface IUserInformation {
  marketplace: string;
  sellerId: string;
}

export interface ISkuParams {
  isDaysCompare: number;
  marketplace: string;
  pageNumber: number;
  pageSize: number;
  salesDate: string;
  salesDate2: string;
  sellerId: string;
}

export interface IOverviewParams {
  marketplace: string;
  sellerId: string;
  requestStatus: number;
  day: number;
  excludeYoYData: boolean;
}

export interface ISkuList {
  [x: string]: any;
  amount: number;
  amount2: number;
  asin: string;
  imageUrl: string;
  productName: string;
  qty: number;
  qty2: number;
  refundPercantage: number;
  shippingAmount: number;
  shippingAmount2: number;
  sku: string;
  sortingAmount: number;
}

export interface IItemDate {
  date: string;
  selected: boolean;
}

export interface ITableHeaderItem {
  key: string;
  label: string;
}

export interface ISalesItem {
  date: string;
  profit: string;
  fbaAmount: string;
  fbmAmount: string;
}

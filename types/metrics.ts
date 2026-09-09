export interface BrandMetric {
  brandCode: string;
  brandName: string;
  salesVolume: number;
  salesValue: number;
  returnVolume: number;
  returnValue: number;
  returnPct: number;
}

export interface ChannelMetric {
  channel: string;
  salesVolume: number;
  salesValue: number;
  returnVolume: number;
  returnValue: number;
  returnPct: number;
}

export interface CategoryMetric {
  brandName: string;
  category: string;
  salesVolume: number;
  salesValue: number;
}

export interface DiscountBucket {
  label: string;
  minPct: number;
  maxPct: number;
  count: number;
  pct: number;
}

export interface StoreMetric {
  storeName: string;
  storeCode: number;
  salesValue: number;
  salesVolume: number;
  sharePct: number;
}

export interface LocationMetric {
  location: string;
  salesValue: number;
  salesVolume: number;
  sharePct: number;
}

export interface TopCategoryMetric {
  category: string;
  salesValue: number;
  sharePct: number;
}

export interface BrandChannelMetric {
  brandName: string;
  channel: string;
  salesVolume: number;
  salesValue: number;
  returnVolume: number;
  returnValue: number;
  returnPct: number;
}

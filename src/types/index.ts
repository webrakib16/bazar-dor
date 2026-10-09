export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryName: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: string;
    pct: number;
  };
  markets: {
    market: string;
    division: string;
    min: number;
    max: number;
  }[];
}
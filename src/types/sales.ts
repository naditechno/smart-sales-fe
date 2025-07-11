export interface Sales {
  coordinator_id: number;
  coordinator_name: string;
  coordinator_email: string;
  sales_id: number;
  sales_name: string;
  sales_email: string;
}

export interface SalesTargetFunding {
  id: number;
  coordinator_id: number;
  sales_id: number;
  date: string;
  details: {
    funding_product_id: number;
    target: number;
  }[];
  coordinator_name: string;
  coordinator_email: string;
  sales_name: string;
  sales_email: string;
}

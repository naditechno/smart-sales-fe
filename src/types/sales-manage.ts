export interface FundingProduct {
  id: number;
  name: string;
  description: string;
  minimum_amount: number;
  maximum_amount: number;
  interest_rate: number;
  eligibility_criteria: string;
  status: boolean;
  funding_product_category_id?: number;
  category_name: string;
  category_description: string,
  category_contribution: number;
}  

export interface FundingProductCategory {
  id: number;
  name: string;
  description: string;
  contribution: number;
  created_at: string;
  updated_at: string;
}

export interface FundingProductTarget {
  id: number;
  funding_product_id?: number;
  sales_category_id?: number;
  min_target: number;
  max_target: number;
  status: boolean;
  created_at: string;
  updated_at: string;
  funding_product_name: string;
  sales_category_name: string;
}

export interface LendingProduct {
  id: number; 
  name: string;
  description: string;
  loan_amount_min: number;
  loan_amount_max: number;
  interest_rate: number;
  repayment_terms: string;
  eligibility_criteria: string;
  status: boolean;
}


export interface FundingApplication {
  id: number;
  customerName: string;
  product: string;
  amount: number;
  date: string;
  status: "Tertunda" | "Disetujui" | "Ditolak";
  sales: string;
  coordinator: string;
  approvalDate?: string;
  disbursementDate?: string;
}

export type LendingApplicationStatus = "Tertunda" | "Disetujui" | "Ditolak";

export interface LendingApplication {
  id: number;
  customerName: string;
  product: string;
  amount: number;
  date: string;
  status: LendingApplicationStatus;
  sales: string;
  coordinator: string;
}
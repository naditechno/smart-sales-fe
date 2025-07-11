export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  salutation: string; // MR, MRS, MS, dll
  job_title: string;
  email: string;
  phone: string;
  address: string;
  postal_code: string;
  latitude: number;
  longitude: number;
  status: boolean;
  created_at: string;
  updated_at: string;

  // Relasi (nullable)
  wilayah_kerja_id: number | null;
  cabang_id: number | null;
  bank_id: number | null;
  cabang_bank_mitra_id: number | null;
  sales_id: number | null;

  // Tambahan informasi pinjaman
  reference_date: string | null;
  disbursement_date: string | null;
  cif: string | null;
  loan_account_number: string | null;
  plafond: number | null;
  remaining_loan: number | null;
  net_receipt: number | null;
  time_period: number | null;
  loan_type: string | null;
  loan_product: string | null;
  rm_name: string | null;
  disbursement_files: File | null;

  customer_file_flag: boolean;
  attacthment_form: File | null;
  attachment_form_flag: boolean;
  mutation_flag: boolean;
  mutation_files: File | null;
  payrol: string | null;

  // Relasi nama dari ID di atas
  wilayah_kerja_name: string | null;
  cabang_name: string | null;
  bank_name: string | null;
  cabang_bank_mitra_name: string | null;
  sales_name: string | null;
}

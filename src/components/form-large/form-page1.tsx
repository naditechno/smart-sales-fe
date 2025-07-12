import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Combobox } from "@/components/ui/combo-box";

// Import types from your project
import { Customer } from "@/types/customer";
import { User } from "@/types/user";
import { WilayahKerja } from "@/types/wilayah-kerja";
import { Branch } from "@/types/branch";
import { Bank } from "@/types/bank";
import { CabangBankMitra } from "@/types/cabangbankmitra";
import { useGetCurrentUserQuery } from "@/services/auth.service";

interface FormPage1Props {
  form: Partial<Customer>;
  setForm: (data: Partial<Customer>) => void;
  username: string;
  role: string; // "sales", "superadmin", "koordinator_sales"
  userId: number;

  // Props for relational comboboxes
  wilayahKerjaList: WilayahKerja[];
  loadingWilayahKerja: boolean;
  errorWilayahKerja: boolean;
  setWilayahKerjaSearch: (search: string) => void;

  cabangList: Branch[];
  loadingCabang: boolean;
  errorCabang: boolean;
  setCabangSearch: (search: string) => void;

  bankList: Bank[];
  loadingBanks: boolean;
  errorBanks: boolean;
  setBankSearch: (search: string) => void;

  mitraCabangList: CabangBankMitra[];
  loadingMitraCabang: boolean;
  errorMitraCabang: boolean;
  setMitraCabangSearch: (search: string) => void;

  salesList: User[];
  loadingSales: boolean;
  errorSales: boolean;
  setSalesSearch: (search: string) => void;
}

const FormPage1: React.FC<FormPage1Props> = ({
  form,
  setForm,
  username,
  role,
  wilayahKerjaList,
  loadingWilayahKerja,
  errorWilayahKerja,
  setWilayahKerjaSearch,
  cabangList,
  loadingCabang,
  errorCabang,
  setCabangSearch,
  bankList,
  loadingBanks,
  errorBanks,
  setBankSearch,
  mitraCabangList,
  loadingMitraCabang,
  errorMitraCabang,
  setMitraCabangSearch,
  salesList,
  loadingSales,
  errorSales,
  setSalesSearch,
}) => {
  const { data: currentUser } = useGetCurrentUserQuery();

 useEffect(() => {
   if (
     role === "sales" &&
     !form.sales_id &&
     currentUser &&
     currentUser.roles?.[0]?.name === "sales"
   ) {
     setForm({
       ...form,
       sales_id: currentUser.id,
     });
   }
 }, [role, form.sales_id, currentUser, setForm]);

  return (
    <>
      {/* --- Relational Combobox Fields --- */}
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="wilayah_kerja_id">Wilayah Kerja</Label>
        <Combobox<WilayahKerja>
          value={form.wilayah_kerja_id ?? null}
          onChange={(id) => setForm({ ...form, wilayah_kerja_id: id })}
          onSearchChange={setWilayahKerjaSearch}
          data={wilayahKerjaList ?? []}
          getOptionLabel={(item) => item.name}
          placeholder={
            loadingWilayahKerja ? "Loading..." : "Pilih Wilayah Kerja"
          }
          isLoading={loadingWilayahKerja}
        />
        {errorWilayahKerja && (
          <p className="text-sm text-red-500 mt-1">
            Gagal memuat wilayah kerja.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="cabang_id">Cabang</Label>
        <Combobox<Branch>
          value={form.cabang_id ?? null}
          onChange={(id) => setForm({ ...form, cabang_id: id })}
          onSearchChange={setCabangSearch}
          data={cabangList}
          getOptionLabel={(item) => item.name}
          placeholder={loadingCabang ? "Loading..." : "Pilih Cabang"}
          isLoading={loadingCabang}
        />
        {errorCabang && (
          <p className="text-sm text-red-500 mt-1">Gagal memuat cabang.</p>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="bank_id">Bank</Label>
        <Combobox<Bank>
          value={form.bank_id ?? null}
          onChange={(id) => setForm({ ...form, bank_id: id })}
          onSearchChange={setBankSearch}
          data={bankList}
          getOptionLabel={(item) => item.name}
          placeholder={loadingBanks ? "Loading..." : "Pilih Bank"}
          isLoading={loadingBanks}
        />
        {errorBanks && (
          <p className="text-sm text-red-500 mt-1">Gagal memuat bank.</p>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="cabang_bank_mitra_id">Cabang Bank Mitra</Label>
        <Combobox<CabangBankMitra>
          value={form.cabang_bank_mitra_id ?? null}
          onChange={(id) => setForm({ ...form, cabang_bank_mitra_id: id })}
          onSearchChange={setMitraCabangSearch}
          data={mitraCabangList}
          getOptionLabel={(item) => item.name}
          placeholder={
            loadingMitraCabang ? "Loading..." : "Pilih Cabang Bank Mitra"
          }
          isLoading={loadingMitraCabang}
        />
        {errorMitraCabang && (
          <p className="text-sm text-red-500 mt-1">
            Gagal memuat cabang bank mitra.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="sales_id">Sales</Label>

        {role === "sales" ? (
          <Input
            value={currentUser?.name ?? "Sales tidak ditemukan"}
            readOnly
            className="bg-gray-100"
          />
        ) : (
          <Combobox<User>
            value={form.sales_id ?? null}
            onChange={(id) => setForm({ ...form, sales_id: id })}
            onSearchChange={setSalesSearch}
            data={salesList}
            getOptionLabel={(user: User) =>
              `${user.name}${user.email ? ` (${user.email})` : ""}`
            }
            placeholder={loadingSales ? "Loading..." : "Pilih Sales"}
            isLoading={loadingSales}
          />
        )}

        {errorSales && role !== "sales" && (
          <p className="text-sm text-red-500 mt-1">Gagal memuat data sales.</p>
        )}
      </div>

      {/* --- Personal Info --- */}
      <div className="flex flex-col gap-y-1">
        <Label htmlFor="salutation">Salutation</Label>
        <Input
          id="salutation"
          value={form.salutation || ""}
          onChange={(e) => setForm({ ...form, salutation: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="job_title">Job Title</Label>
        <Input
          id="job_title"
          value={form.job_title || ""}
          onChange={(e) => setForm({ ...form, job_title: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="first_name">Nama Depan</Label>
        <Input
          id="first_name"
          value={form.first_name || ""}
          onChange={(e) => setForm({ ...form, first_name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="last_name">Nama Belakang</Label>
        <Input
          id="last_name"
          value={form.last_name || ""}
          onChange={(e) => setForm({ ...form, last_name: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="username">Username (Otomatis)</Label>
        <Input
          id="username"
          value={username}
          readOnly
          className="bg-gray-100"
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email || ""}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="phone">Nomor Telepon</Label>
        <Input
          id="phone"
          type="tel"
          value={form.phone || ""}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1 col-span-1 md:col-span-2">
        <Label htmlFor="address">Alamat</Label>
        <Input
          id="address"
          value={form.address || ""}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="postal_code">Kode Pos</Label>
        <Input
          id="postal_code"
          value={form.postal_code || ""}
          onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="latitude">Latitude</Label>
        <Input
          id="latitude"
          type="number"
          step="any"
          value={form.latitude ?? ""}
          onChange={(e) =>
            setForm({ ...form, latitude: Number(e.target.value) })
          }
        />
      </div>

      <div className="flex flex-col gap-y-1">
        <Label htmlFor="longitude">Longitude</Label>
        <Input
          id="longitude"
          type="number"
          step="any"
          value={form.longitude ?? ""}
          onChange={(e) =>
            setForm({ ...form, longitude: Number(e.target.value) })
          }
        />
      </div>
    </>
  );
};

export default FormPage1;

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface LendingProduct {
  id: number;
  name: string;
  description: string;
  loanRange: string;
  interestStructure: string;
  paymentTerms: string;
  eligibilityCriteria: string;
  active: boolean;
}

interface Props {
  form: Partial<LendingProduct>;
  setForm: (form: Partial<LendingProduct>) => void;
  onSubmit: () => void;
  onCancel: () => void;
  editingId: number | null;
}

export default function LendingProductForm({
  form,
  setForm,
  onSubmit,
  onCancel,
  editingId,
}: Props) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 w-full max-w-2xl space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">
          {editingId ? "Edit" : "Tambah"} Produk Pinjaman
        </h2>
        <Button variant="ghost" onClick={onCancel}>
          ✕
        </Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-y-1">
          <label>Nama Produk</label>
          <Input
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Deskripsi</label>
          <Input
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Kisaran Jumlah Pinjaman</label>
          <Input
            value={form.loanRange || ""}
            onChange={(e) => setForm({ ...form, loanRange: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-y-1">
          <label>Struktur Suku Bunga/Biaya</label>
          <Input
            value={form.interestStructure || ""}
            onChange={(e) =>
              setForm({ ...form, interestStructure: e.target.value })
            }
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <label>Ketentuan Pembayaran</label>
          <Input
            value={form.paymentTerms || ""}
            onChange={(e) => setForm({ ...form, paymentTerms: e.target.value })}
          />
        </div>
        <div className="sm:col-span-2 flex flex-col gap-y-1">
          <label>Kriteria Kelayakan</label>
          <Input
            value={form.eligibilityCriteria || ""}
            onChange={(e) =>
              setForm({ ...form, eligibilityCriteria: e.target.value })
            }
          />
        </div>
      </div>
      <div className="pt-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button onClick={onSubmit}>Simpan</Button>
      </div>
    </div>
  );
}

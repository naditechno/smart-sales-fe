export default function TaskScheduleSection() {
  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Jadwal Tugas</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 border">ID Tugas</th>
              <th className="px-4 py-2 border">Nama Tugas</th>
              <th className="px-4 py-2 border">Deskripsi</th>
              <th className="px-4 py-2 border">Frekuensi</th>
              <th className="px-4 py-2 border">Waktu Terjadwal</th>
              <th className="px-4 py-2 border">Tanggal Terakhir Dijalankan</th>
              <th className="px-4 py-2 border">Tanggal Berikutnya</th>
              <th className="px-4 py-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {/* Data rows will go here */}
            <tr>
              <td className="px-4 py-2 border">T001</td>
              <td className="px-4 py-2 border">Sinkronisasi Data</td>
              <td className="px-4 py-2 border">Sinkronisasi database harian</td>
              <td className="px-4 py-2 border">Harian</td>
              <td className="px-4 py-2 border">02:00</td>
              <td className="px-4 py-2 border">28-06-2025</td>
              <td className="px-4 py-2 border">29-06-2025</td>
              <td className="px-4 py-2 border">Aktif</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded">
          Buat Tugas Terjadwal Baru
        </button>
        <button className="px-4 py-2 bg-yellow-500 text-white rounded">
          Edit Jadwal Tugas
        </button>
        <button className="px-4 py-2 bg-green-600 text-white rounded">
          Jalankan Tugas Manual
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded">
          Lihat Log Tugas
        </button>
      </div>
    </section>
  );
}

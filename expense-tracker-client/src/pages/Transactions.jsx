import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

function formatMoney(value, currency = "IDR") {
  const n = Number(value) || 0;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency,
  }).format(n);
}

export default function Transactions() {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // form
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [categoryId, setCategoryId] = useState("");
  const [currency, setCurrency] = useState("IDR");
  const [submitting, setSubmitting] = useState(false);

  // filter
  const [filterCategoryId, setFilterCategoryId] = useState("");

  const [error, setError] = useState("");

  const selectedCategoryName = useMemo(() => {
    const found = categories.find((c) => String(c.id) === String(categoryId));
    return found?.name || "";
  }, [categories, categoryId]);

  async function fetchCategories() {
    const res = await api.get("/categories");
    setCategories(res.data);
  }

  async function fetchTransactions() {
    try {
      setLoading(true);

      const params = {};
      if (filterCategoryId) params.categoryId = filterCategoryId;

      const res = await api.get("/transactions", { params });
      setItems(res.data);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal load transactions");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        await fetchCategories();
        await fetchTransactions();
      } catch (err) {
        setError(err?.response?.data?.message || "Gagal load data");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterCategoryId]);

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      // ✅ normalisasi: "99,74" -> "99.74"
      const normalizedAmount = String(amount).replace(",", ".");
      const numericAmount = Number(normalizedAmount);

      await api.post("/transactions", {
        title,
        amount: numericAmount,
        date,
        categoryId: Number(categoryId),
        currency,
      });

      // reset form
      setTitle("");
      setAmount("");
      setDate(new Date().toISOString().slice(0, 10));
      setCategoryId("");
      setCurrency("IDR");

      await fetchTransactions();
    } catch (err) {
      const data = err?.response?.data;
      if (data?.errors?.length) setError(data.errors.join(", "));
      else setError(data?.message || "Gagal tambah transaction");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id) {
    const ok = window.confirm("Yakin mau hapus transaksi ini?");
    if (!ok) return;

    try {
      setError("");
      await api.delete(`/transactions/${id}`);
      await fetchTransactions();
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal hapus transaction");
    }
  }

  // ✅ biar preview juga ngerti koma
  const previewAmount = String(amount).replace(",", ".");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Transactions</h1>
        <p className="text-sm text-gray-600">Tambah dan lihat daftar transaksi.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="bg-white border rounded-xl shadow-sm p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="text-sm font-medium text-gray-900">Filter</div>
        <div className="flex gap-2 items-center">
          <select
            value={filterCategoryId}
            onChange={(e) => setFilterCategoryId(e.target.value)}
            className="border rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setFilterCategoryId("")}
            className="border hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium text-gray-700"
          >
            Reset
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 bg-white border rounded-xl shadow-sm">
          <div className="p-4 border-b">
            <div className="font-semibold text-gray-900">Add Transaction</div>
            <div className="text-sm text-gray-600">Isi data transaksi.</div>
          </div>

          <form onSubmit={onSubmit} className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Misal: Makan siang"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Amount</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Misal: 99.74"
                type="number"
                step="0.01"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
              <div className="text-xs text-gray-500 mt-1">
                Preview: {formatMoney(previewAmount, currency)}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="IDR">IDR (Rp)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="KRW">KRW (₩)</option>
                <option value="JPY">JPY (¥)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                value={date}
                onChange={(e) => setDate(e.target.value)}
                type="date"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="">Pilih category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>

              {selectedCategoryName && (
                <div className="text-xs text-gray-500 mt-1">Dipilih: {selectedCategoryName}</div>
              )}
            </div>

            <button
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              {submitting ? "Saving..." : "Save"}
            </button>

            <div className="text-xs text-gray-500">
              * Kalau dropdown category kosong, buat dulu category di menu Categories.
            </div>
          </form>
        </div>

        <div className="lg:col-span-3 bg-white border rounded-xl shadow-sm">
          <div className="p-4 border-b">
            <div className="font-semibold text-gray-900">List Transactions</div>
            <div className="text-sm text-gray-600">Data dari API (include Category).</div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-sm text-gray-600">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-gray-600">Belum ada transaksi.</div>
            ) : (
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-gray-600">
                    <tr className="border-b">
                      <th className="py-2 pr-3">Date</th>
                      <th className="py-2 pr-3">Title</th>
                      <th className="py-2 pr-3">Category</th>
                      <th className="py-2 pr-3 text-right">Amount</th>
                      <th className="py-2 pr-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((t) => (
                      <tr key={t.id} className="border-b last:border-b-0 hover:bg-gray-50">
                        <td className="py-2 pr-3 whitespace-nowrap">{t.date}</td>
                        <td className="py-2 pr-3">{t.title}</td>
                        <td className="py-2 pr-3">{t.Category?.name ?? "-"}</td>
                        <td className="py-2 pr-3 text-right">
                          {formatMoney(t.amount, t.currency || "IDR")}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          <button
                            onClick={() => onDelete(t.id)}
                            className="text-red-600 hover:text-red-700 font-medium"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

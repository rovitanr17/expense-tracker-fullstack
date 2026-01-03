import { useEffect, useMemo, useState } from "react";
import { api } from "../services/api";

function formatMoney(value, currency = "IDR") {
  const n = Number(String(value).replace(",", ".")) || 0;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
    currencyDisplay: "symbol",
  }).format(n);
}

export default function Dashboard() {
  const [categories, setCategories] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function fetchAll() {
    try {
      setLoading(true);
      setError("");

      const [catRes, trxRes] = await Promise.all([
        api.get("/categories"),
        api.get("/transactions"),
      ]);

      setCategories(catRes.data);
      setTransactions(trxRes.data);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal load dashboard data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  const totalsByCurrency = useMemo(() => {
    const map = new Map();
    for (const t of transactions) {
      const cur = t.currency || "IDR";
      const amt = Number(String(t.amount).replace(",", ".")) || 0;
      map.set(cur, (map.get(cur) || 0) + amt);
    }

    const arr = Array.from(map.entries()).map(([currency, total]) => ({ currency, total }));
    arr.sort((a, b) => {
      if (a.currency === "IDR") return -1;
      if (b.currency === "IDR") return 1;
      return a.currency.localeCompare(b.currency);
    });
    return arr;
  }, [transactions]);

  const recent = useMemo(() => [...transactions].slice(0, 5), [transactions]);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-600">Ringkasan pengeluaran kamu (per currency).</p>
        </div>

        <button
          onClick={fetchAll}
          className="border hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium text-gray-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-600">Total Transactions</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {loading ? "..." : transactions.length}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-600">Total Categories</div>
          <div className="mt-2 text-2xl font-semibold text-gray-900">
            {loading ? "..." : categories.length}
          </div>
        </div>

        <div className="bg-white border rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-600">Totals by Currency</div>
          <div className="mt-2 space-y-1">
            {loading ? (
              <div className="text-sm text-gray-600">...</div>
            ) : totalsByCurrency.length === 0 ? (
              <div className="text-sm text-gray-600">Belum ada transaksi.</div>
            ) : (
              totalsByCurrency.map((x) => (
                <div key={x.currency} className="flex items-center justify-between">
                  <div className="text-sm font-medium text-gray-700">{x.currency}</div>
                  <div className="text-sm font-semibold text-gray-900">
                    {formatMoney(x.total, x.currency)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="font-semibold text-gray-900">Recent Transactions</div>
          <div className="text-sm text-gray-600">5 transaksi terakhir.</div>
        </div>

        <div className="p-4">
          {loading ? (
            <div className="text-sm text-gray-600">Loading...</div>
          ) : recent.length === 0 ? (
            <div className="text-sm text-gray-600">
              Belum ada transaksi. Tambah transaksi di menu Transactions.
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-gray-600">
                  <tr className="border-b">
                    <th className="py-2 pr-3">Date</th>
                    <th className="py-2 pr-3">Title</th>
                    <th className="py-2 pr-3">Category</th>
                    <th className="py-2 pr-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((t) => (
                    <tr key={t.id} className="border-b last:border-b-0 hover:bg-gray-50">
                      <td className="py-2 pr-3 whitespace-nowrap">{t.date}</td>
                      <td className="py-2 pr-3">{t.title}</td>
                      <td className="py-2 pr-3">{t.Category?.name ?? "-"}</td>
                      <td className="py-2 pr-3 text-right">
                        {formatMoney(t.amount, t.currency || "IDR")}
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
  );
}

import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Categories() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");

  async function fetchCategories() {
    try {
      setLoading(true);
      const res = await api.get("/categories");
      setItems(res.data);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchCategories();
  }, []);

  function startEdit(cat) {
    setEditingId(cat.id);
    setName(cat.name);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setName("");
    setError("");
  }

  async function onSubmit(e) {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      if (editingId) {
        await api.put(`/categories/${editingId}`, { name });
      } else {
        await api.post("/categories", { name });
      }

      cancelEdit();
      await fetchCategories();
    } catch (err) {
      const data = err?.response?.data;

      if (data?.errors?.length) setError(data.errors.join(", "));
      else setError(data?.message || "Gagal simpan category");
    } finally {
      setSubmitting(false);
    }
  }

  async function onDelete(id) {
    const ok = window.confirm("Yakin mau hapus category ini?");
    if (!ok) return;

    try {
      setError("");
      await api.delete(`/categories/${id}`);
      await fetchCategories();
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal hapus category");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Categories</h1>
        <p className="text-sm text-gray-600">Kelola kategori untuk transaksi.</p>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg p-3">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* List */}
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-4 border-b">
            <div className="font-semibold text-gray-900">List Categories</div>
            <div className="text-sm text-gray-600">Edit / Delete kategori.</div>
          </div>

          <div className="p-4">
            {loading ? (
              <div className="text-sm text-gray-600">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-gray-600">Belum ada kategori.</div>
            ) : (
              <ul className="divide-y">
                {items.map((c) => (
                  <li key={c.id} className="py-3 flex items-center justify-between">
                    <div className="text-sm text-gray-900">{c.name}</div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => startEdit(c)}
                        className="text-sm font-medium text-gray-700 hover:text-gray-900"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(c.id)}
                        className="text-sm font-medium text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white border rounded-xl shadow-sm">
          <div className="p-4 border-b">
            <div className="font-semibold text-gray-900">
              {editingId ? "Edit Category" : "Add Category"}
            </div>
            <div className="text-sm text-gray-600">Contoh: Food, Transport, Bills</div>
          </div>

          <form onSubmit={onSubmit} className="p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Misal: Food"
                className="mt-1 w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={submitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white px-4 py-2 rounded-lg text-sm font-medium"
              >
                {submitting ? "Saving..." : "Save"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border hover:bg-gray-50 px-4 py-2 rounded-lg text-sm font-medium text-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="text-xs text-gray-500">
              * Kalau delete gagal, bisa jadi category sudah dipakai di Transactions (FK RESTRICT).
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

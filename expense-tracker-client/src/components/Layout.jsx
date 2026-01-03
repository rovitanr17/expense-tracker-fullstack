import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium ${
      isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="font-semibold text-gray-900">ExpenseTracker</div>
            <nav className="flex items-center gap-2">
              <NavLink to="/" className={linkClass} end>Dashboard</NavLink>
              <NavLink to="/transactions" className={linkClass}>Transactions</NavLink>
              <NavLink to="/categories" className={linkClass}>Categories</NavLink>
            </nav>
          </div>

          <button
            onClick={() => navigate("/transactions/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + Add
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Transactions from "./pages/Transactions.jsx";
import Categories from "./pages/Categories.jsx";
import AddTransaction from "./pages/AddTransaction.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transactions/new" element={<AddTransaction />} />
          <Route path="/categories" element={<Categories />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

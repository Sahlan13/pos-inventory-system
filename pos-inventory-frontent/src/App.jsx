import { Routes, Route } from "react-router-dom";
import Login from "./auth/Login";
import ProductsList from "./admin/ProductsList";
import SalesList from "./admin/SalesList.jsx";
import POS from "./employee/POS";
import ProtectedRoute from "./components/protectedRoute";
import RoleRoute from "./components/roleRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route
        path="/admin/products"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={["admin"]}>
              <ProductsList />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/sales"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={["admin"]}>
              <SalesList />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route
        path="/pos"
        element={
          <ProtectedRoute>
            <RoleRoute allowed={["employee"]}>
              <POS />
            </RoleRoute>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};
export default App;

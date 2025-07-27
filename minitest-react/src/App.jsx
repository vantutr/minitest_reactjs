import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";
import CategoryList from "./pages/CategoryList";
import CategoryForm from "./pages/CategoryForm";
import ProtectedRoute from "./components/ProtectedRoute";
import AppNavbar from "./components/AppNavbar";

function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <Routes>
        {/* Route công khai */}
        <Route path="/login" element={<Login />} />

        {/* Route được bảo vệ */}
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/add"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/edit/:id"
          element={
            <ProtectedRoute>
              <ProductForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/categories"
          element={
            <ProtectedRoute>
              <CategoryList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/add"
          element={
            <ProtectedRoute>
              <CategoryForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categories/edit/:id"
          element={
            <ProtectedRoute>
              <CategoryForm />
            </ProtectedRoute>
          }
        />

        {/* Route mặc định, chuyển hướng đến trang sản phẩm nếu đã đăng nhập, ngược lại về trang login */}
        <Route
          path="*"
          element={
            <Navigate
              to={localStorage.getItem("isLoggedIn") ? "/products" : "/login"}
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

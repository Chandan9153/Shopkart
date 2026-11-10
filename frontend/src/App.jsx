import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import ProductList from "./components/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import MyOrders from "./pages/MyOrders";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminUsers from "./pages/admin/AdminUsers";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={
            <ProtectedRoute><Cart /></ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute><Checkout /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute><MyOrders /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute><AdminDashboard /></AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute><AdminProducts /></AdminRoute>
          } />
          <Route path="/admin/orders" element={
            <AdminRoute><AdminOrders /></AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute><AdminUsers /></AdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

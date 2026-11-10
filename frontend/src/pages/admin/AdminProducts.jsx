import { useEffect, useState } from "react";
import {
  createProduct, deleteProduct, fetchAdminProducts, updateProduct,
} from "../../services/adminService";
import { AdminNav } from "./AdminDashboard";
import "./Admin.css";

const EMPTY_FORM = {
  name: "", description: "", price: "", category: "", imageUrl: "", stock: "",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  function loadProducts() {
    setLoading(true);
    fetchAdminProducts()
      .then(setProducts)
      .catch(() => setError("Could not load products."))
      .finally(() => setLoading(false));
  }

  useEffect(loadProducts, []);

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value });
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      description: product.description || "",
      price: product.price,
      category: product.category || "",
      imageUrl: product.imageUrl || "",
      stock: product.stock ?? 0,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    };
    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }
      cancelEdit();
      loadProducts();
    } catch {
      setError("Could not save the product. Check name, price, category and stock.");
    }
  }

  async function handleDelete(product) {
    const sure = window.confirm(
      `Delete "${product.name}"? If it is in an old order, delete will fail — set its stock to 0 instead.`
    );
    if (!sure) return;
    try {
      await deleteProduct(product.id);
      loadProducts();
    } catch {
      setError("Could not delete this product. If it appears in an order, edit it and set stock to 0 instead.");
    }
  }

  if (loading) return <p className="admin-page">Loading products...</p>;

  return (
    <main className="admin-page">
      <h1>Admin — products</h1>
      <AdminNav />

      <form onSubmit={handleSubmit} className="admin-form">
        <h2>{editingId ? "Edit product" : "Add product"}</h2>
        <input name="name" placeholder="Product name" required
          value={form.name} onChange={updateField} />
        <input name="description" placeholder="Description"
          value={form.description} onChange={updateField} />
        <input name="price" type="number" min="0.01" step="0.01"
          placeholder="Price in ₹" required
          value={form.price} onChange={updateField} />
        <input name="category" placeholder="Category" required
          value={form.category} onChange={updateField} />
        <input name="imageUrl" placeholder="Image URL (optional)"
          value={form.imageUrl} onChange={updateField} />
        <input name="stock" type="number" min="0" step="1"
          placeholder="Stock" required
          value={form.stock} onChange={updateField} />
        {error && <p role="alert" className="admin-error">{error}</p>}
        <div className="admin-form-actions">
          <button type="submit">{editingId ? "Save changes" : "Add product"}</button>
          {editingId && (
            <button type="button" onClick={cancelEdit}>Cancel edit</button>
          )}
        </div>
      </form>

      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th><th>Category</th><th>Price</th>
            <th>Stock</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₹{Number(product.price).toLocaleString("en-IN")}</td>
              <td>{product.stock}</td>
              <td>
                <button type="button" onClick={() => startEdit(product)}>Edit</button>
                <button type="button" onClick={() => handleDelete(product)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {products.length === 0 && <p>No products yet. Add the first one above.</p>}
    </main>
  );
}

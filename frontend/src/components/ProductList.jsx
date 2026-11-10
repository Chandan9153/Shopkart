import { useEffect, useState } from "react";
import { fetchProducts } from "../services/productService";
import ProductCard from "./ProductCard";
import "./ProductList.css";

const CATEGORIES = ["", "Electronics", "Fashion", "Home"];

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchProducts({ search, category })
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not load products. Is the backend running on port 8080?");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [search, category]);

  return (
    <section className="product-list-page">
      <div className="product-toolbar">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search products..."
          aria-label="Search products"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          aria-label="Filter by category"
        >
          {CATEGORIES.map((item) => (
            <option key={item || "all"} value={item}>
              {item || "All categories"}
            </option>
          ))}
        </select>
      </div>

      {loading && <p className="status-message">Loading products...</p>}

      {!loading && error && (
        <p className="status-message error-message" role="alert">{error}</p>
      )}

      {!loading && !error && products.length === 0 && (
        <p className="status-message">No products found. Try a different search.</p>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

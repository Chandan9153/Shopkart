import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { addToCart } from "../services/cartService";

export default function ProductCard({ product }) {
  const outOfStock = !product.stock || product.stock <= 0;
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  async function handleAddToCart() {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    try {
      await addToCart(product.id, 1);
      navigate("/cart");
    } catch {
      alert("Could not add to cart. Please log in again.");
    }
  }

  return (
    <article className="product-card">
      {product.imageUrl ? (
        <img src={product.imageUrl} alt={product.name} className="product-image" />
      ) : (
        <div className="product-image product-image-placeholder" aria-hidden="true">
          {product.name.charAt(0)}
        </div>
      )}
      <div className="product-body">
        <p className="product-category">{product.category || "General"}</p>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="product-price">
            ₹{Number(product.price).toLocaleString("en-IN")}
          </span>
          <span className={outOfStock ? "stock out" : "stock"}>
            {outOfStock ? "Out of stock" : `In stock: ${product.stock}`}
          </span>
        </div>
        <button type="button" onClick={handleAddToCart} disabled={outOfStock}
          style={{ marginTop: 10, padding: "9px 12px", cursor: "pointer" }}>
          {outOfStock ? "Out of stock" : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

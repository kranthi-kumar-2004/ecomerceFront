import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./css/SearchPage.css";

function SearchPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search).get("q");

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    setLoading(true);

    fetch(`http://localhost:8080/products/search?name=${query}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [query]);

  return (
    <div className="search-container">
      <h2>Search Results for "{query}"</h2>

      {loading && <p>Loading...</p>}

      {!loading && products.length === 0 && (
        <p>No products found</p>
      )}

      {!loading && products.length > 0 && (
        <div className="products-grid">
          {products.map((p) => (
            <div
              key={p.id}
              className="product-card"
              onClick={() => navigate(`/product/${p.id}`)}
            >
              <div className="image-box">
                <img src={p.image} alt={p.name} />
              </div>

              <div className="product-info">
                <p className="product-name">{p.name}</p>
                <h4 className="product-price">₹{p.price}</h4>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SearchPage;

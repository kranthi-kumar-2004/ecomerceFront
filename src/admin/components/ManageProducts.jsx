import "./css/Manage.css";
import { useEffect, useState } from "react";

function ManageProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [editId, setEditId] = useState(null);
    const [menuIndex, setMenuIndex] = useState(null);

    const [form, setForm] = useState({
        name: "",
        price: "",
        image: "",
        category: "",
        stock: "",
        description: ""
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch("http://localhost:8080/products/");
            const data = await res.json();
            setProducts(data);
        } catch (err) {
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const saveProduct = async () => {
        try {
            if (editId !== null) {
                await fetch(`http://localhost:8080/products/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form)
                });
            } else {
                await fetch("http://localhost:8080/products/", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form)
                });
            }

            resetForm();
            fetchProducts();

        } catch (err) {
            console.error("Error:", err);
        }
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Are you sure to delete this product?")) return;

        try {
            await fetch(`http://localhost:8080/products/${id}`, {
                method: "DELETE"
            });
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (product) => {
        setForm(product);
        setEditId(product.id);
        setShowPopup(true);
        setMenuIndex(null);
    };

    const resetForm = () => {
        setForm({
            name: "",
            price: "",
            image: "",
            category: "",
            stock: "",
            description: ""
        });
        setEditId(null);
        setShowPopup(false);
    };

    return (
        <div className="manage-containerad">

            {loading && <p>Loading...</p>}

            <div className="product-gridad">

                <div className="product-card add-cardad"
                     onClick={() => setShowPopup(true)}>
                    <h1>+</h1>
                </div>

                {products.map((p) => (
                    <div className="product-cardad" key={p.id}>

                        <div className="menu-btnad"
                             onClick={() => setMenuIndex(menuIndex === p.id ? null : p.id)}>
                            ⋮
                        </div>

                        {menuIndex === p.id && (
                            <div className="menuad">
                                <p onClick={() => handleEdit(p)}>Edit</p>
                                <p onClick={() => deleteProduct(p.id)}>Remove</p>
                            </div>
                        )}

                        <img src={p.image} alt="" />
                        <h3>{p.name}</h3>
                        <p>₹ {p.price}</p>
                        <p>{p.category}</p>
                        <p>Stock: {p.stock}</p>

                    </div>
                ))}

            </div>

            {showPopup && (
                <div className="popupad">
                    <div className="popup-boxad">
                        <h2>{editId !== null ? "Edit Product" : "Add Product"}</h2>

                        <input name="name" placeholder="Name"
                               value={form.name} onChange={handleChange} />

                        <input name="price" placeholder="Price"
                               value={form.price} onChange={handleChange} />

                        <input name="image" placeholder="Image Link"
                               value={form.image} onChange={handleChange} />

                        <input name="category" placeholder="Category"
                               value={form.category} onChange={handleChange} />

                        <input name="stock" placeholder="Stock"
                               value={form.stock} onChange={handleChange} />

                        <textarea name="description" placeholder="Description"
                                  value={form.description} onChange={handleChange} />

                        <div className="btnsad">
                            <button onClick={saveProduct}>
                                {editId !== null ? "Update" : "Add"}
                            </button>
                            <button onClick={resetForm}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default ManageProducts;
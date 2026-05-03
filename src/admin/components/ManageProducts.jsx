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
        description: "",
        discount_percent: ""
    });

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(API+"/products/");
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

    /* ✅ FIX: convert numeric fields */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]:
                name === "price" ||
                name === "stock" ||
                name === "discount_percent"
                    ? Number(value)
                    : value
        });
    };

    const saveProduct = async () => {
        try {
            if (editId !== null) {
                await fetch(`${API}/products/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form)
                });
            } else {
                await fetch(API+"/products/", {
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
            await fetch(`${API}/products/${id}`, {
                method: "DELETE"
            });
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (product) => {
        setForm({
            name: product.name,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
            description: product.description,
            discount_percent: product.discount_percent || 0
        });
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
            description: "",
            discount_percent: ""
        });
        setEditId(null);
        setShowPopup(false);
    };

    return (
        <div className="manage-containerad">

            {loading && <p>Loading...</p>}

            <div className="product-gridad">

                {/* ADD CARD */}
                <div
                    className="product-card add-cardad"
                    onClick={() => setShowPopup(true)}
                >
                    <h1>+</h1>
                </div>

                {/* PRODUCT LIST */}
                {products.map((p) => (
                    <div className="product-cardad" key={p.id}>

                        {/* MENU */}
                        <div
                            className="menu-btnad"
                            onClick={() =>
                                setMenuIndex(menuIndex === p.id ? null : p.id)
                            }
                        >
                            ⋮
                        </div>

                        {menuIndex === p.id && (
                            <div className="menuad">
                                <p onClick={() => handleEdit(p)}>Edit</p>
                                <p onClick={() => deleteProduct(p.id)}>Remove</p>
                            </div>
                        )}

                        {/* IMAGE */}
                        <img src={p.image} alt="" />

                        {/* NAME */}
                        <h3>{p.name}</h3>

                        {/* PRICE + DISCOUNT */}
                        <p>
                            ₹ {p.discount_price > 0 ? p.discount_price : p.price}

                            {Number(p.discount_percent) > 0 && (
                                <>
                                    <span className="old-price">
                                        ₹ {p.price}
                                    </span>
                                    <span className="discount-tag">
                                        {p.discount_percent}% OFF
                                    </span>
                                </>
                            )}
                        </p>

                        {/* CATEGORY */}
                        <p>{p.category}</p>

                        {/* STOCK */}
                        <p>Stock: {p.stock}</p>

                    </div>
                ))}
            </div>

            {/* POPUP */}
            {showPopup && (
                <div className="popupad">
                    <div className="popup-boxad">

                        <h2>
                            {editId !== null ? "Edit Product" : "Add Product"}
                        </h2>

                        <input
                            name="name"
                            placeholder="Name"
                            value={form.name}
                            onChange={handleChange}
                        />

                        <input
                            name="price"
                            placeholder="Price"
                            value={form.price}
                            onChange={handleChange}
                        />

                        <input
                            name="discount_percent"
                            placeholder="Discount (%)"
                            value={form.discount_percent}
                            onChange={handleChange}
                        />

                        <input
                            name="image"
                            placeholder="Image Link"
                            value={form.image}
                            onChange={handleChange}
                        />

                        <input
                            name="category"
                            placeholder="Category"
                            value={form.category}
                            onChange={handleChange}
                        />

                        <input
                            name="stock"
                            placeholder="Stock"
                            value={form.stock}
                            onChange={handleChange}
                        />

                        <textarea
                            name="description"
                            placeholder="Description"
                            value={form.description}
                            onChange={handleChange}
                        />

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
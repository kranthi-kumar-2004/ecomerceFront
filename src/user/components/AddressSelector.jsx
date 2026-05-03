import { useEffect, useState } from "react";
import "./css/AddressSelector.css";
import { useNavigate, useLocation } from "react-router-dom";
const BASE_URL =import.meta.env.VITE_API_URL;

const defaultForm = {
  id: null,
  name: "",
  phone: "",
  landmark: "",
  area: "",
  city: "",
  state: "",
  pincode: ""
};

const AddressSelector = ({ onSelect }) => {
  const [addresses, setAddresses] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(defaultForm);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // ✅ TOKEN FROM LOCAL STORAGE
  const rawToken = localStorage.getItem("token");
  const location = useLocation();
  const authHeader = rawToken?.startsWith("Bearer ")
    ? rawToken
    : `Bearer ${rawToken}`;

  // ================= LOAD =================
  useEffect(() => {
    if (!rawToken) return;

    const load = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${BASE_URL}/api/checkout/address`, {
          headers: { Authorization: authHeader }
        });

        if (!res.ok) throw new Error();

        const data = await res.json();
        setAddresses(data);

        if (data.length > 0) {
          setSelectedId(data[0].id);
          onSelect && onSelect(data[0]);
        }

      } catch (err) {
        console.error("❌ Load error:", err);
        alert("Failed to load addresses");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [rawToken]);

  // ================= SELECT =================
  const handleSelect = (addr) => {
    setSelectedId(addr.id);
    onSelect && onSelect(addr);
  };

  // ================= FORM =================
  const openAdd = () => {
    setForm(defaultForm);
    setIsOpen(true);
  };

  const openEdit = (addr, e) => {
    e.stopPropagation();
    e.preventDefault(); // 🔥 ensures no parent click

    console.log("Editing ID:", addr.id);

    setForm({ ...addr }); // clone to avoid mutation
    setIsOpen(true);
  };

  const handleChange = (e) => {
    setForm(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  // ================= VALIDATION =================
  const validate = () => {
    if (!form.name.trim()) return "Enter name";
    if (!/^[0-9]{10}$/.test(form.phone)) return "Phone must be 10 digits";
    if (!form.city.trim()) return "Enter city";
    if (!form.state.trim()) return "Enter state";
    if (!/^[0-9]{6}$/.test(form.pincode)) return "Invalid pincode";
    return null;
  };

  // ================= SAVE =================
  const handleSave = async () => {
    const err = validate();
    if (err) return alert(err);

    const payload = {
      ...(form.id && { id: form.id }), // 🔥 only send id if editing
      name: form.name.trim(),
      phone: form.phone.trim(),
      landmark: form.landmark.trim(),
      area: form.area.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      pincode: form.pincode.trim()
    };

    console.log("📦 Sending Payload:", payload);

    try {
      const res = await fetch(`${BASE_URL}/api/checkout/address`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error();

      const saved = await res.json();

      console.log("✅ Saved:", saved);

      setAddresses(prev =>
        form.id
          ? prev.map(a => (a.id === saved.id ? saved : a)) // update
          : [...prev, saved] // add
      );

      setSelectedId(saved.id);
      onSelect && onSelect(saved);

      setIsOpen(false);
      setForm(defaultForm);

    } catch (err) {
      console.error("❌ Save error:", err);
      alert("Failed to save address");
    }
  };
const handleContinue = () => {
  if (!selectedId) {
    alert("Please select an address");
    return;
  }

  const selectedAddress = addresses.find(a => a.id === selectedId);

  console.log("➡️ Selected Address:", selectedAddress);
  console.log("➡️ Previous State:", location.state);

  navigate("/checkout", {
    state: {
      address: selectedAddress,
      ...(location.state || {})   // 🔥 FIX HERE
    }
  });
};
  // ================= UI =================
  return (
    <div className="addr-container">

      <h2>Delivery Address</h2>

      {loading && <p>Loading...</p>}

      {!loading && addresses.length === 0 && (
        <p>No saved addresses</p>
      )}

      {/* ADDRESS LIST */}
      <button className="add-btn" onClick={openAdd}>
        + Add New Address
      </button>
      <div className="addr-list">
        {addresses.map(addr => (
          <div
            key={addr.id}
            className={`addr-card ${selectedId === addr.id ? "active" : ""}`}
            onClick={() => handleSelect(addr)}
          >
            <div className="addr-top">
              <b>{addr.name}</b> • {addr.phone}

              {/* 🔥 EDIT BUTTON */}
              <button
                className="edit-btn"
                onClick={(e) => openEdit(addr, e)}
              >
                Edit
              </button>
            </div>

            <div className="addr-body">
              {addr.landmark}, {addr.area}, {addr.city}
            </div>

            <div className="addr-footer">
              {addr.state} - {addr.pincode}
            </div>
          </div>
        ))}
      </div>
        <div style={{ marginTop: "15px" }}>
  <button
    className="add-btn"
    onClick={handleContinue}
    style={{ background: "#28a745" }}
  >
    Continue to Checkout →
  </button>
</div>
      {/* ADD BUTTON */}
      

      {/* MODAL */}
      {isOpen && (
        <div className="modal">
          <div className="modal-box">

            <h3>
              {form.id ? "✏️ Edit Address" : "➕ Add Address"}
            </h3>

            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
            <input name="landmark" value={form.landmark} onChange={handleChange} placeholder="Landmark" />
            <input name="area" value={form.area} onChange={handleChange} placeholder="Area" />
            <input name="city" value={form.city} onChange={handleChange} placeholder="City" />
            <input name="state" value={form.state} onChange={handleChange} placeholder="State" />
            <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="Pincode" />

            <div className="modal-actions">
              <button onClick={handleSave}>Save</button>
              <button onClick={() => setIsOpen(false)}>Cancel</button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AddressSelector;
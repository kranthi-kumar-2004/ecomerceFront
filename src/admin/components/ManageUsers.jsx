import { useEffect, useState } from "react";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  useEffect(() => {
    fetchUsers();
    fetchAddresses();
  }, []);

  // 🔥 USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await fetch(API+"/api/users");
      const data = await res.json();

      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ADDRESSES
  const fetchAddresses = async () => {
    try {
      const res = await fetch(API+"/api/admin/addresses");
      const data = await res.json();

      setAddresses(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setAddresses([]);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Users</h2>

      {loading && <p>Loading...</p>}

      {!loading && users.length === 0 && (
        <p>No users found</p>
      )}

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Address</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => {

            // 🔥 MATCH USER WITH ADDRESS
            const userAddress = addresses.find(
              (a) => a.user?.id === u.id
            );

            return (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name || "N/A"}</td>

                <td>
                  {userAddress
                    ? `${userAddress.area}, ${userAddress.city}, ${userAddress.state}`
                    : "No Address"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ManageUsers;
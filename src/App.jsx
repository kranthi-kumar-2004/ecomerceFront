import { BrowserRouter, Routes, Route } from "react-router-dom"
import './App.css'
import Home from "./user/components/Home";
import UserLayout from "./user/components/UserLayout";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/components/AdminDashboard";
import Cart from "./user/components/Cart";
import ManageProducts from "./admin/components/ManageProducts";
import ProductPage from "./user/components/ProductPage";
import Checkout from "./user/components/Checkout";
import Whishlist from "./user/components/Wishlist"
import SearchPage from "./user/components/SearchPage";
import Orders from "./user/components/Orders";
import Profile from "./user/components/Profile";
import RevenueChart from "./admin/components/RevenueChart";
import OrdersChart from "./admin/components/OrdersChart";
import ManageOrders from "./admin/components/ManageOrders";
import ManageUsers from "./admin/components/ManageUsers";
import OrderDetails from "./user/components/OrderDetails";
import AddressSelector from "./user/components/AddressSelector";

function App() {
    return (<>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UserLayout />}>
                    <Route index element={<Home />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/search/" element={<SearchPage />} />
                    <Route path="/whishlist" element={<Whishlist />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/order/:id" element={<OrderDetails />} />
                    <Route path="/Address" element={<AddressSelector/>}/>
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="/admin/manage" element={<ManageProducts />} />
                    <Route path="/admin/revenue-chart" element={<RevenueChart />} />
                    <Route path="/admin/orders-chart" element={<OrdersChart />} />
                    <Route path="/admin/manage-orders" element={<ManageOrders />} />
                    <Route path="/admin/manage-users" element={<ManageUsers />} />
                </Route>
            </Routes>
        </BrowserRouter>
    </>);
}

export default App;

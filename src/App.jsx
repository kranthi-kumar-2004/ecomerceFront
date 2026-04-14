import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Home from "./user/components/Home";
import UserLayout from "./user/components/UserLayout";
import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/components/AdminDashboard";
import Cart from "./user/components/Cart";
import ManageProducts from "./admin/components/ManageProducts";
import ProductPage from "./user/components/ProductPage";

function App(){
return (
<BrowserRouter>
    <Routes>

        {/* USER ROUTES */}
        <Route path="/" element={<UserLayout/>}>
            <Route index element={<Home/>}/>
            <Route path="cart" element={<Cart/>}/>
            <Route path="product/:id" element={<ProductPage />} />
        </Route>

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<AdminLayout/>}>
            <Route index element={<AdminDashboard/>}/>
            <Route path="manage" element={<ManageProducts/>}/>
        </Route>

    </Routes>
</BrowserRouter>
);
}

export default App;

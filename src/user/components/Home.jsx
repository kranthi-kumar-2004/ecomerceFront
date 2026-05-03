import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
import "./css/Home.css";
import Loader from "./Loader";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [bannerIndex, setBannerIndex] = useState(0);
    const API = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const banners = [
        "https://m.media-amazon.com/images/I/619geyiQI5L._SX3000_.jpg",
        "https://m.media-amazon.com/images/I/61Z5DaOEVeL._SX3000_.jpg",
        "https://m.media-amazon.com/images/I/619geyiQI5L._SX3000_.jpg",
        "https://m.media-amazon.com/images/I/61Yx5-N155L._SX3000_.jpg"
    ];

    useEffect(() => {
        fetch(API+"/products/")
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);
    const [randomProducts, setRandomProducts] = useState([]);

    useEffect(() => {
        if (products.length > 0) {
            const shuffled = [...products]
                .sort(() => Math.random() - 0.5)
                .slice(0, 10);

            setRandomProducts(shuffled);
        }
    }, [products]);

    useEffect(() => {
        const interval = setInterval(() => {
            setBannerIndex(prev => (prev + 1) % banners.length);
        }, 3000);

        return () => clearInterval(interval);
    }, []);

    const categoryMap = {};
    products.forEach(p => {
        if (!categoryMap[p.category]) {
            categoryMap[p.category] = [];
        }
        categoryMap[p.category].push(p);
    });

    // 🔥 TOP 4 CATEGORIES
    const categories = Object.entries(categoryMap)
        .sort((a, b) => b[1].length - a[1].length)
        .slice(0, 4);

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="home">

                    {/* 🔥 BANNER */}
                    <div className="banner-slider">
                        <div
                            className="banner-track"
                            style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
                        >
                            {banners.map((img, i) => (
                                <div className="banner-slide" key={i}>
                                    <img src={img} alt="" />
                                </div>
                            ))}
                        </div>

                        <div className="dots">
                            {banners.map((_, i) => (
                                <div
                                    key={i}
                                    className={`dot ${bannerIndex === i ? "active" : ""}`}
                                    onClick={() => setBannerIndex(i)}
                                ></div>
                            ))}
                        </div>
                    </div>

                    {/* 🔥 CATEGORY SECTION */}
                    <div className="category-section">
                        {categories.map(([catName, items]) => (
                            <div className="category-box" key={catName}>

                                <h3>{catName}</h3>

                                {items.length > 1 ? (
                                    <div className="category-grid">
                                        {items.slice(0, 4).map((p) => (
                                            <img key={p.id} src={p.image} alt="" />
                                        ))}
                                    </div>
                                ) : (
                                    <img src={items[0].image} alt="" />
                                )}

                                <p onClick={() => navigate(`/category/${catName}`)}>
                                    Explore more
                                </p>

                            </div>
                        ))}
                    </div>

                    <div className="recommend">
                        <h4>Recommend Products</h4>
                        <div className="card-rec">
                            {randomProducts.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => navigate(`/product/${p.id}`)}
                                    className="card-reco"
                                >
                                    <img src={p.image} alt={p.name} />
                                    <h4>{p.name}</h4>
                                    <p>₹{p.price}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="card-lay">
                        {products.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => navigate(`/product/${p.id}`)}
                                className="card"
                            >
                                <img src={p.image} alt={p.name} />
                                <h4>{p.name}</h4>
                                <p>₹{p.price}</p>
                            </div>
                        ))}
                    </div>

                    <Footer />
                </div>
            )}
        </>
    );
}

export default Home;
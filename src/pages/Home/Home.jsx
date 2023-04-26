import Navbar from "../../components/Navbar/Navbar";
import Products from "../Products";
import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../config";
import { auth } from "../../config";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";
import { toast } from "react-toastify";
import Spinner from "../../assests/Blocks-1s-200px.svg";

const Home = ({ props }) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  function GetUid() {
    const [uid, setUid] = useState(null);
    useEffect(() => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          setUid(user.uid);
        }
      });
    }, []);
    return uid;
  }

  const uid = GetUid();

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const productsSnapshot = await getDocs(productsCollection);
      const productsData = productsSnapshot.docs.map((doc) => doc.data());
      setProducts(productsData);
    };
    fetchProducts();
  }, []);

  console.log(setProducts);
  const [cartProducts, setCartProducts] = useState([]);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        const fetchCartProducts = async () => {
          const productsCollection = collection(db, "Cart" + user.uid);
          const productsSnapshot = await getDocs(productsCollection);
          const productsData = productsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setCartProducts(productsData);
        };
        fetchCartProducts();
      } else {
        console.log("Not logged in");
      }
    });
  }, []);

  console.log(cartProducts);
  const qty = cartProducts.map((cartProduct) => {
    return cartProduct.qty;
  });
  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const totalQty = qty.reduce(reducer, 0);
  console.log(totalQty);

  const addtocart = async (product) => {
    if (uid !== null) {
      const Product = {
        ...product,
        qty: 1,
        TotalProductPrice: product.price,
      };
      const colRef = collection(db, "Cart" + uid);
      const Ref = await addDoc(colRef, Product);
      console.log("Document written with ID: ", Ref.id);
      toast.success("Add to Cart");
    } else {
      navigate("/sign-in");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <Navbar totalQty={totalQty} />

      <div class="banner">
        <img
          src="https://images.unsplash.com/photo-1618961734760-466979ce35b0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTJ8fHZhY2NpbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60"
          alt=""
          className="banner-image"
        />
        <div class="banner-overlay"></div>
        <div class="banner-content">
          <h1 class="banner-title">Verified Vaccines</h1>
          <p class="banner-description">Protect Against Disease</p>
          <Link
            class="banner-button"
            onClick={() =>
              window.scrollTo({
                top: document.querySelector(".productItems").offsetTop,
                behavior: "smooth",
              })
            }
          >
            Buy now
          </Link>
        </div>
      </div>
      <div className="productItems">
        {products.length > 0 && (
          <div className="container-fluid">
            <h1 className="product-text">
              Available Vaccines{" "}
              <input
                type="text"
                placeholder="Search for a product"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </h1>
            <div className="product-grid">
              {filteredProducts.filter((product) => product.type === "vaccine")
                .length > 0 && (
                <div className="product-type">
                  <div className="product-box">
                    <Products
                      products={filteredProducts
                        .filter((product) => product.type === "vaccine")
                        .slice(0, 9)}
                      addtocart={addtocart}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {products.length < 1 && (
          <div className="container">
            <img src={Spinner} alt="" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

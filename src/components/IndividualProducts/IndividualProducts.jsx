import React from "react";
import "./IndividualProducts.css";

const IndividualProducts = ({ individualProducts, addtocart }) => {
  const handleAddtocart = () => {
    addtocart(individualProducts);
  };
  console.log(individualProducts.resimgUrls);
  return (
    <div className="product">
      <div className="product-img">
        <img src={individualProducts.imgUrls} alt="" />
      </div>

      <div className="product-name">{individualProducts.name}</div>
      <div className="product-desc">{individualProducts.description}</div>
      <div className="product-price">Rs {individualProducts.price}</div>
      <div className="add-to-cart" onClick={handleAddtocart}>
        Add to Cart
      </div>
    </div>
  );
};

export default IndividualProducts;

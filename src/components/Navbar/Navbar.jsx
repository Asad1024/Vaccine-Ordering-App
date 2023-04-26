import React from "react";
import { Link, NavLink } from "react-router-dom";
import { auth } from "../../config";
import "./Navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import { FaUserAlt } from "react-icons/fa";

const Navbar = ({ totalQty }) => {
  const user = auth.currentUser;

  return (
    <nav class="navbar">
      <div class="navbar-items-left">
        <Link to="/">
          <img
            src="data:image/png;base64,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"
            alt=""
            class="logo"
          />
        </Link>
      </div>
      <div class="navbar-items-right">
        {user && (
          <>
            <NavLink to="/cart">
              <div className="cart-icon">
                <i class="fa fa-shopping-cart">
                  <FaShoppingCart />
                </i>
                <span class="cart-qty">{totalQty}</span>
              </div>
            </NavLink>
            <Link to="/profile">
              <FaUserAlt className="profile-icon" />
            </Link>
          </>
        )}
        {!user && (
          <>
            <Link to="/sign-in" className="sign-in-btn">
              SignIn
            </Link>
            <Link to="/sign-up" className="sign-up-btn">
              SignUp
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

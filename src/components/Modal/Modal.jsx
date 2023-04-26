import { useState, useEffect } from "react";
import React from "react";
import { db, auth } from "../../config";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import "./Modal.css";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-toastify";
import { ImCross } from "react-icons/im";

const Modal = ({ totalAmount, totalQty, handleClose }) => {
  const [cell, setCell] = useState(null);
  const [address, setAddress] = useState("");
  const [cartAmount] = useState(totalAmount);
  const [cartQty] = useState(totalQty);

  const navigate = useNavigate();

  const handleCloseModal = () => {
    handleClose();
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const userDataRef = doc(db, "user", uid);
    const userDataSnapshot = await getDoc(userDataRef);
    const userData = userDataSnapshot.exists() ? userDataSnapshot.data() : {};
    const fullName = userData.FullName || ""; // add this line to check for the FullName field
    await addDoc(collection(db, "Buyer-Personal-Info"), {
      Name: userName, // use the fullName variable instead of userData.FullName
      Email: userEmail || "", // add a check for the Email field
      CellNo: cell,
      Address: address,
      CartPrice: cartAmount,
      cartQty: cartQty,
    });
    const cartDataRef = collection(db, "Cart" + uid);
    const cartDataSnapshot = await getDocs(cartDataRef);
    for (const snap of cartDataSnapshot.docs) {
      const data = snap.data();
      data.ID = snap.id;
      await addDoc(collection(db, "Buyer-Cart" + uid), data);
      await deleteDoc(doc(cartDataRef, snap.id));
    }
    handleClose();
    navigate("/");
    toast.success("Order Successfully Placed");
  };

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserName(user.displayName);
        setUserEmail(user.email);
      } else {
        console.log("SIgned out");
      }
    });
  }, []);

  return (
    <div className="modal-bg">
      <div className="modal">
        <ImCross onClick={handleCloseModal} className="cross" />
        <div className="container">
          <form action="" onSubmit={handleSubmit}>
            <label htmlFor="">Cell No </label>
            <input
              type="text"
              placeholder="Cell number"
              onChange={(e) => setCell(e.target.value)}
              value={cell}
              required
            />
            <br />
            <label htmlFor="">Address</label>
            <input
              type="text"
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              required
            />
            <br />
            <label htmlFor="">Name</label>
            <input type="text" readOnly value={userName} />
            <br />
            <label htmlFor="">Email</label>
            <input type="text" readOnly value={userEmail} />
            <br />
            <label htmlFor="">Total Product</label>
            <input type="text" readOnly value={cartQty} />
            <br />
            <label htmlFor="">Total Amount</label>
            <input type="text" readOnly value={cartAmount} />
            <br />
            <button type="submit" className="submit">
              Order Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Modal;

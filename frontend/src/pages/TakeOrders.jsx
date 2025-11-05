import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate, useLocation } from "react-router-dom";
import MenuItems from "../components/MenuItems/MenuItems";
import { useOrders } from "../context/OrdersContext";

// Images
import PohaImg from "../assets/images/Poha.jpeg";
import BhakkerImg from "../assets/images/Bhakker.jpeg";
import ChilliPaneer from "../assets/images/Chilli-Paneer.jpeg";
import Coffee from "../assets/images/Coffee.jpeg";
import MixVeg from "../assets/images/Mix-Veg.jpeg";
import MuttonCurry from "../assets/images/Mutton-Curry.jpeg";
import PalakPaneer from "../assets/images/Palak-paneer.jpeg";
import ChickenCurry from "../assets/images/Chikken-Curry.jpeg";
import CrispyVeg from "../assets/images/Crispy-Veg.jpeg";
import Idli from "../assets/images/Idli.jpeg";
import Jhunka from "../assets/images/Jhunka.jpeg";
import PaneerButterMasala from "../assets/images/Paneer-Butter-Masala.jpeg";
import ButterRoti from "../assets/images/Roti.jpeg";
import Tea from "../assets/images/Tea.jpeg";

const TakeOrders = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, setCart, confirmOrder } = useOrders();

  const [orderData, setOrderData] = useState({
    guestName: "",
    tableNumber: "",
    items: [],
    date: "",
  });

  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = [
    "All",
    "Hot & Tea",
    "Chinese",
    "Main course VEG",
    "Main course NON VEG",
    "Snacks",
    "Paneer",
    "Roti",
  ];

  const menuItems = [
    { id: 1, name: "Tea", price: 15, img: Tea, category: "Hot & Tea" },
    { id: 2, name: "Chilli Paneer", price: 220, img: ChilliPaneer, category: "Chinese" },
    { id: 3, name: "Paneer Butter Masala", price: 250, img: PaneerButterMasala, category: "Paneer" },
    { id: 4, name: "Mix Veg", price: 150, img: MixVeg, category: "Main course VEG" },
    { id: 5, name: "Chicken Curry", price: 260, img: ChickenCurry, category: "Main course NON VEG" },
    { id: 6, name: "Poha", price: 40, img: PohaImg, category: "Snacks" },
    { id: 7, name: "Butter Roti", price: 25, img: ButterRoti, category: "Roti", style: { innerHeight: "20px" } },
    { id: 8, name: "Coffee", price: 25, img: Coffee, category: "Hot & Tea" },
    { id: 9, name: "Crispy Veg", price: 200, img: CrispyVeg, category: "Chinese" },
    { id: 10, name: "Palak Paneer", price: 230, img: PalakPaneer, category: "Paneer" },
    { id: 11, name: "Jhunka", price: 150, img: Jhunka, category: "Main course VEG" },
    { id: 12, name: "Mutton Curry", price: 300, img: MuttonCurry, category: "Main course NON VEG" },
    { id: 13, name: "Idli", price: 60, img: Idli, category: "Snacks" },
    { id: 14, name: "Bhakker", price: 40, img: BhakkerImg, category: "Roti" },
  ];

  // Prefill guest & table if coming from "Add More"
  useEffect(() => {
    if (location.state?.addMoreFor) {
      setOrderData({
        guestName: location.state.addMoreFor.guestName,
        tableNumber: location.state.addMoreFor.tableNumber,
        date: location.state.addMoreFor.date,
        items: [],
      });
    }
  }, [location.state]);

  // Handle adding items to cart
  const handleAddToCart = (selectedItems) => {
    if (!orderData.guestName || !orderData.tableNumber || !orderData.date) {
      alert("Please enter guest name and table number first.");
      return;
    }

    const tableKey = `Table-${orderData.tableNumber}`;

    const updatedTable = {
      guestName: orderData.guestName,
      tableNumber: orderData.tableNumber,
      date: orderData.date,
      items: [
        ...(cart[tableKey]?.items || []),
        ...selectedItems,
      ],
    };

    // Update context cart
    setCart({ ...cart, [tableKey]: updatedTable });

    // Confirm order for kitchen view
    confirmOrder(tableKey, updatedTable);

    // Reset inputs if not in "Add More" mode
    if (!location.state?.addMoreFor) {
      setOrderData({ guestName: "", tableNumber: "", items: [], date: "" });
    }
  };

  // Calculate overall total
  const totalAmount = Object.values(cart).reduce((sum, table) => {
    return sum + table.items.reduce((s, item) => s + (item.total || item.price * (item.quantity || 1)), 0);
  }, 0);

  return (
    <div className="container my-2" style={{ maxWidth: "1000px" }}>
      <div className="card shadow p-4 mb-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Take Orders</h2>
          <button
            className="btn btn-success"
            onClick={() => navigate("/cart", { state: { cart, totalAmount } })}
          >
            View Cart ({totalAmount} ₹)
          </button>
        </div>

        {/* Guest & Table */}
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control" style={{ width: "250px" }}
              placeholder="Guest Name"
              value={orderData.guestName}
              onChange={(e) => setOrderData({ ...orderData, guestName: e.target.value })}
            />
          </div>
          <div className="col">
            <input
              type="text"
              className="form-control" style={{ width: "250px", marginLeft: "-185px" }}
              placeholder="Table No."
              value={orderData.tableNumber}
              onChange={(e) => setOrderData({ ...orderData, tableNumber: e.target.value })}
            />
          </div>
       
          <div className="=col">
            <input
              type="date"
              className="form-control" style={{ width: "250px", marginLeft: "582px", marginTop: "-37px" }}
              value={orderData.date}
              onChange={(e) => setOrderData({ ...orderData, date: e.target.value })}
            />
          </div>
          <div className="=col">
            <input
              type="date"
              className="form-control" style={{ width: "250px", marginLeft: "582px", marginTop: "-37px" }}
              value={orderData.date}
              onChange={(e) => setOrderData({ ...orderData, date: e.target.value })}
            />
          </div>
        </div>

        {/* Category Filter */}
        {/* <div className="mb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`btn me-2 mb-2 ${selectedCategory === cat ? "btn-primary" : "btn-outline-primary"}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div> */}

        {/* Menu Items */}
        <MenuItems
          menuItems={menuItems}
          selectedCategory={selectedCategory}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
};

export default TakeOrders;

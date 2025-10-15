import React, { useEffect, useRef } from "react";
import { useOrders } from "../context/OrdersContext";
import toast from "react-hot-toast";

const Kitchen = () => {
  const { confirmedOrders } = useOrders();
  const notifiedOrders = useRef(new Set()); // Track which orders already triggered notifications

  // Play notification sound
  const playNotificationSound = () => {
    const audio = new Audio("/notification.mp3");
    audio.play();
  };

  // ✅ Filter out duplicate orders (ensure unique by ID)
  const uniqueOrders = Object.values(confirmedOrders || {}).reduce((acc, order) => {
    const orderKey = order.id || order.orderId || order._id;
    acc[orderKey] = order;
    return acc;
  }, {});

  // ✅ Toast + sound for new special notes
  useEffect(() => {
    Object.values(uniqueOrders).forEach((order) => {
      const orderKey = order.id || order.orderId || order._id;

      if (
        order.specialNotes &&
        order.specialNotes.trim() !== "" &&
        !notifiedOrders.current.has(orderKey)
      ) {
        toast(`New Note for Table ${order.tableNumber}: ${order.specialNotes}`, {
          icon: "⚡",
        });
        playNotificationSound();
        notifiedOrders.current.add(orderKey);
      }
    });
  }, [uniqueOrders]);

  // ✅ Format time for better display
  const formatTime = (time) => {
    if (!time) return "—";
    try {
      return new Date(time).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return time;
    }
  };

  return (
    <div
      className="container-fluid py-4"
      style={{ background: "#f7f7f7", minHeight: "100vh" }}
    >
      <h2 className="fw-semibold mb-4">Kitchen Orders</h2>

      {Object.keys(uniqueOrders).length === 0 ? (
        <p className="text-muted text-center mt-5">No confirmed orders yet</p>
      ) : (
        <div className="row g-4">
          {Object.entries(uniqueOrders).map(([key, order]) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={key}>
              <div className="card shadow-sm border-0 h-100">
                <div className="card-header bg-success text-white py-2 rounded-top">
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="small text-light">
                      Ordered: {formatTime(order.time)}
                    </div>
                    <span className="badge bg-light text-dark">
                      Table #{order.tableNumber || "—"}
                    </span>
                  </div>
                </div>

                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-semibold text-secondary">
                      KOT #{order.orderId || order._id || key}
                    </span>
                    {order.type === "Take Away" && (
                      <span className="badge bg-warning text-dark">
                        Take Away
                      </span>
                    )}
                  </div>

                  <ul className="list-unstyled small mb-3">
                    {order.items?.map((item, i) => (
                      <li key={i} className="d-flex justify-content-between">
                        <span>
                          {item.quantity} × {item.name}
                          {item.addons && (
                            <span className="text-muted"> (+{item.addons})</span>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {order.specialNotes && order.specialNotes.trim() !== "" && (
                    <div className="alert alert-danger py-2 mb-0">
                      <strong>Note:</strong> {order.specialNotes}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Kitchen;



// import React, { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

// const Kitchen = () => {
//   const [search, setSearch] = useState("");
//   const [activeKitchen, setActiveKitchen] = useState("Main kitchen");

//   const [orders] = useState([
//     {
//       kot: 102,
//       steward: "John Smith",
//       orderedTime: "01:30 AM",
//       table: 10,
//       kitchen: "Main kitchen",
//       items: [
//         { name: "Lobster Salad", qty: 2 },
//         { name: "Chicken Salad 🏃", qty: 2 },
//         { name: "Veg Salad 🏃", qty: 1 },
//         { name: "Cheese Pizza", qty: 1 },
//         { name: "Roti + Double Cheese", qty: 2 },
//         { name: "Chicken Biriyani", qty: 1 },
//         { name: "Chicken Pizza", qty: 1 },
//       ],
//       note: "No Onion and Garlic to be added",
//     },
//     {
//       kot: 103,
//       steward: "Anderson (Take Away)",
//       orderedTime: "01:34 AM",
//       kitchen: "Thai kitchen",
//       items: [
//         { name: "Cheese Pizza", qty: 1 },
//         { name: "Roti + Double Cheese", qty: 2 },
//         { name: "Chicken Biriyani", qty: 1 },
//         { name: "Cheese Pizza", qty: 1 },
//       ],
//     },
//     {
//       kot: 104,
//       steward: "John Smith",
//       orderedTime: "01:40 AM",
//       table: 10,
//       kitchen: "Chinese kitchen",
//       items: [
//         { name: "Lobster Salad", qty: 2 },
//         { name: "Chicken Salad", qty: 2 },
//         { name: "Veg Salad 🏃", qty: 1 },
//         { name: "Cheese Pizza", qty: 1 },
//         { name: "Roti + Double Cheese", qty: 2 },
//         { name: "Chicken Biriyani", qty: 1 },
//         { name: "Cheese Pizza", qty: 1 },
//       ],
//       tag: "NC Order",
//     },
//     {
//       kot: 105,
//       steward: "Anderson",
//       orderedTime: "01:45 AM",
//       table: 10,
//       kitchen: "Main kitchen",
//       items: [
//         { name: "Lobster Salad 🏃", qty: 2 },
//         { name: "Chicken Salad", qty: 2 },
//         { name: "Veg Salad", qty: 1 },
//       ],
//     },
//   ]);

//   // Filter orders dynamically
//   const filteredOrders = orders.filter((order) => {
//     // Filter by active kitchen tab
//     if (order.kitchen !== activeKitchen) return false;

//     // Search filter (steward, table, item name, KOT number)
//     const searchLower = search.toLowerCase();
//     return (
//       order.steward.toLowerCase().includes(searchLower) ||
//       (order.table && order.table.toString().includes(searchLower)) ||
//       order.kot.toString().includes(searchLower) ||
//       order.items.some((item) =>
//         item.name.toLowerCase().includes(searchLower)
//       )
//     );
//   });

//   return (
//     <div className="container-fluid p-0">
//       {/* Top Navbar */}
//       <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light">
//         <h5 className="mb-0 fw-bold text-dark">KOT Display</h5>
//         <input
//           type="text"
//           placeholder="Search by KOT, Steward, Item, Table..."
//           className="form-control w-25"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {/* Status Tabs */}
//       <ul className="nav nav-tabs bg-light px-3">
//         <li className="nav-item">
//           <button className="nav-link active">Current</button>
//         </li>
//         <li className="nav-item">
//           <button className="nav-link">Hold</button>
//         </li>
//         <li className="nav-item">
//           <button className="nav-link">In Preparation</button>
//         </li>
//         <li className="nav-item">
//           <button className="nav-link">Completed</button>
//         </li>
//         <li className="nav-item">
//           <button className="nav-link">Same Order</button>
//         </li>
//       </ul>

//       {/* Kitchen Tabs */}
//       <ul className="nav nav-tabs px-3 mt-2">
//         {["Main kitchen", "Thai kitchen", "Chinese kitchen"].map((kitchen) => (
//           <li className="nav-item" key={kitchen}>
//             <button
//               className={`nav-link ${activeKitchen === kitchen ? "active" : ""
//                 }`}
//               onClick={() => setActiveKitchen(kitchen)}
//             >
//               {kitchen}
//             </button>
//           </li>
//         ))}
//       </ul>

//       {/* Orders Grid */}
//       <div className="row m-3">
//         {filteredOrders.length > 0 ? (
//           filteredOrders.map((order, index) => (
//             <div className="col-md-3 mb-4" key={index}>
//               <div className="card shadow-sm h-100">
//                 <div className="card-header bg-success text-white d-flex justify-content-between">
//                   <span>KOT #{order.kot}</span>
//                   <span>{order.steward}</span>
//                 </div>
//                 <div className="card-body">
//                   <p className="mb-1">
//                     {order.table && <span>Table #{order.table}</span>}
//                   </p>
//                   <p className="text-muted">Ordered: {order.orderedTime}</p>
//                   {order.tag && (
//                     <span className="badge bg-warning text-dark mb-2">
//                       {order.tag}
//                     </span>
//                   )}

//                   <ul className="list-unstyled">
//                     {order.items.map((item, i) => (
//                       <li key={i}>
//                         {item.qty} × {item.name}
//                       </li>
//                     ))}
//                   </ul>

//                   {order.note && (
//                     <div className="alert alert-danger p-1 small">
//                       {order.note}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center mt-3">No orders found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Kitchen;
// import React, { useState } from "react";
// import { useOrders } from "../context/OrdersContext";

// const Kitchen = () => {
//   const { confirmedOrders } = useOrders();
//   const [search, setSearch] = useState("");
//   const [activeKitchen, setActiveKitchen] = useState("Main kitchen");
//   const [selectedDate, setSelectedDate] = useState(
//     new Date().toISOString().split("T")[0]
//   );

//   const ordersArray = Object.values(confirmedOrders);

//   const filteredOrders = ordersArray.filter((order) => {
//     if (order.kitchen !== activeKitchen) return false;
//     if (order.date !== selectedDate) return false;

//     const searchLower = search.toLowerCase();
//     return (
//       order.steward.toLowerCase().includes(searchLower) ||
//       (order.tableNumber && order.tableNumber.toString().includes(searchLower)) ||
//       (order.kot && order.kot.toString().includes(searchLower)) ||
//       order.items.some((item) => item.name.toLowerCase().includes(searchLower))
//     );
//   });

//   return (
//     <div className="container-fluid p-0">
//       <div className="d-flex justify-content-between align-items-center px-3 py-2 bg-light">
//         <h5 className="mb-0 fw-bold text-dark">Kitchen Orders</h5>
//         <input
//           type="text"
//           placeholder="Search by KOT, Steward, Item, Table..."
//           className="form-control w-25"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <input
//           type="date"
//           className="form-control w-25"
//           value={selectedDate}
//           onChange={(e) => setSelectedDate(e.target.value)}
//         />
//       </div>

//       <ul className="nav nav-tabs px-3 mt-2">
//         {["Main kitchen", "Thai kitchen", "Chinese kitchen"].map((kitchen) => (
//           <li className="nav-item" key={kitchen}>
//             <button
//               className={`nav-link ${activeKitchen === kitchen ? "active" : ""}`}
//               onClick={() => setActiveKitchen(kitchen)}
//             >
//               {kitchen}
//             </button>
//           </li>
//         ))}
//       </ul>

//       <div className="row m-3">
//         {filteredOrders.length > 0 ? (
//           filteredOrders.map((order, index) => (
//             <div className="col-md-3 mb-4" key={index}>
//               <div className="card shadow-sm h-100">
//                 <div className="card-header bg-success text-white d-flex justify-content-between">
//                   <span>KOT #{order.kot || "N/A"}</span>
//                   <span>{order.steward}</span>
//                 </div>
//                 <div className="card-body">
//                   <p className="mb-1">
//                     {order.tableNumber && <span>Table #{order.tableNumber}</span>} <br />
//                     <strong>Date:</strong> {order.date}
//                   </p>

//                   <ul className="list-unstyled">
//                     {order.items.map((item, i) => (
//                       <li key={i}>
//                         {item.quantity || item.qty || 1} × {item.name}
//                       </li>
//                     ))}
//                   </ul>

//                   {order.note && (
//                     <div className="alert alert-danger p-1 small">{order.note}</div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           ))
//         ) : (
//           <p className="text-center mt-3">No orders found</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Kitchen;

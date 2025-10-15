// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const Invoice = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { tableOrder } = location.state || {};

//   if (!tableOrder) {
//     return (
//       <div className="container my-4">
//         <p>No order data found.</p>
//         <button className="btn btn-primary" onClick={() => navigate("/takeorders")}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const totalAmount = tableOrder.items.reduce(
//     (sum, item) => sum + (item.total || item.price * (item.quantity || 1)),
//     0
//   );

//   return (
//     <div className="container my-4">
//       <h2>Invoice</h2>
//       <p>
//         <strong>Guest:</strong> {tableOrder.guestName} <br />
//         <strong>Table:</strong> {tableOrder.tableNumber}
//       </p>

//       <ul>
//         {tableOrder.items.map((item, idx) => (
//           <li key={idx}>
//             {item.name} x {item.quantity || 1} - ₹{item.total || item.price * (item.quantity || 1)}
//           </li>
//         ))}
//       </ul>

//       <h4>Total: {totalAmount} ₹</h4>

//       <button className="btn btn-primary mt-3" onClick={() => navigate("/takeorders")}>
//         Back to Take Orders
//       </button>
//     </div>
//   );
// };

// export default Invoice;



// import React from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// const Invoice = () => {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const { tableOrder } = location.state || {};

//   if (!tableOrder) {
//     return (
//       <div className="container my-4">
//         <p>No order data found.</p>
//         <button className="btn btn-primary" onClick={() => navigate("/takeorders")}>
//           Go Back
//         </button>
//       </div>
//     );
//   }

//   const totalAmount = tableOrder.items.reduce(
//     (sum, item) => sum + (item.total || item.price * (item.quantity || 1)),
//     0
//   );

//   return (
//     <div className="container my-4">
//       <h2>Invoice</h2>
//       <p>
//         <strong>Guest:</strong> {tableOrder.guestName} <br />
//         <strong>Table:</strong> {tableOrder.tableNumber} <br />
//         <strong>Date:</strong> {tableOrder.date}
//       </p>

//       <ul>
//         {tableOrder.items.map((item, idx) => (
//           <li key={idx}>
//             {item.name} x {item.quantity || 1} - ₹
//             {item.total || item.price * (item.quantity || 1)}
//           </li>
//         ))}
//       </ul>

//       <h4>Total: {totalAmount} ₹</h4>

//       <button className="btn btn-primary mt-3" onClick={() => navigate("/takeorders")}>
//         Back to Take Orders
//       </button>
//     </div>
//   );
// };

// export default Invoice;
import React, { useRef } from "react";
import { useLocation, useNavigate, NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";

// Predefined extras must match the Cart page
const extrasList = [
  { text: "Extra Cheese", price: 50 },
  { text: "Extra Salt", price: 10 },
  { text: "Extra Butter", price: 30 },
  { text: "Extra Onion", price: 20 },
  { text: "Extra Roti", price: 25 },
];

const Invoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const { tableOrder } = location.state || {};

  if (!tableOrder) {
    return (
      <div className="container my-4">
        <p className="text-danger">⚠️ No order data found.</p>
        <button className="btn btn-primary" onClick={() => navigate("/takeorders")}>
          Go Back
        </button>
      </div>
    );
  }

  // Total of regular items
  const itemsTotal = tableOrder.items.reduce(
    (sum, item) => sum + (item.total || item.price * (item.quantity || 1)),
    0
  );

  // Total of notes/extras
  const notes = tableOrder.notes || [];
  const notesTotal = notes.reduce((sum, note) => {
    const extra = extrasList.find((e) => e.text === note.text);
    return sum + (extra ? extra.price * note.qty : 0);
  }, 0);

  const finalTotal = itemsTotal + notesTotal;

  const handleDownload = async () => {
    const element = invoiceRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Invoice_Table${tableOrder.tableNumber}_${tableOrder.date}.pdf`);
  };

  return (
    <div
      className="container my-2 p-4 border rounded shadow bg-white position-relative ms-0"
      style={{
        overflow: "hidden",
        backgroundImage: "url('https://www.transparenttextures.com/patterns/leaf.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "200px 200px",
      }}
      ref={invoiceRef}
    >
      {/* Watermark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) rotate(-30deg)",
          fontSize: "5rem",
          color: "rgba(0,0,0,0.07)",
          fontWeight: "700",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 0,
        }}
      >
        SHIVAAM FARMS & RESORTS
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className="row mb-4">
          <div className="col-md-6">
            <h2 className="fw-bold text-success">SHIVAAM FARMS & RESORTS</h2>
            <p className="mb-0">01, AB, Green Planet , Omkar Nagar</p>
            <p className="mb-0">📞 +91 7387750307</p>
            <p className="mb-0">📧 shivaamfarms&reorts@gmail.com</p>
          </div>
          <div className="col-md-6 text-end">
            <h4 className="fw-bold">INVOICE</h4>
            <p className="mb-0">
              <strong>Invoice To:</strong> {tableOrder.guestName}
            </p>
            <p className="mb-0">
              <strong>Table:</strong> {tableOrder.tableNumber}
            </p>
            <p className="mb-0">
              <strong>Date:</strong> {tableOrder.date}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="table-responsive">
          <table className="table table-bordered table-striped">
            <thead className="table-success">
              <tr>
                <th>Description</th>
                <th className="text-center">Rate (₹)</th>
                <th className="text-center">Qty</th>
                <th className="text-end">Subtotal (₹)</th>
              </tr>
            </thead>
            <tbody>
              {/* Regular Items */}
              {tableOrder.items.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.name}</td>
                  <td className="text-center">{item.price}</td>
                  <td className="text-center">{item.quantity || 1}</td>
                  <td className="text-end">{item.total || item.price * (item.quantity || 1)}</td>
                </tr>
              ))}

              {/* Special Notes / Extras */}
              {notes.map((note, idx) => {
                const extra = extrasList.find((e) => e.text === note.text);
                if (!extra) return null;
                return (
                  <tr key={`note-${idx}`} className="table-info">
                    <td>{note.text} (Extra)</td>
                    <td className="text-center">{extra.price}</td>
                    <td className="text-center">{note.qty}</td>
                    <td className="text-end">{extra.price * note.qty}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="3" className="text-end">
                  Total Amount
                </th>
                <th className="text-end text-success">₹ {finalTotal}</th>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Info */}
        <div className="mt-4">
          <h6 className="fw-bold">Payment Method:</h6>
          <p>{tableOrder.paymentMethod || "Online Transfer / UPI"}</p>
        </div>

        {/* Terms */}
        <div className="mt-3">
          <h6 className="fw-bold">Terms & Conditions:</h6>
          <p>For security, we need 5 members’ Aadhar card & at the time of check out it will be returned.</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <h5 className="fw-bold text-success">THANK YOU!</h5>
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end gap-2 mt-3">
          <NavLink to="/invoice" className="btn btn-success" onClick={handleDownload}>
            <FaDownload className="me-2" /> Download
          </NavLink>
          <button className="btn btn-primary" onClick={() => navigate("/takeorders")}>
            Back to Take Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default Invoice;

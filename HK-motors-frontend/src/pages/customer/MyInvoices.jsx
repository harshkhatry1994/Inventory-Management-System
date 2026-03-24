import { useState, useEffect } from "react";
import API from "../../api/axios";
import InvoiceTemplate from "../../components/InvoiceTemplate";
import html2pdf from "html2pdf.js";

// 🔥 DOWNLOAD PDF
const downloadPDF = (id) => {
  const element = document.getElementById(id);

  if (!element) {
    alert("Invoice not found");
    return;
  }

  const opt = {
    margin: 0.5,
    filename: "invoice.pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(opt).from(element).save();
};

export default function InvoiceGenerator() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    bookingId: "",
    car: "",
    price: "",
    advanceAmount: "",
    remainingAmount: ""
  });

  const [createdInvoice, setCreatedInvoice] = useState(null);
  const [invoices, setInvoices] = useState([]);

  // 🔥 FETCH INVOICES
  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error("Error fetching invoices");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createInvoice = async () => {
    try {
      const res = await API.post("/invoices", form);

      setCreatedInvoice(res.data);

      alert("Invoice Generated Successfully");

      fetchInvoices();

    } catch (err) {
      alert("Failed to generate invoice");
    }
  };

  // 🔥 PRINT
  const handlePrint = (id) => {
    const element = document.getElementById(id);

    if (!element) {
      alert("Invoice not found!");
      return;
    }

    const printContent = element.innerHTML;

    const win = window.open("", "", "width=900,height=700");

    win.document.write(`
      <html>
        <head>
          <title>Invoice</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            img { max-width: 120px; height: auto; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  };

  // 🔥 PAYMENT (RAZORPAY)
 const handlePayment = async (amount) => {
  try {
    const { data } = await API.post("/payment/order", { amount });

    // 🔥 IF RAZORPAY DISABLED
    if (data.fake) {
      alert("Payment feature coming soon 🚀");
      return;
    }

    const options = {
      key: "YOUR_RAZORPAY_KEY",
      amount: data.amount,
      currency: "INR",
      name: "HK Motors",
      description: "Invoice Payment",
      order_id: data.id,

      handler: function () {
        alert("Payment Successful ✅");
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    alert("Payment failed");
  }
};

  return (
    <div className="p-10">

      {/* 🔥 ADMIN / EMPLOYEE */}
      {user?.role !== "customer" && (
        <>
          <h1 className="text-xl font-bold mb-6">Generate Invoice</h1>

          <input name="bookingId" placeholder="Booking ID" className="border p-2 block mb-2" onChange={handleChange} />
          <input name="car" placeholder="Car ID" className="border p-2 block mb-2" onChange={handleChange} />
          <input name="price" placeholder="Price" className="border p-2 block mb-2" onChange={handleChange} />
          <input name="advanceAmount" placeholder="Advance Amount" className="border p-2 block mb-2" onChange={handleChange} />
          <input name="remainingAmount" placeholder="Remaining Amount" className="border p-2 block mb-4" onChange={handleChange} />

          <button
            onClick={createInvoice}
            className="bg-orange-600 text-white p-2 rounded"
          >
            Generate Invoice
          </button>

          {createdInvoice && (
            <div className="mt-10 border p-4">
              <InvoiceTemplate invoice={createdInvoice} />
            </div>
          )}
        </>
      )}

      {/* 🔥 CUSTOMER */}
      {user?.role === "customer" && (
        <div>
          <h1 className="text-xl font-bold mb-6">My Invoices</h1>

          {invoices.length === 0 ? (
            <p>No invoices found</p>
          ) : (
            invoices.map((inv) => (
              <div key={inv._id} className="border p-4 mb-6 rounded shadow">

                <p><b>Invoice:</b> {inv.invoiceNumber}</p>
                <p><b>Car:</b> {inv.car?.modelName || "N/A"}</p>
                <p><b>Total:</b> ₹{inv.totalAmount || (inv.price + inv.price * 0.18)}</p>

                {/* PRINT */}
                <button
                  onClick={() => handlePrint(`invoice-${inv._id}`)}
                  className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
                >
                  Print Invoice
                </button>

                {/* PDF */}
                <button
                  onClick={() => downloadPDF(`invoice-${inv._id}`)}
                  className="bg-green-600 text-white px-3 py-1 mt-2 ml-2 rounded"
                >
                  Download PDF
                </button>

                {/* 💸 PAY NOW */}
                <button
                  onClick={() => handlePayment(inv.totalAmount)}
                  className="bg-purple-600 text-white px-3 py-1 mt-2 ml-2 rounded"
                >
                  Pay Now
                </button>

                {/* INVOICE TEMPLATE */}
                <div id={`invoice-${inv._id}`} className="bg-white p-4 mt-4">
                  <InvoiceTemplate invoice={inv} />
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
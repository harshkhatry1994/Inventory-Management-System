import React from "react";
import logo from "../assets/Logo.png";
import signature from "../assets/Signature.jpeg";
import QRCode from "react-qr-code";

// ✅ SAFE CURRENCY
function formatCurrency(num) {
  const value = Number(num || 0);
  return "₹" + value.toLocaleString("en-IN");
}

// ✅ WORD FORMAT
function amountInWords(num) {
  const value = Number(num || 0);
  return value.toLocaleString("en-IN");
}

export default function InvoiceTemplate({ invoice = {} }) {

  const car = invoice.car || {};
  const customer = invoice.customer || {};

  const price = Number(invoice.price || 0);
  const rto = Number(invoice.rtoCharges || 0);

  const gst = (price * 18) / 100;
  const total = price + gst + rto;

  const createdDate = invoice.createdAt
    ? new Date(invoice.createdAt).toLocaleDateString()
    : new Date().toLocaleDateString();

  const deliveryDate = invoice.deliveryDate
    ? new Date(invoice.deliveryDate).toLocaleDateString()
    : "-";

  const qrData = `
    Invoice: ${invoice.invoiceNumber}
    Customer: ${customer.name}
    Car: ${car.modelName}
    Total: ${total}
  `;

  return (
    <>
      {/* ✅ PRINT FIX */}
      <style>
        {`
          @media print {

            /* ❌ REMOVE WATERMARK IN PRINT */
            .watermark {
              display: none !important;
            }

            img {
              max-width: 120px !important;
              height: auto !important;
            }

            body {
              zoom: 0.85;
              margin: 0;
            }

            .invoice-container {
              width: 100% !important;
              padding: 20px !important;
              page-break-after: avoid;
            }
          }
        `}
      </style>

      <div className="invoice-container bg-white max-w-4xl mx-auto p-10 border rounded-lg relative">

        {/* 🔥 WATERMARK (VISIBLE ON SCREEN ONLY) */}
        <div className="watermark absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
          <img src={logo} alt="watermark" style={{ width: "300px" }} />
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 relative z-10">

          <div>
            <img
              src={logo}
              alt="logo"
              style={{
                width: "120px",
                height: "auto"
              }}
            />
            <h1 className="text-2xl font-black text-orange-600">
              HK Motors
            </h1>
          </div>

          <div className="text-right text-sm">
            <p><b>Invoice No:</b> {invoice.invoiceNumber || "N/A"}</p>
            <p><b>Date:</b> {createdDate}</p>
            <p><b>Delivery Date:</b> {deliveryDate}</p>
          </div>

        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-2 gap-6 border p-4 mb-6 relative z-10">

          <div>
            <h3 className="font-bold mb-2">Customer Details</h3>
            <p><b>Name:</b> {customer.name || "N/A"}</p>
            <p><b>Email:</b> {customer.email || "N/A"}</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Vehicle Details</h3>
            <p><b>Model:</b> {car.modelName || "N/A"}</p>
            <p><b>Variant:</b> {car.variant || "N/A"}</p>
            <p><b>Chassis No:</b> {invoice.chassisNumber || "N/A"}</p>
            <p><b>Engine No:</b> {invoice.engineNumber || "N/A"}</p>
          </div>

        </div>

        {/* BILL */}
        <table className="w-full border text-sm relative z-10">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Amount</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td className="border p-2">1</td>
              <td className="border p-2">Vehicle Price</td>
              <td className="border p-2 text-right">{formatCurrency(price)}</td>
            </tr>

            <tr>
              <td className="border p-2">2</td>
              <td className="border p-2">GST (18%)</td>
              <td className="border p-2 text-right">{formatCurrency(gst)}</td>
            </tr>

            <tr>
              <td className="border p-2">3</td>
              <td className="border p-2">RTO Charges</td>
              <td className="border p-2 text-right">{formatCurrency(rto)}</td>
            </tr>
          </tbody>
        </table>

        {/* TOTAL */}
        <div className="text-right mt-6 text-xl font-bold relative z-10">
          Total: {formatCurrency(total)}
        </div>

        <div className="text-sm mt-2 italic relative z-10">
          Amount in words: {amountInWords(total)} only
        </div>

        {/* QR */}
        <div className="mt-6 relative z-10">
          <QRCode value={qrData} size={80} />
          <p className="text-xs mt-1">Scan for invoice details</p>
        </div>

        {/* SIGNATURE */}
        <div className="flex justify-end mt-10 relative z-10">
          <div className="text-center">

            <img
              src={signature}
              alt="signature"
              style={{ width: "100px" }}
            />

            <p className="text-green-600 font-bold mt-1">
              ✔ Digitally Verified
            </p>

            <p className="font-bold">Authorized Signature</p>
            <p>HK Motors</p>

          </div>
        </div>

      </div>
    </>
  );
}
import { useState, useEffect, useRef } from "react";
import API from "../../api/axios";
import InvoiceTemplate from "./InvoiceTemplate";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useReactToPrint } from "react-to-print";

export default function InvoiceGenerator() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [cars, setCars] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [form, setForm] = useState({
    car: "",
    customer: "",
    price: 0,
    advanceAmount: 0,
    gst: 0,
    totalAmount: 0,
    remainingAmount: 0
  });

  const GST_RATE = 0.18;
  const componentRef = useRef();

  // ✅ FETCH DATA
  useEffect(() => {
    const fetchData = async () => {
      try {
        const carRes = await API.get("/cars");
        const userRes = await API.get("/users");

        setCars(carRes.data);

        const filteredCustomers = userRes.data.filter(
          u => u.role?.toLowerCase() === "customer"
        );

        setCustomers(filteredCustomers);

        // 🔥 AUTO SET CUSTOMER (IF LOGGED IN USER IS CUSTOMER)
        if (user?.role === "customer") {
          setForm(prev => ({
            ...prev,
            customer: user._id
          }));
        }

      } catch (err) {
        console.error("FETCH ERROR:", err);
      }
    };

    fetchData();
  }, []);

  // ✅ HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updated = { ...form, [name]: value };

    // AUTO PRICE
    if (name === "car") {
      const selectedCar = cars.find(c => c._id === value);
      if (selectedCar) {
        updated.price = selectedCar.price || 0;
      }
    }

    const price = Number(updated.price || 0);
    const advance = Number(updated.advanceAmount || 0);

    const gst = price * GST_RATE;
    const total = price + gst;

    updated.gst = gst;
    updated.totalAmount = total;
    updated.remainingAmount = total - advance;

    setForm(updated);
  };

  // ✅ CREATE INVOICE
  const createInvoice = async () => {
    try {
      await API.post("/invoices", form);
      alert("Invoice Created 🚀");
    } catch (err) {
      console.error(err);
      alert("Error creating invoice");
    }
  };

  // ✅ PREVIEW DATA
  const selectedCar = cars.find(c => c._id === form.car);
  const selectedCustomer = customers.find(c => c._id === form.customer);

  const previewData = {
    ...form,
    car: selectedCar,
    customer: selectedCustomer,
    invoiceNumber: "INV-" + Date.now(),
    createdAt: new Date()
  };

  // ✅ PRINT
  const handlePrint = useReactToPrint({
    content: () => componentRef.current
  });

  // ✅ PDF
  const downloadPDF = async () => {
    const input = document.getElementById("invoice");

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 190;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 10, 10, imgWidth, imgHeight);
    pdf.save("Invoice.pdf");
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* FORM */}
        <div className="space-y-3">

          {/* CAR */}
          <select name="car" className="border p-2 w-full" onChange={handleChange}>
            <option value="">Select Car</option>
            {cars.map(car => (
              <option key={car._id} value={car._id}>
                {car.modelName}
              </option>
            ))}
          </select>

          {/* 🔥 CUSTOMER (ONLY FOR ADMIN / EMPLOYEE) */}
          {user?.role !== "customer" && (
            <select name="customer" className="border p-2 w-full" onChange={handleChange}>
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}

          {/* PRICE */}
          <input value={form.price} readOnly className="border p-2 w-full" />

          {/* ADVANCE */}
          <input
            name="advanceAmount"
            placeholder="Advance Amount"
            className="border p-2 w-full"
            onChange={handleChange}
          />

          {/* REMAINING */}
          <input value={form.remainingAmount} readOnly className="border p-2 w-full" />

          <div className="text-sm">
            GST: ₹{form.gst}
            <br />
            Total: ₹{form.totalAmount}
          </div>

          {/* 🔥 CREATE BUTTON */}
          <button
            onClick={createInvoice}
            className="bg-orange-600 text-white px-4 py-2 rounded w-full"
          >
            Generate Invoice
          </button>

        </div>

        {/* PREVIEW */}
        <div>

          <div id="invoice" ref={componentRef}>
            <InvoiceTemplate invoice={previewData} />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-2 mt-4">

            <button
              onClick={handlePrint}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Print
            </button>

            <button
              onClick={downloadPDF}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Download PDF
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
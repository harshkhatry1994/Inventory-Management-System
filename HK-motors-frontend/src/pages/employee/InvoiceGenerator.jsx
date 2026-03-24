import { useState, useEffect } from "react";
import API from "../../api/axios";
import InvoiceTemplate from "../../components/InvoiceTemplate";

export default function InvoiceGenerator() {

  const [tab, setTab] = useState("create");
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState("");

  const GST_RATE = 0.18;

  const [form, setForm] = useState({
    car: "",
    customer: "",
    price: 0,
    advanceAmount: 0,
    remainingAmount: 0,
    gst: 0,
    totalAmount: 0
  });

  // 🔥 FETCH DATA
  const fetchData = async () => {
    try {
      const [invRes, custRes, carRes] = await Promise.all([
        API.get("/invoices"),
        API.get("/users"),
        API.get("/cars")
      ]);

      setInvoices(invRes.data);
      setCustomers(custRes.data.filter(u => u.role === "customer"));
      setCars(carRes.data);

    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedForm = { ...form, [name]: value };

    // AUTO PRICE FROM CAR
    if (name === "car") {
      const selectedCar = cars.find(c => c._id === value);
      if (selectedCar) {
        updatedForm.price = selectedCar.price || 0;
      }
    }

    const price = Number(updatedForm.price || 0);
    const advance = Number(updatedForm.advanceAmount || 0);

    const gst = price * GST_RATE;
    const total = price + gst;

    updatedForm.gst = gst;
    updatedForm.totalAmount = total;
    updatedForm.remainingAmount = total - advance;

    setForm(updatedForm);
  };

  // 🔥 CREATE INVOICE
  const createInvoice = async () => {
    try {
      const payload = {
        ...form,
        invoiceNumber: "INV-" + Date.now()
      };

      await API.post("/invoices", payload);

      alert("Invoice Generated 🚀");
      fetchData();
      setTab("view");

    } catch {
      alert("Error creating invoice");
    }
  };

  // 🔥 FILTER
  const filteredInvoices = invoices.filter(inv =>
    inv.invoiceNumber?.toLowerCase().includes(search.toLowerCase()) ||
    inv.customer?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // 🔥 AUTO MAP FOR PREVIEW (NO N/A)
  const selectedCar = cars.find(c => c._id === form.car);
  const selectedCustomer = customers.find(c => c._id === form.customer);

  const previewData = {
    ...form,
    car: selectedCar,
    customer: selectedCustomer,
    createdAt: new Date()
  };

  return (
    <div className="p-10">

      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab("create")}
          className={`px-4 py-2 rounded ${tab==="create" ? "bg-orange-600 text-white" : "bg-gray-200"}`}>
          Create
        </button>

        <button onClick={() => setTab("view")}
          className={`px-4 py-2 rounded ${tab==="view" ? "bg-orange-600 text-white" : "bg-gray-200"}`}>
          View
        </button>
      </div>

      {/* ================= CREATE ================= */}
      {tab === "create" && (
        <div className="grid md:grid-cols-2 gap-8">

          {/* FORM */}
          <div className="space-y-3">

            <select name="car" className="border p-2 w-full" onChange={handleChange}>
              <option value="">Select Car</option>
              {cars.map(car => (
                <option key={car._id} value={car._id}>
                  {car.modelName}
                </option>
              ))}
            </select>

            <select name="customer" className="border p-2 w-full" onChange={handleChange}>
              <option value="">Select Customer</option>
              {customers.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input name="price" value={form.price}
              className="border p-2 w-full" readOnly />

            <input name="advanceAmount" placeholder="Advance Amount"
              className="border p-2 w-full"
              onChange={handleChange}/>

            <input name="remainingAmount" value={form.remainingAmount}
              className="border p-2 w-full" readOnly />

            <div className="text-sm text-gray-600">
              <p>GST (18%): ₹{form.gst}</p>
              <p className="font-semibold">Total: ₹{form.totalAmount}</p>
            </div>

            <button onClick={createInvoice}
              className="bg-orange-600 text-white px-4 py-2 rounded w-full">
              Generate Invoice
            </button>
          </div>

          {/* LIVE PREVIEW */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Live Preview</h2>
            <InvoiceTemplate invoice={previewData} />
          </div>

        </div>
      )}

      {/* ================= VIEW ================= */}
      {tab === "view" && (
        <div>

          <input
            placeholder="Search invoice or customer..."
            className="border p-2 mb-4 w-full"
            onChange={(e) => setSearch(e.target.value)}
          />

          <table className="w-full border text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">Invoice</th>
                <th className="p-2">Customer</th>
                <th className="p-2">Car</th>
                <th className="p-2">Total</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredInvoices.map(inv => (
                <tr key={inv._id} className="border-t hover:bg-gray-50">
                  <td className="p-2">{inv.invoiceNumber}</td>
                  <td className="p-2">{inv.customer?.name}</td>
                  <td className="p-2">{inv.car?.modelName}</td>
                  <td className="p-2">₹{inv.totalAmount || inv.price}</td>

                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-white ${
                      inv.remainingAmount === 0 ? "bg-green-500" :
                      inv.advanceAmount > 0 ? "bg-yellow-500" :
                      "bg-red-500"
                    }`}>
                      {inv.remainingAmount === 0 ? "Paid" :
                       inv.advanceAmount > 0 ? "Partial" : "Pending"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

    </div>
  );
}
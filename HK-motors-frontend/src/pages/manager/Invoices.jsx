import { useEffect, useState } from "react";
import API from "../../api/axios";
import InvoiceTemplate from "../../components/InvoiceTemplate";

export default function Invoices() {

  const [invoices, setInvoices] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/invoices");
      setInvoices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const formatAmount = (amount) => {
    if (!amount) return "";

    if (amount >= 10000000) {
      const crore = amount / 10000000;
      return crore.toFixed(2).replace(/\.00$/, "") + " Cr";
    }

    if (amount >= 100000) {
      const lakh = amount / 100000;
      return lakh.toFixed(2).replace(/\.00$/, "") + " Lakhs";
    }

    return amount.toLocaleString("en-IN");
  };

  const validInvoices = invoices.filter(
    (inv) => inv.car && inv.price
  );

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold mb-6">Invoices</h1>

      <table className="w-full border rounded-lg overflow-hidden text-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-4 text-left">Invoice No</th>
            <th className="p-4 text-center">Customer</th>
            <th className="p-4 text-center">Car</th>
            <th className="p-4 text-right">Amount</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>

        <tbody>
          {validInvoices.map((inv) => (
            <tr key={inv._id} className="border-t hover:bg-gray-50">
              <td className="p-4">{inv.invoiceNumber}</td>

              <td className="text-center">
                {inv.customer?.name}
              </td>

              <td className="text-center">
                {inv.car?.modelName || inv.car?.name}
              </td>

              <td className="text-right pr-6 font-semibold">
                ₹{formatAmount(inv.price)}
              </td>

              <td className="text-right pr-6">
                <button
                  onClick={() => setSelected(inv)}
                  className="bg-blue-500 text-white px-4 py-1 rounded"
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selected && (
        <div className="mt-10">
          <InvoiceTemplate invoice={selected} />
        </div>
      )}

    </div>
  );
}
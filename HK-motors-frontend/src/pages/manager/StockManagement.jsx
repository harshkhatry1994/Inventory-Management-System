import React, { useState, useEffect } from "react";
import API from "../../api/axios";
import {
  Package,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  Car,
  Save,
  Info,
  Search,
  BarChart3
} from "lucide-react";

const StockManagement = () => {
  const [logs, setLogs] = useState([]);
  const [cars, setCars] = useState([]);
  useEffect(() => {console.log("Cars Loaded:", cars);}, [cars]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [formData, setFormData] = useState({
    carId: "",
    quantity: 1,
    reason: "",
    action: "IN"
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [logsRes, carsRes] = await Promise.all([
        API.get("/stock/history"),
        API.get("/cars")
      ]);

      setLogs(logsRes?.data || []);
      setCars(carsRes?.data || []);
    } catch (err) {
      console.error("Initialization failed:", err);
    } finally {
      setLoading(false);
    }
  };
   
  const getCarName = (log) => {
  return (
    log.itemId?.name ||
    log.itemId?.model ||
    log.itemId?.modelName ||
    "Unknown"
  );
};

  const handleStockAction = async (e) => {
    e.preventDefault();

    const endpoint = formData.action === "IN" ? "/stock/in" : "/stock/out";

    try {
      await API.post(endpoint, {
        carId: formData.carId,
        quantity: parseInt(formData.quantity),
        reason: formData.reason
      });

      setFormData({
        carId: "",
        quantity: 1,
        reason: "",
        action: "IN"
      });

      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const totalStock = cars.reduce((sum, c) => sum + (c.stock || 0), 0);
  const lowStock = cars.filter(c => (c.stock || 0) <= 2).length;

  const filteredLogs = logs.filter(log =>
  getCarName(log)
    .toLowerCase()
    .includes(search.toLowerCase())
);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-pulse font-black text-slate-400 uppercase tracking-widest text-xs">
          Loading Inventory System...
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">

      <div>
        <h2 className="text-4xl font-black text-slate-900 uppercase">
          Inventory <span className="text-orange-600">Terminal</span>
        </h2>
        <p className="text-slate-500">
          Manual stock reconciliation and asset tracking
        </p>
      </div>

      {/* DASHBOARD CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex items-center gap-3">
            <Package className="text-orange-500"/>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">
                Total Models
              </p>
              <p className="text-2xl font-black">{cars.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex items-center gap-3">
            <BarChart3 className="text-green-600"/>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">
                Total Stock
              </p>
              <p className="text-2xl font-black">{totalStock}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border">
          <div className="flex items-center gap-3">
            <Info className="text-red-500"/>
            <div>
              <p className="text-slate-400 text-xs uppercase font-bold">
                Low Stock Models
              </p>
              <p className="text-2xl font-black">{lowStock}</p>
            </div>
          </div>
        </div>

      </div>

      {/* STOCK ADJUSTMENT */}

      <div className="bg-white p-8 rounded-3xl border shadow-lg">

        <div className="flex items-center gap-2 mb-6">
          <Save className="text-orange-600"/>
          <h3 className="font-black uppercase">Rapid Adjustment</h3>
        </div>

        <form
          onSubmit={handleStockAction}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end"
        >

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Target Asset
            </label>

            <div className="relative mt-2">
              <Car
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <select
  required
  value={formData.carId}
  onChange={(e) =>
    setFormData({ ...formData, carId: e.target.value })
  }
  className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white text-black focus:ring-2 focus:ring-orange-500"
>
  <option value="">Select Model</option>

  {cars.length > 0 ? (
    cars.map((c) => (
      <option key={c._id} value={c._id}>
        {c.modelName || c.name || "Car"} 
        {" - Stock: "}{c.stock ?? 0}
        {c.stock <= 2 ? " ⚠ Low" : ""}
      </option>
    ))
  ) : (
    <option disabled>No cars available</option>
  )}
</select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Flow
            </label>

            <select
              value={formData.action}
              onChange={(e) =>
                setFormData({ ...formData, action: e.target.value })
              }
              className="w-full mt-2 py-3 bg-slate-900 text-white rounded-xl"
            >
              <option value="IN">Stock In</option>
              <option value="OUT">Stock Out</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Units
            </label>

            <input
              type="number"
              min="1"
              required
              value={formData.quantity}
              onChange={(e) =>
                setFormData({ ...formData, quantity: e.target.value })
              }
              className="w-full mt-2 py-3 px-3 border rounded-xl bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-400 uppercase">
              Operational Reason
            </label>

            <input
              type="text"
              placeholder="Damage, Transfer..."
              value={formData.reason}
              onChange={(e) =>
                setFormData({ ...formData, reason: e.target.value })
              }
              className="w-full mt-2 py-3 px-3 border rounded-xl bg-slate-50"
            />
          </div>

          <button
            type="submit"
            className="bg-slate-900 hover:bg-orange-600 text-white py-3 rounded-xl font-bold transition"
          >
            Execute Transaction
          </button>

        </form>
      </div>

      {/* SEARCH */}

      <div className="flex items-center gap-3">
        <Search size={18}/>
        <input
          type="text"
          placeholder="Search model..."
          className="border px-4 py-2 rounded-lg w-64"
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
        />
      </div>

      {/* HISTORY TABLE */}

      <div className="bg-white rounded-3xl border shadow-lg overflow-hidden">

        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex items-center gap-2">
            <History size={18}/>
            <span className="font-bold uppercase text-sm">
              Stock Ledger
            </span>
          </div>

          <span className="text-xs font-bold text-slate-400">
            Total Logs: {filteredLogs.length}
          </span>
        </div>

        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-400">
            <tr>
              <th className="p-4">Time</th>
              <th className="p-4">Model</th>
              <th className="p-4">Direction</th>
              <th className="p-4">Qty</th>
              <th className="p-4">Reason</th>
              <th className="p-4 text-right">User</th>
            </tr>
          </thead>

          <tbody>
            {filteredLogs.map((log) => (
              <tr key={log._id} className="border-t hover:bg-slate-50">

                <td className="p-4 text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </td>

                <td className="p-4 font-semibold">
                {getCarName(log)}
                </td>

                <td className="p-4">
                  <span className={`flex items-center gap-1 text-xs font-bold ${
                    log.action === "IN"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {log.action === "IN"
                      ? <ArrowDownLeft size={14} />
                      : <ArrowUpRight size={14} />}
                    {log.action}
                  </span>
                </td>

                <td className="p-4 font-bold">{log.quantity}</td>

                <td className="p-4 text-slate-500">
                  {log.reason || "Standard Update"}
                </td>

                <td className="p-4 text-right">
                  <div>
                    <div className="font-bold">
                      {log.performedBy?.name}
                    </div>
                    <div className="text-xs text-slate-400">
                      {log.performedBy?.role}
                    </div>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>

      </div>

    </div>
  );
};

export default StockManagement;
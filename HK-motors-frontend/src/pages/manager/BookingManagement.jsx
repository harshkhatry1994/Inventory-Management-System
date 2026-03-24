import { useEffect, useState } from "react";
import { CheckCircle, Clock, Truck, Search, Filter, Trash } from "lucide-react";
import API from "../../api/axios";

export default function BookingManagement() {

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/bookings");
      setBookings(data);
    } catch (err) {
      console.error("Booking fetch failed");
    } finally {
      setLoading(false);
    }
  };

  // ✅ STATUS UPDATE
  const handleStatusChange = async (id, newStatus) => {
    try {
      console.log("Sending:", id, newStatus);

      await API.put(`/bookings/${id}/status`, {
        status: newStatus.toLowerCase()
      });

      alert("Status updated");
      fetchBookings();

    } catch (error) {
      console.error("FULL ERROR:", error.response?.data || error.message);

      alert(
        error.response?.data?.message ||
        "Error updating status (check console)"
      );
    }
  };

  // ✅ DELETE
  const deleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      await API.delete(`/bookings/${id}`);
      setBookings(prev => prev.filter(b => b._id !== id));
    } catch (error) {
      alert("Failed to delete booking");
    }
  };

  // ✅ STATUS STYLE
  const getStatusStyle = (status) => {
    switch (status) {
      case "confirmed":   // ✅ fixed
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "delivered":
        return "bg-green-50 text-green-600 border-green-100";
      case "cancelled":
        return "bg-red-50 text-red-600 border-red-100";
      default:
        return "bg-orange-50 text-orange-600 border-orange-100";
    }
  };

  const filteredBookings = bookings.filter(
    (b) =>
      b.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.car?.modelName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">

        <div>
          <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
            Booking <span className="text-orange-600">Queue</span>
          </h1>

          <p className="text-slate-500 font-medium">
            Manage customer reservations and delivery states.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-orange-500 outline-none transition-all shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

        </div>

      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">

        <table className="w-full text-left">

          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <th className="p-6">Customer Details</th>
              <th className="p-6">Vehicle Choice</th>
              <th className="p-6">Current Status</th>
              <th className="p-6 text-right">Administrative Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">

            {loading ? (
              <tr>
                <td colSpan="4" className="p-20 text-center text-slate-400 font-bold uppercase animate-pulse">
                  Syncing reservations...
                </td>
              </tr>
            ) : (
              filteredBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-50/80 transition-all group">

                  {/* Customer */}
                  <td className="p-6">
                    <p className="text-sm font-black text-slate-800 uppercase tracking-tight">
                      {b.customer?.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">
                      ID: {b._id.slice(-6)}
                    </p>
                  </td>

                  {/* Car */}
                  <td className="p-6">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-700">
                        {b.car?.modelName}
                      </span>
                      <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded-full text-slate-500 font-black uppercase">
                        {b.car?.fuelType || "Petrol"}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-6">
                    <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(b.status)}`}>
                      {b.status === "pending" && <Clock size={12} />}
                      {b.status === "confirmed" && <CheckCircle size={12} />} {/* ✅ FIX */}
                      {b.status === "delivered" && <Truck size={12} />}
                      {b.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-6 text-right">
                    <div className="flex justify-end items-center gap-3">

                      <select
                        value={b.status}
                        onChange={(e) => handleStatusChange(b._id, e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Approved</option> {/* ✅ FIX */}
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => deleteBooking(b._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash size={18}/>
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}

          </tbody>

        </table>

        {!loading && filteredBookings.length === 0 && (
          <div className="p-20 text-center flex flex-col items-center gap-4">
            <Filter className="text-slate-200" size={48} />
            <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
              No matching bookings found.
            </p>
          </div>
        )}

      </div>

    </div>
  );
}
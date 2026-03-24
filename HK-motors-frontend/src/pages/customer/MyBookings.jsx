import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { IndianRupee, Calendar } from "lucide-react";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);

      const meRes = await API.get("/auth/me");
      setUser(meRes.data);

      const res = await API.get("/bookings");

      // ✅ FIXED FILTER
      const myData = res.data.filter(b => {
        return String(b.customer?._id || b.customer) === String(meRes.data._id);
      });

      setBookings(myData);

    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STEP 1: BUTTON TEST FUNCTION
  const handleConfirmBooking = async () => {
    console.log("BUTTON CLICKED");

    try {
      // ⚠️ TEMP: you MUST replace with real car ID later
      const testCarId = bookings[0]?.car?._id;

      if (!testCarId) {
        alert("No car found to test booking");
        return;
      }

      const res = await API.post("/bookings", {
        customer: user._id,
        car: testCarId,
        advanceAmount: 50000
      });

      console.log("BOOKING CREATED:", res.data);

      // 🔥 AUTO REFRESH UI
      fetchMyBookings();

    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* 🔥 TEST BUTTON */}
      <button
        onClick={handleConfirmBooking}
        className="bg-green-600 text-white px-4 py-2 rounded-xl"
      >
        Test Booking (Debug)
      </button>

      <h1 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">
        My <span className="text-orange-600">Reservations</span>
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        {bookings.map(b => (
          <div key={b._id} className="bg-white p-8 rounded-[2.5rem] shadow-xl">

            <div className="flex justify-between items-center mb-6">
              <img
                src={
                  b.car?.images?.[0]
                    ? `http://localhost:5000/uploads/${b.car.images[0]}`
                    : "https://dummyimage.com/100x100/ccc/000&text=No+Image"
                }
                alt={b.car?.modelName}
                className="w-14 h-14 object-cover rounded-xl"
              />

              <span className="px-4 py-1.5 rounded-full text-[10px] font-black uppercase bg-orange-50 text-orange-600">
                {b.status}
              </span>
            </div>

            <h2 className="text-2xl font-black text-slate-900">
              {b.car?.modelName || "Model Info Pending"}
            </h2>

            <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t">

              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <IndianRupee size={12}/> Advance Paid
                </p>
                <p className="text-sm font-bold">
                  ₹{b.advanceAmount?.toLocaleString()}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 flex items-center gap-1">
                  <Calendar size={12}/> Order Date
                </p>
                <p className="text-sm font-bold">
                  {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </div>

            </div>

          </div>
        ))}

        {bookings.length === 0 && (
          <div className="col-span-full py-20 text-center text-slate-400 font-bold">
            No active reservations found.
          </div>
        )}

      </div>
    </div>
  );
}
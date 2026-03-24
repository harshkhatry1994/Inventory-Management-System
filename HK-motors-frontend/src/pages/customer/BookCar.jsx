import React, { useEffect, useState } from "react";
import API from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import { Car, ChevronRight } from "lucide-react";

const IMAGE_BASE_URL = "http://localhost:5000/";

function formatIndianPrice(amount) {
  if (!amount) return "₹0";

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakh`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function BookCar() {
  const [cars, setCars] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/cars").then(res => setCars(res.data));
  }, []);

  const handleBooking = async (e, id) => {
    e.preventDefault();
    try {
      await API.post("/bookings", { car: id, advanceAmount: 50000 });
      navigate("/customer/my-bookings");
    } catch (err) {
      alert("Booking failed. System error.");
    }
  };

  return (
    <div className="space-y-10 text-slate-900 dark:text-white">

      <h1 className="text-4xl font-black uppercase tracking-tighter">
        Fleet <span className="text-orange-600">Reservation</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-8">

        {cars.map(car => (

          <Link key={car._id} to={`/car/${car._id}`}>

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-8 rounded-[2.5rem] shadow-xl flex flex-col justify-between group hover:-translate-y-2 hover:shadow-2xl transition-all cursor-pointer">

              <div className="h-40 w-full rounded-2xl overflow-hidden mb-6">
                <img
                  src={
                    car.images?.length
                      ? `${IMAGE_BASE_URL}${car.images[0]}`
                      : "https://via.placeholder.com/400x250?text=No+Image"
                  }
                  alt={car.modelName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex justify-between items-center mb-4">

                <div className="p-3 bg-orange-100 dark:bg-slate-700 rounded-2xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-all">
                  <Car size={22} />
                </div>

                <span className="text-[9px] font-black uppercase bg-green-50 dark:bg-slate-700 text-green-600 dark:text-green-400 px-3 py-1 rounded-full">
                  {car.stock} Units
                </span>

              </div>

              <div>
                <h2 className="text-2xl font-black">
                  {car.modelName}
                </h2>

                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                  {car.variant} • {car.fuelType}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">

                <div>
                  <p className="text-[9px] font-black text-slate-400 uppercase">
                    On-Road Estimate
                  </p>

                  <p className="text-xl font-black">
                    {formatIndianPrice(car.onRoadPrice)}
                  </p>
                </div>

                <button
                  onClick={(e) => handleBooking(e, car._id)}
                  className="bg-slate-900 text-white p-4 rounded-2xl hover:bg-orange-600 transition-all active:scale-95"
                >
                  <ChevronRight size={20} />
                </button>

              </div>

            </div>

          </Link>

        ))}

      </div>

    </div>
  );
}
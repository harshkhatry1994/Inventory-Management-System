import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { Gauge, Fuel, Users, Settings } from "lucide-react";

const IMAGE_BASE_URL = "http://localhost:5000/";

export default function CarDetails() {

  const { id } = useParams();
const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [color, setColor] = useState("default");

  const [loan, setLoan] = useState(500000);
  const [rate, setRate] = useState(9);
  const [years, setYears] = useState(5);

  // ⭐ Test Drive Popup State
  const [showModal,setShowModal] = useState(false);
  const [date,setDate] = useState("");
  const [time,setTime] = useState("");

  useEffect(() => {
    API.get(`/cars/${id}`)
      .then(res => setCar(res.data))
      .catch(err => console.log(err));
  }, [id]);

  if (!car) return <div className="p-10">Loading...</div>;

  const images = car.colorImages?.[color] || car.images;

  const nextImage = () =>
    setCurrentImage((prev) => (prev + 1) % images.length);

  const prevImage = () =>
    setCurrentImage((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );

  const emi =
    (loan * rate * Math.pow(1 + rate, years)) /
    (Math.pow(1 + rate, years) - 1);
   const handleBooking = async () => {
  try {
    console.log("BUTTON CLICKED");

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      return;
    }

    if (!car || !car._id) {
      alert("Car data missing");
      return;
    }

    const res = await API.post(
      "/bookings",
      {
        car: car._id,
        advanceAmount: 50000,
        date,
        time
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("SUCCESS:", res.data);
    alert("Booking successful 🚗");
    setShowModal(false);

  } catch (err) {
    console.error("BOOKING ERROR:", err.response?.data);
    alert(err.response?.data?.message || "Booking failed");
  }
};
  return (
    <div className="p-10 grid lg:grid-cols-3 gap-10">

      {/* LEFT SIDE */}
      <div className="lg:col-span-2 space-y-10">

        <h1 className="text-4xl font-bold">{car.modelName}</h1>

        {/* IMAGE VIEWER */}
         <div className="relative">

    <img
  src={
    images && images.length > 0
      ? `${IMAGE_BASE_URL}uploads/${images[currentImage]}`
      : "https://via.placeholder.com/400x300"
  }
  alt={car.modelName}
  onError={(e) => {
    e.target.src = "https://via.placeholder.com/400x300";
  }}
  style={{ width: "100%", height: "300px", objectFit: "cover" }}
/>

          <button
            onClick={prevImage}
            className="absolute left-3 top-1/2 bg-white px-3 py-2 rounded shadow"
          >
            ◀
          </button>

          <button
            onClick={nextImage}
            className="absolute right-3 top-1/2 bg-white px-3 py-2 rounded shadow"
          >
            ▶
          </button>

        </div>

        {/* COLOR SELECTOR */}
        <div className="flex gap-4">

          {Object.keys(car.colorImages || {}).map((c) => (
            <button
              key={c}
              onClick={() => {
                setColor(c);
                setCurrentImage(0);
              }}
              className={`px-4 py-2 rounded border ${
                color === c ? "bg-orange-600 text-white" : ""
              }`}
            >
              {c}
            </button>
          ))}

        </div>

        {/* FEATURES */}
        <div className="grid grid-cols-4 gap-6 bg-white p-6 rounded-xl shadow">

          <Feature icon={<Gauge />} label="Mileage" value={car.mileage} />
          <Feature icon={<Settings />} label="Engine" value={car.engine} />
          <Feature icon={<Fuel />} label="Fuel" value={car.fuelType} />
          <Feature icon={<Users />} label="Seats" value={car.seating} />

        </div>

        {/* SPEC TABLE */}
        <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow">

          <Spec label="Mileage" value={car.mileage} />
          <Spec label="Engine" value={car.engine} />
          <Spec label="Transmission" value={car.transmission} />
          <Spec label="Seating" value={car.seating} />
          <Spec label="Power" value={car.power} />
          <Spec label="Torque" value={car.torque} />
          <Spec label="Fuel Type" value={car.fuelType} />
          <Spec label="Variant" value={car.variant} />

        </div>

      </div>

      {/* RIGHT SIDE */}
      <div className="space-y-6 sticky top-10 h-fit">

        {/* PRICE CARD */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <h2 className="text-3xl font-bold text-orange-600">
            ₹{car.exShowroomPrice?.toLocaleString()}
          </h2>

          <p>
            {car.variant} • {car.fuelType}
          </p>

          {/* ⭐ Updated Button */}
          <button
            onClick={()=>setShowModal(true)}
            className="w-full bg-orange-600 text-white py-3 rounded-xl"
          >
            Book Test Drive
          </button>

        </div>

        {/* EMI CALCULATOR */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">

          <h3 className="text-xl font-bold">EMI Calculator</h3>

          <label>Loan Amount</label>
          <input
            type="number"
            value={loan}
            onChange={(e) => setLoan(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <label>Interest Rate (%)</label>
          <input
            type="number"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <label>Years</label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="w-full border p-2 rounded"
          />

          <div className="text-lg font-bold text-orange-600">
            EMI: ₹{Math.round(emi).toLocaleString()} / month
          </div>
          
        </div>

      </div>
      

      {/* ⭐ TEST DRIVE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">

          <div className="bg-white p-8 rounded-xl w-96 space-y-4">

            <h2 className="text-2xl font-bold">Book Test Drive</h2>

            <input
              type="date"
              value={date}
              onChange={(e)=>setDate(e.target.value)}
              className="w-full border p-2 rounded"
            />

            <input
              type="time"
              value={time}
              onChange={(e)=>setTime(e.target.value)}
              className="w-full border p-2 rounded"
            />

           <button
 onClick={handleBooking}
 className="bg-orange-600 text-white px-4 py-2 rounded-lg w-full"
>
 Confirm Booking
</button>

            <button
              className="w-full border py-2 rounded"
              onClick={()=>setShowModal(false)}
            >
              Cancel
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

const Spec = ({ label, value }) => (
  <div className="flex justify-between border-b pb-2">
    <span className="text-gray-500">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const Feature = ({ icon, label, value }) => (
  <div className="flex flex-col items-center text-center">
    <div className="text-orange-600">{icon}</div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="font-semibold">{value}</p>
  </div>
);
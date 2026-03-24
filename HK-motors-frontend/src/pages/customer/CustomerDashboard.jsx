import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { User, Mail, Phone, Clock, CheckCircle } from "lucide-react";
import InvoiceTemplate from "../../components/InvoiceTemplate";

function formatIndianPrice(amount) {
  if (!amount) return "₹0";

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function CustomerDashboard() {

  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const IMAGE_BASE_URL = "http://localhost:5000/";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      const meRes = await API.get("/auth/me");

      if (meRes.data.role !== "customer") {
        return navigate("/");
      }

      setCustomer(meRes.data);

      // BOOKINGS
      const bookingRes = await API.get("/bookings");

      const filteredBookings = bookingRes.data.filter(
        (b) => (b.customer?._id || b.customer) === meRes.data._id
      );

      setBookings(filteredBookings);

      // CARS
      const carsRes = await API.get("/cars");
      setCars(carsRes.data);

      // INVOICES
      const invoiceRes = await API.get("/invoices");
      setInvoices(invoiceRes.data);

    } catch (err) {

      console.error("Sync Error:", err);

    } finally {

      setLoading(false);

    }

  };

  if (loading)
    return (
      <div className="p-20 text-center font-black text-slate-400 uppercase tracking-widest">
        Syncing Hub...
      </div>
    );

  return (

    <div className="space-y-10 animate-in fade-in duration-500 text-slate-900">

      {/* HEADER */}

      <h1 className="text-4xl font-black uppercase">
        Customer <span className="text-orange-600">Hub</span>
      </h1>


      {/* PROFILE + STATS */}

      <div className="grid lg:grid-cols-3 gap-8">

        {/* PROFILE CARD */}

        <div className="bg-white p-8 rounded-3xl border shadow-xl">

          <h2 className="text-xs font-black text-slate-400 uppercase mb-6">
            Identity Profile
          </h2>

          <ProfileRow icon={<User size={18}/>} label="Name" value={customer?.name}/>
          <ProfileRow icon={<Mail size={18}/>} label="Email" value={customer?.email}/>
          <ProfileRow icon={<Phone size={18}/>} label="Phone" value={customer?.phone || "Not Provided"}/>

        </div>


        {/* STATS */}

        <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">

          <StatBox
            icon={<Clock className="text-orange-500"/>}
            title="Total Reservations"
            value={bookings.length}
            desc="Active and past bookings"
          />

          <StatBox
            icon={<CheckCircle className="text-green-500"/>}
            title="Fleet Deliveries"
            value={bookings.filter((b) => b.status === "delivered").length}
            desc="Successfully delivered vehicles"
          />

        </div>

      </div>


      {/* FLEET GALLERY */}

      <div>

        <h2 className="text-2xl font-black mb-6">
          Fleet <span className="text-orange-600">Gallery</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {cars.map((car) => (

            <div
              key={car._id}
              onClick={() => navigate(`/car/${car._id}`)}
              className="cursor-pointer bg-white border rounded-2xl shadow-lg overflow-hidden hover:-translate-y-1 transition"
            >

              <img
                src={
                  car.images?.length
                    ? `${IMAGE_BASE_URL}${car.images[0]}`
                    : "/car-placeholder.jpg"
                }
                alt={car.modelName}
                className="w-full h-48 object-cover"
              />

              <div className="p-4">

                <h3 className="text-lg font-bold">
                  {car.modelName}
                </h3>

                <p className="text-orange-600 font-black text-xl">
                  {formatIndianPrice(car.onRoadPrice)}
                </p>

              </div>

            </div>

          ))}

        </div>

      </div>


      {/* CUSTOMER INVOICES */}

      <div>

        <h2 className="text-2xl font-black mb-6">
          My <span className="text-orange-600">Invoices</span>
        </h2>

        {invoices.length === 0 ? (

          <p className="text-slate-400">
            No invoices available.
          </p>

        ) : (

          invoices.map((invoice) => (

            <div key={invoice._id} className="mb-10">

              <InvoiceTemplate invoice={invoice} />

            </div>

          ))

        )}

      </div>

    </div>

  );
}


const ProfileRow = ({ icon, label, value }) => (

  <div className="flex items-center gap-4 mb-4">

    <div className="bg-slate-100 p-3 rounded-xl text-slate-500">
      {icon}
    </div>

    <div>

      <p className="text-xs font-black text-slate-400 uppercase">
        {label}
      </p>

      <p className="text-sm font-bold">
        {value}
      </p>

    </div>

  </div>

);


const StatBox = ({ icon, title, value, desc }) => (

  <div className="bg-white p-8 rounded-3xl border shadow-xl flex justify-between items-start">

    <div>

      <h2 className="text-xs font-black text-slate-400 uppercase mb-1">
        {title}
      </h2>

      <p className="text-4xl font-black mb-2">
        {value}
      </p>

      <p className="text-xs text-slate-400">
        {desc}
      </p>

    </div>

    <div className="bg-slate-100 p-4 rounded-2xl">
      {icon}
    </div>

  </div>

);
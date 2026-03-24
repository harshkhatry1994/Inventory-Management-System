import React, { useState, useEffect } from "react";
import API from "../../api/axios";

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

const ManageCars = () => {

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // ✅ FIXED IMAGE BASE URL
  const IMAGE_BASE_URL = "http://localhost:5000/uploads/";

  const initialFormState = {
    modelName: "",
    variant: "",
    fuelType: "Petrol",
    color: "",
    exShowroomPrice: "",
    onRoadPrice: "",
    stock: 0,
    images: [],
    mileage: "",
    engine: "",
    transmission: "",
    seating: "",
    power: "",
    torque: ""
  };

  const [formData, setFormData] = useState(initialFormState);

  // ✅ PREVIEW STATE
  const [preview, setPreview] = useState([]);

  useEffect(() => {
    fetchCars();
  }, []);

  // ✅ CLEANUP MEMORY (PRO)
  useEffect(() => {
    return () => preview.forEach(url => URL.revokeObjectURL(url));
  }, [preview]);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await API.get("/cars");
      setCars(res.data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setEditingId(null);
    setPreview([]); // 🔥 reset preview
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "images") {
      const fileArray = Array.from(files);

      setFormData(prev => ({
        ...prev,
        images: fileArray
      }));

      // ✅ CREATE PREVIEW
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setPreview(previewUrls);

    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "images") {
        value.forEach(file => {
          data.append("images", file);
        });
      } else {
        data.append(key, value);
      }
    });

    try {
      if (editingId) {
        await API.put(`/cars/${editingId}`, data);
        alert("Car updated successfully!");
      } else {
        await API.post("/cars", data);
        alert("Car added to inventory!");
      }

      setIsModalOpen(false);
      resetForm();
      fetchCars();

    } catch (err) {
      alert(err.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;

    try {
      await API.delete(`/cars/${id}`);
      setCars(prev => prev.filter(car => car._id !== id));
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="p-10 text-center">Syncing Inventory...</div>;

  return (
    <div className="p-2">

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-black text-slate-800 uppercase">
          Inventory Management
        </h2>

        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2 rounded-xl"
        >
          + Add New Car
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {cars.map((car) => (

          <div key={car._id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">

           <div className="h-48 bg-slate-100 overflow-hidden">
            <img
  src={
    car.images && car.images.length > 0
      ? `${IMAGE_BASE_URL}${car.images[0]}`
      : "https://dummyimage.com/400x250/cccccc/000000&text=No+Image"
  }
  alt={car.modelName}
  className="w-full h-full object-cover"
/>
            </div>

            <div className="p-6 flex-1 flex flex-col">

              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-black uppercase">
                  {car.modelName}
                </h3>

                <span className={`text-[10px] font-bold px-2 py-1 rounded-full
                  ${car.stock > 0 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                  {car.stock > 0 ? `Stock: ${car.stock}` : "Out of Stock"}
                </span>
              </div>

              <p className="text-sm text-slate-400 mb-4">
                {car.variant} • {car.fuelType} • {car.color}
              </p>

              <div className="mt-auto flex gap-4 pt-4 border-t">

                <button
                  onClick={() => {
                    setEditingId(car._id);

                    setFormData({
                      modelName: car.modelName || "",
                      variant: car.variant || "",
                      fuelType: car.fuelType || "Petrol",
                      color: car.color || "",
                      exShowroomPrice: car.exShowroomPrice || "",
                      onRoadPrice: car.onRoadPrice || "",
                      stock: car.stock || 0,
                      images: [],
                      mileage: car.mileage || "",
                      engine: car.engine || "",
                      transmission: car.transmission || "",
                      seating: car.seating || "",
                      power: car.power || "",
                      torque: car.torque || ""
                    });

                    setPreview([]); // reset preview on edit
                    setIsModalOpen(true);
                  }}
                  className="text-blue-600 text-xs font-bold uppercase"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(car._id)}
                  className="text-red-600 text-xs font-bold uppercase"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

      {isModalOpen && (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

          <div className="bg-white p-8 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Update Vehicle" : "Add New Vehicle"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <input name="modelName" placeholder="Model Name"
                  value={formData.modelName}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg" required />

                <input name="variant" placeholder="Variant"
                  value={formData.variant}
                  onChange={handleInputChange}
                  className="border p-3 rounded-lg" required />
              </div>

              {/* IMAGE INPUT */}
              <input
                type="file"
                name="images"
                multiple
                accept="image/*"
                onChange={handleInputChange}
                className="border p-3 rounded-lg w-full"
              />

              {/* ✅ PREVIEW DISPLAY */}
              <div className="flex gap-2 flex-wrap mt-2">
                {preview.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-slate-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-orange-600 text-white py-3 rounded-xl"
                >
                  {editingId ? "Update Car" : "Save Car"}
                </button>
              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default ManageCars;
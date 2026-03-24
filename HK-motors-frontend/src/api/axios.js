import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// ✅ REQUEST INTERCEPTOR (ONLY ONE)
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token && token !== "null" && token !== "undefined") {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      console.error("API ERROR:", error.response.data);

      // 🔥 Auto logout if token invalid
      if (error.response.status === 401) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;


// ✅ API HELPERS
export const getMyInvoices = async () => {
  const res = await API.get("/invoices");
  return res.data;
};

export const getCars = async () => {
  const res = await API.get("/cars");
  return res.data;
};

export const getCustomers = async () => {
  const res = await API.get("/users");
  return res.data;
};
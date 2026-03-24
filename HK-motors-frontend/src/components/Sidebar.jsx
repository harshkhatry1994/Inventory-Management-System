import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Car, 
  ScrollText, 
  Settings, 
  LogOut, 
  Moon, 
  ChevronLeft 
} from "lucide-react";

const Sidebar = ({ role, collapsed, setCollapsed }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleDarkMode = () => {
    document.documentElement.classList.toggle("dark");
  };

  // 🔥 ROLE BASED INVOICE HANDLER
  const handleInvoices = () => {
    if (role === "customer") {
      navigate("/customer/invoices");
    } else if (role === "employee") {
      navigate("/employee/invoices");
    } else {
      navigate("/manager/invoices");
    }
  };

  // CUSTOMER MENU
  const customerMenu = [
    { name: "Dashboard", path: "/customer/dashboard", icon: <LayoutDashboard size={20}/> },
    { name: "Fleet Gallery", path: "/customer/book-car", icon: <Car size={20}/> },
    { name: "My Bookings", path: "/customer/my-bookings", icon: <ScrollText size={20}/> },
    { name: "Invoices", action: handleInvoices, icon: <ScrollText size={20}/> }, // 🔥 FIXED
    { name: "Settings", path: "/customer/settings", icon: <Settings size={20}/> }
  ];

  // MANAGER MENU
  const managerMenu = [
    { name: "Dashboard", path: "/manager/dashboard", icon: <LayoutDashboard size={20}/> },
    { name: "Stock Management", path: "/manager/stock-management", icon: <Car size={20}/> },
    { name: "Purchase Stock", path: "/manager/purchase-stock", icon: <Car size={20}/> },
    { name: "Sales History", path: "/manager/sales-history", icon: <ScrollText size={20}/> },
    { name: "Invoices", action: handleInvoices, icon: <ScrollText size={20}/> }, // 🔥 FIXED
    { name: "Reports", path: "/manager/reports", icon: <ScrollText size={20}/> },
    { name: "Settings", path: "/manager/settings", icon: <Settings size={20}/> }
  ];

  // EMPLOYEE MENU (🔥 ADDED)
  const employeeMenu = [
    { name: "Dashboard", path: "/employee/dashboard", icon: <LayoutDashboard size={20}/> },
    { name: "Sales Entry", path: "/employee/sales", icon: <ScrollText size={20}/> },
    { name: "Invoices", action: handleInvoices, icon: <ScrollText size={20}/> } // 🔥 FIXED
  ];

  let menu = [];

  if (role === "customer") menu = customerMenu;
  if (role === "manager") menu = managerMenu;
  if (role === "employee") menu = employeeMenu;

  return (
    <aside className={`${collapsed ? "w-20" : "w-72"} bg-white dark:bg-slate-900 border-r flex flex-col transition-all duration-500 h-screen sticky top-0`}>

      {/* Header */}
      <div className="p-8 flex items-center gap-3">
        <div className="bg-orange-600 p-2 rounded-xl text-white font-black text-xl">H</div>
        {!collapsed && (
          <h1 className="text-xl font-black">
            HK <span className="text-orange-600">Motors.</span>
          </h1>
        )}
      </div>

      {/* MENU */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menu.map((item, i) => (
          item.path ? (
            <NavLink
              key={i}
              to={item.path}
              className="flex items-center gap-4 px-4 py-3 rounded-xl hover:bg-gray-100"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          ) : (
            <button
              key={i}
              onClick={item.action}
              className="flex items-center gap-4 px-4 py-3 w-full text-left hover:bg-gray-100 rounded-xl"
            >
              {item.icon}
              {!collapsed && <span>{item.name}</span>}
            </button>
          )
        ))}
      </nav>

      {/* FOOTER */}
      <div className="p-6 space-y-2 border-t">

        <button onClick={toggleDarkMode} className="flex gap-3 w-full">
          <Moon size={20}/>
          {!collapsed && <span>Dark Mode</span>}
        </button>

        <button onClick={() => setCollapsed(!collapsed)} className="flex gap-3 w-full">
          <ChevronLeft size={20}/>
          {!collapsed && <span>Collapse</span>}
        </button>

        <button onClick={handleLogout} className="flex gap-3 w-full text-red-500">
          <LogOut size={20}/>
          {!collapsed && <span>Logout</span>}
        </button>

      </div>
    </aside>
  );
};

export default Sidebar;
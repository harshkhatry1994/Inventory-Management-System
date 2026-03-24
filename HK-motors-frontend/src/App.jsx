import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";

function App() {

  useEffect(() => {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } 
    else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } 
    else {
      // fallback to system theme
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      }
    }

  }, []);

  return <AppRoutes />;
}

export default App;
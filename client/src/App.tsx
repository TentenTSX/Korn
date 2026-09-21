import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

function App() {
  return (
    <>
      <ScrollRestoration />
      <Navbar />
      <Outlet />
    </>
  );
}

export default App;

import { Outlet } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";

function LayoutNav() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default LayoutNav;

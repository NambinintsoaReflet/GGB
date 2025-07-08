import "./Navbar.css";
import logo from "../../Assets/Images/logo.png";
import { NavLink } from "react-router-dom";

function Navbar() {
  return (
    <>
      <nav className="nav">
        <div className="logo">
          <img src={logo} alt="logo" />
          <h3>GGB</h3>
        </div>
        <ul>
          <NavLink to={"/"}>
            <li>Dashboard</li>
          </NavLink>
          {/* Ventes */}
          <NavLink to={"/ventes"}>
            <li>Ventes</li>
          </NavLink>
          {/* ---------- */}
          <NavLink to={"/stocks"}>
            <li>Stocks</li>
          </NavLink>
          <NavLink to={"consigne"}>
            <li>Consignés</li>
          </NavLink>
          <NavLink to={"rapport"}>
            <li>Rapport et Statiques</li>
          </NavLink>
          <NavLink to={"parametre"}>
            <li>Paramètres</li>
          </NavLink>
        </ul>
      </nav>
    </>
  );
}

export default Navbar;

import { NavLink, Outlet } from "react-router-dom";
import { FaFileInvoice } from "react-icons/fa";
import "./sousVente.css";
import { IoIosAdd } from "react-icons/io";

function SousVente() {
  return (
    <>
      <div className="sous-nav">
        <ul>
          <NavLink to="new-vente">
          
            <button className="btn-new">
                <IoIosAdd />
              <li>Nouvelle Vente</li>
            </button>
          </NavLink>
          <NavLink to="." end>
            <FaFileInvoice />
            <li>Factures</li>
          </NavLink>
          <NavLink to="devis">
            <FaFileInvoice />
            <li>Devis</li>
          </NavLink>
          <NavLink to="commande">
            <FaFileInvoice />
            <li>Commande</li>
          </NavLink>
          <NavLink to="client">
            <FaFileInvoice />
            <li>Clients</li>
          </NavLink>
        </ul>
      </div>

      <div className="sous-vente-content">
        <Outlet />
      </div>
    </>
  );
}

export default SousVente;

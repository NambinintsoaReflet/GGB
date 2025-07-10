import { NavLink, Outlet } from "react-router-dom";
import { FaFileInvoice, FaUsers } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";

function SousAchat() {
  return (
    <>
      <div className="sous-nav">
        <ul>
          <NavLink to="new-vente">
            <button className="btn-new">
              <IoIosAdd />
              <li>Nouvelle Achat</li>
            </button>
          </NavLink>
          <NavLink to=".">
            <FaFileInvoice />
            <li>Commande</li>
          </NavLink>
          <NavLink to="facture" end>
            <FaFileInvoice />
            <li>Factures</li>
          </NavLink>
          <NavLink to="reception" end>
            <FaFileInvoice />
            <li>Bon de reception</li>
          </NavLink>
          <NavLink to="fournisseurs" end>
            <FaUsers />
            <li>Fournisseurs</li>
          </NavLink>
        </ul>
      </div>

      <div className="sous-vente-content">
        <Outlet />
      </div>
    </>
  );
}

export default SousAchat;

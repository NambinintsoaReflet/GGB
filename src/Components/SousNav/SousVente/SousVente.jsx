import { NavLink, Outlet } from "react-router-dom";
import "./sousVente.css";

function SousVente() {
  return (
    <>
      <div className="sous-nav">
        <ul>
          <NavLink to="new-vente">
            <button className="btn-new">
              <li>Nouvelle Vente</li>
            </button>
          </NavLink>
          <NavLink to="." end>
            <li>Factures</li>
          </NavLink>
          <NavLink to="devis">
            <li>Devis</li>
          </NavLink>
          <NavLink to="commande">
            <li>Commande</li>
          </NavLink>
          <NavLink to="client">
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

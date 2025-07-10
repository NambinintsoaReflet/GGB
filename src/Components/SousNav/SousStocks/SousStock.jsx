import { NavLink, Outlet } from "react-router-dom";
import { FaFileInvoice } from "react-icons/fa";
import { IoIosAdd } from "react-icons/io";

function SousStock() {
  return (
    <>
      <div className="sous-nav">
        <ul>
          <NavLink to="new-boisson">
            <button className="btn-new">
                <IoIosAdd />
              <li>Ajout Article</li>
            </button>
          </NavLink>
          <NavLink to="." end>
            <FaFileInvoice />
            <li>Liste Articles</li>
          </NavLink>
        </ul>
      </div>

      <div className="sous-vente-content">
        <Outlet />
      </div>
    </>
  );
}

export default SousStock;

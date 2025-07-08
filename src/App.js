import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import SousVente from "./Components/SousNav/SousVente/SousVente.jsx";
import Layout from "./Pages/Layout/Layout.jsx";
import Clients from "./Pages/Ventes/Clients/Clients.jsx";
import Factures from "./Pages/Ventes/Factures/Factures.jsx";
import Stocks from "./Pages/Stocks/Stocks.jsx";
import Devis from "./Pages/Ventes/Devis/Devis.jsx";
import Commande from "./Pages/Ventes/Commande/Commande.jsx";
import NewVente from "./Pages/Ventes/NewVente/NewVente.jsx";

function App() {
  return (
    <>
      {/* <BrowserRouter basename="/boisson"> */}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            {/* VENTES */}
            <Route path="ventes" element={<SousVente />}>
              <Route path="" element={<Factures />} />
              <Route path="client" element={<Clients />} />
              <Route path="new-vente" element={<NewVente />} />
              <Route path="devis" element={<Devis />} />
              <Route path="commande" element={<Commande />} />
            </Route>
            <Route path="stocks" element={<Stocks />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

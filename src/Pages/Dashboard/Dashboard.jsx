import React, { useState, useEffect } from "react";
import "./Dashboard.css";
import { clients } from "../../Data/Clients";
import { articles } from "../../Data/Articles";
import { sales } from "../../Data/Sales";

function Dashboard() {
  const [kpis, setKpis] = useState({
    totalSalesToday: 0,
    profitToday: 0,
    totalClients: 0,
    pendingInvoices: 0,
    averageSaleValue: 0,
    topSellingArticles: [],
    criticalStockAlerts: [],
    dailyObjective: 500000,
    weeklyObjective: 3000000,
    monthlyObjective: 10000000,
  });

  // Formate un montant en Ariary MGA
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Renvoie la date du jour au format 'YYYY-MM-DD'
  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  useEffect(() => {
    const todayStr = getTodayDateString();
    let totalSalesToday = 0;
    let totalProfitToday = 0;
    let pendingInvoices = 0;
    let totalSalesValue = 0;
    let totalSalesCount = 0;

    const articlesSoldToday = {};

    sales.forEach((sale) => {
      const { date, etat, idVente } = sale.general;

      // Comptabilisation des ventes du jour
      if (date === todayStr) {
        totalSalesToday += sale.totals.totalTTC;
        totalSalesCount++;

        sale.articles.forEach((item) => {
          const articleInfo = articles.find((a) => a.id === item.id);
          if (!articleInfo) return;

          let costPrice = articleInfo.costPrice;
          if (item.unite === "cageots" && articleInfo.pcsParCageaut > 0) {
            costPrice *= articleInfo.pcsParCageaut;
          }

          const profit = (item.prixUnitaire - costPrice) * item.quantity;
          totalProfitToday += profit;

          const quantity =
            item.unite === "cageots"
              ? item.quantity * articleInfo.pcsParCageaut
              : item.quantity;
          articlesSoldToday[item.id] = {
            designation: item.designation,
            quantity: (articlesSoldToday[item.id]?.quantity || 0) + quantity,
          };
        });
      }

      if (etat === "non payé") {
        pendingInvoices++;
      }

      totalSalesValue += sale.totals.totalTTC;
    });

    const topSellingArticles = Object.values(articlesSoldToday)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    const criticalStockAlerts = articles.filter((a) => a.stock <= a.minStock);
    const averageSaleValue = sales.length ? totalSalesValue / sales.length : 0;

    setKpis((prev) => ({
      ...prev,
      totalSalesToday,
      profitToday: totalProfitToday,
      totalClients: clients.length,
      pendingInvoices,
      averageSaleValue,
      topSellingArticles,
      criticalStockAlerts,
    }));
  }, []);

  return (
    <div className="container container-dashboard">
      <h1 className="titre-tableau">Tableau de Bord des Ventes</h1>

      {/* Section Indicateurs Clés */}
      <div className="kpi-cards">
        {[
          {
            title: "Ventes du jour",
            value: formatCurrency(kpis.totalSalesToday),
          },
          {
            title: "Bénéfice du jour",
            value: formatCurrency(kpis.profitToday),
          },
          { title: "Total Clients", value: kpis.totalClients },
          { title: "Factures en attente", value: kpis.pendingInvoices },
          {
            title: "Vente moyenne",
            value: formatCurrency(kpis.averageSaleValue),
          },
        ].map((kpi, index) => (
          <div className="kpi-card" key={index}>
            <h3>{kpi.title}</h3>
            <p className="kpi-value">{kpi.value}</p>
          </div>
        ))}

        {/* Objectif du jour */}
        <div className="kpi-card objective-card">
          <h3>Objectif du jour</h3>
          <p className="kpi-value">
            {formatCurrency(kpis.dailyObjective)}
            <span className="progress-indicator">
              ({((kpis.totalSalesToday / kpis.dailyObjective) * 100).toFixed(1)}
              %)
            </span>
          </p>
          <div className="progress-bar-container">
            <div
              className="progress-bar"
              style={{
                width: `${Math.min(
                  100,
                  (kpis.totalSalesToday / kpis.dailyObjective) * 100
                )}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

   
      <div className="kpi-grid-only">

        {/* Section des alertes de stock critique (maintenant en tableau) */}
        <div className="kpi-card critical-stock-card full-width">
                     <h1 className="titre-tableau red">État des Stocks Critiques</h1>
          {kpis.criticalStockAlerts.length > 0 ? (
            <div className="critical-stock-table-container">
              {" "}
              {/* Nouveau conteneur pour le tableau */}
              <table>
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Stock Actuel</th>
                    <th>Seuil Critique</th>
                  </tr>
                </thead>
                <tbody>
                  {kpis.criticalStockAlerts.map((article) => (
                    <tr key={article.id}>
                      <td>
                        <span className="article-name">
                          {article.designation}
                        </span>
                       
                      </td>
                      <td>
                        <strong className="low-stock">
                          {article.stock} pcs
                        </strong>                       
                      </td>
                      <td>{article.minStock} pcs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-alert">
              Aucun article en stock critique. Tout va bien !
            </p>
          )}
        </div>

        {/* Dernières ventes */}
    
        <div className="kpi-card full-width">
              <h1 className="titre-tableau vert">Dernières Ventes</h1>
          <div className="recent-sales-table-container">
            <table>
              <thead>
                <tr>
                  <th>ID Vente</th>
                  <th>Client</th>
                  <th>Date</th>
                  <th>Montant TTC</th>
                  <th>État</th>
                </tr>
              </thead>
              <tbody>
                {sales
                  .slice()
                  .sort(
                    (a, b) =>
                      new Date(b.general.date) - new Date(a.general.date)
                  )
                  .slice(0, 5)
                  .map((sale) => (
                    <tr key={sale.general.idVente}>
                      <td>{sale.general.idVente}</td>
                      <td>{sale.client.nomCommerciale}</td>
                      <td>{sale.general.date}</td>
                      <td className="td-number">
                        {formatCurrency(sale.totals.totalTTC)}
                      </td>
                      <td>{sale.general.etat}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

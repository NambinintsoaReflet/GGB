// src/components/StockNotification/StockNotification.jsx
import React, { useState, useEffect } from 'react';
import './StockNotification.css';
import { articles } from '../../Data/Articles'; // Assurez-vous que le chemin est correct

function StockNotification() {
  const [criticalStockAlerts, setCriticalStockAlerts] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  // Fonction pour vérifier et mettre à jour les stocks critiques
  const checkCriticalStock = () => {
    const alerts = articles.filter(article => article.stock <= article.minStock);
    setCriticalStockAlerts(alerts);
    if (alerts.length > 0) {
      setIsVisible(true);
      // Masquer la notification après un certain temps (ex: 7 secondes)
      setTimeout(() => {
        setIsVisible(false);
      }, 10000);
    } else {
      setIsVisible(false);
    }
  };

  useEffect(() => {
    // Vérifier le stock dès le montage du composant
    checkCriticalStock();

    // Configurer l'intervalle pour vérifier toutes les 2 minutes (120 000 ms)
    const intervalId = setInterval(checkCriticalStock, 120000);

    // Nettoyage de l'intervalle lorsque le composant est démonté
    return () => clearInterval(intervalId);
  }, []); // Le tableau de dépendances vide assure qu'il ne s'exécute qu'une fois au montage

  if (!isVisible || criticalStockAlerts.length === 0) {
    return null; // Ne rien afficher si pas visible ou pas d'alertes
  }

  return (
    <div className="stock-notification-container">
      <h3>⚠️ Stocks Critiques !</h3>
      <p>Les articles suivants sont à des niveaux faibles :</p>
      <ul>
        {criticalStockAlerts.map(article => (
          <li key={article.id}>
            <strong>{article.designation}</strong> : {article.stock} pcs (Seuil : {article.minStock} pcs)
          </li>
        ))}
      </ul>
      <button onClick={() => setIsVisible(false)} className="close-notification-btn">Fermer</button>
    </div>
  );
}

export default StockNotification;
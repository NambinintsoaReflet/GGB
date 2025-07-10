import { MdOutlinePreview } from "react-icons/md";
import { IoPrintOutline } from "react-icons/io5";
import { FaFilePdf } from "react-icons/fa"; 

import "./Factures.css";

import { FactureVente } from "../../../Data/FactureVente";

import React, { useEffect, useState } from "react";
import { IoMdRefresh } from "react-icons/io";


function Factures() {

  // 'data' stocke les factures qui sont actuellement affichées dans le tableau (après filtrage et tri).
  const [data, setData] = useState([]);
  // 'originalData' stocke toutes les factures brutes, avant toute opération de filtrage.
  // Cela permet de réinitialiser les filtres ou d'appliquer de nouveaux filtres sur l'ensemble des données.
  const [originalData, setOriginalData] = useState([]);

  // 'selectAll' gère l'état du checkbox "tout sélectionner" dans l'en-tête du tableau.
  const [selectAll, setSelectAll] = useState(false);
  // 'selectedItems' est un objet qui garde une trace des identifiants (IDs) des factures sélectionnées.
  // La clé est l'ID de la facture, et la valeur est un booléen (true si sélectionnée, false sinon).
  const [selectedItems, setSelectedItems] = useState({});

  // États pour les critères de filtrage
  const [startDate, setStartDate] = useState(""); // Date de début pour le filtre
  const [endDate, setEndDate] = useState(""); // Date de fin pour le filtre
  const [searchTerm, setSearchTerm] = useState(""); // Terme de recherche pour le client ou l'ID
  const [statusFilter, setStatusFilter] = useState(""); // Filtre par statut de paiement

  // États pour la gestion du chargement et des erreurs (important pour les données venant d'une API)
  const [isLoading, setIsLoading] = useState(true); // Indique si les données sont en cours de chargement
  const [error, setError] = useState(null); // Stocke un message d'erreur si le chargement échoue

  // --- Effet de chargement initial des données ---
  // Ce useEffect s'exécute une seule fois après le premier rendu du composant (grâce au tableau vide []).
  useEffect(() => {
    const loadFactures = async () => {
      setIsLoading(true); // Débute le chargement
      setError(null); // Réinitialise toute erreur précédente
      try {
        // --- SIMULATION D'APPEL API ---
        // Dans une application réelle, vous feriez ici un appel API asynchrone :
        // const response = await fetch('/api/factures');
        // if (!response.ok) {
        //   throw new Error(`Erreur HTTP: ${response.status}`);
        // }
        // const apiData = await response.json();
        // setOriginalData(apiData);
        // setData(apiData);

        // Pour l'instant, nous utilisons directement votre donnée locale avec un délai simulé
        await new Promise((resolve) => setTimeout(resolve, 500)); // Simule un délai réseau
        setOriginalData(FactureVente);
        setData(FactureVente);
      } catch (err) {
        console.error("Échec du chargement des factures:", err);
        setError("Échec du chargement des factures. Veuillez réessayer.");
      } finally {
        setIsLoading(false); // Le chargement est terminé (succès ou échec)
      }
    };

    loadFactures(); // Appel de la fonction de chargement au montage du composant
  }, []); // Le tableau vide de dépendances signifie que cet effet s'exécute une seule fois au montage.

  // --- Logique de Filtrage et de Tri des données ---
  // Ce useEffect s'exécute chaque fois que l'un des états de filtre change (startDate, endDate, etc.)
  // ou lorsque 'originalData' est mis à jour.
  useEffect(() => {
    // Si les données sont en cours de chargement ou s'il y a une erreur, ne pas filtrer/trier.
    if (isLoading || error) {
      return;
    }

    let filtered = originalData; // Commence avec toutes les données brutes.

    // 1. Appliquer les filtres
    // Filtrer par date de début si une date est sélectionnée
    if (startDate) {
      filtered = filtered.filter(
        (item) => new Date(item.date) >= new Date(startDate)
      );
    }
    // Filtrer par date de fin si une date est sélectionnée
    if (endDate) {
      filtered = filtered.filter(
        (item) => new Date(item.date) <= new Date(endDate)
      );
    }
    // Filtrer par terme de recherche (recherche insensible à la casse sur le nom du client ou l'ID)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.nom_client.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.id.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }
    // Filtrer par statut si un statut spécifique est sélectionné (et n'est pas "all")
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter((item) => item.statut === statusFilter);
    }

    // 2. Appliquer le tri par date (du plus récent au plus ancien)
    // Nous créons une copie du tableau filtré avant de le trier pour éviter de modifier l'originalData.
    const sortedData = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      // Pour trier du plus récent au plus ancien (descendant), soustrayez dateA de dateB.
      return dateB.getTime() - dateA.getTime();
    });

    // Met à jour l'état 'data' avec les factures filtrées ET triées.
    setData(sortedData);
    // Réinitialise le checkbox "tout sélectionner" chaque fois que les données filtrées changent,
    // car le nombre d'éléments visibles a pu varier.
    setSelectAll(false);
  }, [
    startDate,
    endDate,
    searchTerm,
    statusFilter,
    originalData,
    isLoading,
    error,
  ]); // Ajout de isLoading et error aux dépendances

  // --- Gestion des Checkboxes ---

  /**
   * Gère la sélection/désélection de toutes les lignes du tableau.
   * @param {Object} event L'événement de changement du checkbox.
   */
  const handleSelectAll = (event) => {
    const isChecked = event.target.checked; // État du checkbox "tout sélectionner"
    setSelectAll(isChecked); // Met à jour l'état du checkbox principal.
    const newSelectedItems = {};
    // Parcourt les données ACTUELLEMENT VISIBLES ('data') et met à jour leur état de sélection.
    data.forEach((item) => {
      newSelectedItems[item.id] = isChecked;
    });
    setSelectedItems(newSelectedItems); // Met à jour l'état des éléments sélectionnés.
  };

  /**
   * Gère la sélection/désélection d'une ligne individuelle du tableau, soit via le checkbox, soit via le clic sur la ligne.
   * @param {string} id L'ID de la facture concernée.
   * @param {boolean} [forceChecked] Force l'état coché/décoché (utilisé par le checkbox), sinon toggle.
   */
  const handleSelectItem = (id, forceChecked = undefined) => {
    const isCurrentlySelected = selectedItems[id] || false;
    // Détermine le nouvel état : si forceChecked est défini, utilise-le, sinon toggle l'état actuel.
    const newCheckedState =
      forceChecked !== undefined ? forceChecked : !isCurrentlySelected;

    const newSelectedItems = {
      ...selectedItems, // Copie l'état actuel des éléments sélectionnés
      [id]: newCheckedState, // Met à jour l'état de l'élément spécifique.
    };
    setSelectedItems(newSelectedItems); // Met à jour l'état des éléments sélectionnés.

    // Vérifie si toutes les lignes visibles sont sélectionnées pour mettre à jour le checkbox "tout sélectionner".
    const allSelected = data.every((item) => newSelectedItems[item.id]);
    setSelectAll(allSelected);
  };

  /**
   * Gère la réinitialisation de tous les filtres.
   */
  const handleResetFilters = () => {
    setStartDate("");
    setEndDate("");
    setSearchTerm("");
    setStatusFilter("all"); // Définit le statut par défaut
    setSelectedItems({}); // Réinitialise les éléments sélectionnés
    setSelectAll(false); // Réinitialise le "tout sélectionner"
  };

  // --- Fonctions d'Action (Prévisualisation/Impression/Export PDF) ---

  /**
   * Fonction utilitaire pour obtenir les IDs des éléments sélectionnés.
   * @returns {string[]} Tableau des IDs des factures sélectionnées.
   */
  const getSelectedInvoiceIds = () => {
    return Object.keys(selectedItems).filter((id) => selectedItems[id]);
  };

  /**
   * Gère l'action de prévisualisation des factures sélectionnées.
   */
const handlePreview = (invoiceId = undefined) => {
    let idsToPreview;
    if (invoiceId) {
      // Si un ID est passé (par exemple, par un double-clic sur une ligne spécifique)
      idsToPreview = [invoiceId];
    } else {
      // Sinon, utilise les factures sélectionnées par les checkboxes
      idsToPreview = getSelectedInvoiceIds();
    }

    if (idsToPreview.length > 0) {
      console.log("Prévisualiser les factures :", idsToPreview);
      // Implémentez ici la logique de prévisualisation (ex: ouvrir une modale, rediriger vers une page de détail)
      alert(`Prévisualisation des factures : ${idsToPreview.join(", ")}`);
    } else {
      alert("Veuillez sélectionner au moins une facture à prévisualiser.");
    }
  };

  /**
   * Gère l'action d'impression des factures sélectionnées.
   */
  const handlePrint = () => {
    const selectedIds = getSelectedInvoiceIds();
    if (selectedIds.length > 0) {
      console.log("Imprimer les factures sélectionnées:", selectedIds);
      // Implémentez ici la logique d'impression
      alert(`Impression des factures : ${selectedIds.join(", ")}`);
    } else {
      alert("Veuillez sélectionner au moins une facture à imprimer.");
    }
  };

  /**
   * Gère l'action d'exportation des factures sélectionnées en PDF.
   */
  const handleExportPdf = () => {
    const selectedIds = getSelectedInvoiceIds();
    if (selectedIds.length > 0) {
      console.log("Exporter en PDF les factures sélectionnées:", selectedIds);
      // Implémentez ici la logique d'export PDF.
      // Cela impliquerait généralement de faire un appel API pour générer le PDF sur le backend,
      // puis de télécharger le fichier.
      alert(`Export PDF des factures : ${selectedIds.join(", ")}`);
    } else {
      alert("Veuillez sélectionner au moins une facture à exporter en PDF.");
    }
  };

  /**
   * Fonction utilitaire pour formater un montant en devise monétaire locale.
   * @param {number} amount Le montant numérique à formater.
   * @returns {string} Le montant formaté en chaîne de caractères (ex: "120 000,00 MGA").
   */
  const formatCurrency = (amount) => {
    // Vérifie si le montant est bien un nombre avant de tenter le formatage.
    if (typeof amount !== "number") return amount;
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA", // Monnaie utilisée (Ariary malgache dans cet exemple)
      minimumFractionDigits: 0, // Nombre minimum de décimales après la virgule
      maximumFractionDigits: 2, // Nombre maximum de décimales après la virgule
    }).format(amount);
  };

  // --- Rendu du composant ---
  return (
    <>
      {/* Section des filtres et actions en haut du tableau */}
      <div className="filtre">
        {/* Filtre par date de début */}
        <div className="item">
          <label htmlFor="startDate">Du</label>
          <input
            className="form-control" // Classe CSS pour le style de l'input
            type="date"
            id="startDate" // ID lié au label htmlFor
            value={startDate} // Liaison bidirectionnelle avec l'état 'startDate'
            onChange={(e) => setStartDate(e.target.value)} // Met à jour l'état quand la valeur change
          />
        </div>
        {/* Filtre par date de fin */}
        <div className="item">
          <label htmlFor="endDate">au</label>
          <input
            className="form-control"
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        {/* Champ de recherche */}
        <input
          className="search form-control"
          type="search"
          placeholder="Recherche par client ou ID..." // Texte d'aide
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          aria-label="Rechercher des factures" // Pour l'accessibilité des lecteurs d'écran
        />
        {/* Sélecteur de statut */}
        <select
          className="form-control"
          id="statusFilter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filtrer par statut"
        >
          <option value="all">Tous les statuts</option>
          <option value="Payé">Payé</option>
          <option value="Non payé">Non payé</option>
          <option value="Payé partiellement">Payé partiellement</option>
          {/* Les autres options de statut peuvent être ajoutées ici */}
        </select>

        {/* Bouton pour la prévisualisation */}
        <button
          onClick={handlePreview}
          aria-label="Prévisualiser les factures sélectionnées"
          title="Prévisualiser"
        >
          <MdOutlinePreview />
          <span>Aperçu</span> {/* Utilisation de span au lieu de label ici */}
        </button>

        {/* Bouton pour l'impression */}
        <button
          onClick={handlePrint}
          aria-label="Imprimer les factures sélectionnées"
          title="Imprimer"
        >
          <IoPrintOutline />
          <span>Imprimer</span> {/* Utilisation de span au lieu de label ici */}
        </button>

        {/* Bouton pour l'exportation PDF */}
        <button
          className="icon-button" // Assurez-vous que cette classe est définie dans Factures.css
          onClick={handleExportPdf}
          aria-label="Exporter les factures sélectionnées en PDF"
          title="Exporter en PDF"
        >
          <FaFilePdf />
          <span>Exporter PDF</span>{" "}
          {/* Utilisation de span au lieu de label ici */}
        </button>
        {/* Bouton pour réinitialiser les filtres */}
        <button onClick={handleResetFilters}>
          <IoMdRefresh />
        </button>
      </div>

      {/* Conteneur du tableau des factures */}
      <div className="container-table">
        <h3 className="titre-tableau">Liste documents factures</h3>
        <table>
          <thead>
            {/* Ligne d'en-tête du tableau */}
            <tr className="t-center">
              <th>
                {/* Checkbox "tout sélectionner" */}
                <input
                  type="checkbox"
                  onChange={handleSelectAll} // Gère la sélection/désélection de toutes les lignes
                  checked={selectAll} // État du checkbox (coché/décoché)
                  aria-label="Sélectionner toutes les factures"
                />
              </th>
              <th>ID</th>
              <th>Date</th>
              <th>Nom du client</th>
              <th>Total Net</th>
              <th>Total TVA</th>
              <th>Total TTC</th>
              <th>Net à payer</th>
              <th>Statut</th>
              <th>Mode de paiement</th>
            </tr>
          </thead>
          <tbody>
            {/* Affichage conditionnel : gestion du chargement, des erreurs et des données */}
            {isLoading ? ( // Affichage si les données sont en cours de chargement
              <tr>
                <td colSpan="10" className="t-center">
                  Chargement des factures...
                </td>
              </tr>
            ) : error ? ( // Affichage si une erreur est survenue lors du chargement
              <tr>
                <td colSpan="10" className="t-center error-message">
                  {error}
                </td>
              </tr>
            ) : data.length > 0 ? ( // Affichage si des données sont présentes
              // Parcours chaque élément du tableau 'data' pour créer une ligne de tableau
              data.map((item) => (
                <tr
                  key={item.id} // La prop 'key' est essentielle pour les listes en React, doit être unique
                  // Applique la classe 'selected-row' si l'élément est sélectionné, sinon pas de classe.
                  className={selectedItems[item.id] ? "selected-row" : ""}
                  // Au clic sur la ligne, on bascule son état de sélection.
                  // Note : on ne passe pas l'événement ici car handleSelectItem est adapté pour ça.
                  onClick={() => handleSelectItem(item.id)}
           onDoubleClick={() => handlePreview(item.id)}
                >
                  <td className="t-center">
                    {/* Checkbox pour sélectionner/désélectionner une ligne individuelle */}
                    <input
                      type="checkbox"
                      checked={selectedItems[item.id] || false} // L'état coché est basé sur 'selectedItems'
                      // Au changement du checkbox, on appelle handleSelectItem en forçant l'état.
                      onChange={(e) =>
                        handleSelectItem(item.id, e.target.checked)
                      }
                      aria-label={`Sélectionner la facture ${item.id}`} // Pour l'accessibilité
                      // Empêche le clic sur le checkbox de propager et de déclencher le onClick de la ligne parente.
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="t-center">{item.id}</td>
                  <td className="t-center">{item.date}</td>
                  <td>{item.nom_client}</td>
                  <td className="td-number">
                    {formatCurrency(item.total_net)}
                  </td>
                  <td className="td-number">
                    {formatCurrency(item.total_tva)}
                  </td>
                  <td className="td-number">
                    {formatCurrency(item.total_ttc)}
                  </td>
                  <td className="td-number">
                    {formatCurrency(item.net_a_payer)}
                  </td>
                  <td className="t-center">{item.statut}</td>
                  <td className="t-center">{item.mode_paiement}</td>
                </tr>
              ))
            ) : (
              // Affiche ce message si le tableau 'data' est vide (ex: après filtrage sans résultat et pas de chargement/erreur)
              <tr>
                <td colSpan="10" className="t-center">
                  Aucune facture trouvée.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Factures; // Exporte le composant pour qu'il puisse être utilisé ailleurs

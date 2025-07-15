import React, { useState, useEffect } from "react";
import SelectSearch from "react-select-search";
import "react-select-search/style.css";
import { articles } from "../../../Data/Articles"; // Assurez-vous que le chemin est correct
import { clients } from "../../../Data/Clients"; // Assurez-vous que le chemin est correct
import { MdDelete } from "react-icons/md";
import "./NewVente.css"; // Assurez-vous que le chemin est correct

function NewVente() {
  // Information générales States
  const [serie, setSerie] = useState("BS");
  const [numero, setNumero] = useState(1); // Auto-incrémenté
  const [idVente, setIdVente] = useState("A1"); // id = serie + numero
  const [etat, setEtat] = useState("non payé");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10)); // YYYY-MM-DD

  // Information du tiers States
  const [selectedClientCommerciale, setSelectedClientCommerciale] =
    useState(null); // Nouveau: Stocke l'objet client sélectionné par nom commercial
  const [clientName, setClientName] = useState(""); // Reste modifiable pour le nom de la personne
  const [nomCommerciale, setNomCommerciale] = useState(""); // Sera automatiquement rempli et non modifiable manuellement
  const [adresse, setAdresse] = useState(""); // Sera automatiquement remplie et non modifiable manuellement
  const [modePaiement, setModePaiement] = useState("Espèces"); // Défaut
  const [conditionPaiement, setConditionPaiement] = useState("Comptant"); // Défaut

  // Information de l'article States
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs"); // Initialisé à 'pcs' ou 'cageaut'
  const [packaging, setPackaging] = useState("AvecBout"); // État pour l'emballage sélectionné
  const [displayedPrice, setDisplayedPrice] = useState(0); // Nouveau: Prix affiché dans le champ "Prix Unitaire"

  const [cart, setCart] = useState([]);

  // Effet pour mettre à jour 'idVente' lorsque 'serie' ou 'numero' change
  useEffect(() => {
    setIdVente(`${serie}${numero}`);
  }, [serie, numero]);

  // Effet pour auto-remplir les détails du client lorsque 'selectedClientCommerciale' change
  useEffect(() => {
    if (selectedClientCommerciale) {
      setNomCommerciale(selectedClientCommerciale.nomCommerciale);
      setAdresse(selectedClientCommerciale.adresse);
      setClientName(selectedClientCommerciale.nomClient);
    } else {
      setNomCommerciale("");
      setAdresse("");
      setClientName("");
    }
  }, [selectedClientCommerciale]);

  // --- EFFECT POUR GÉRER LE CHANGEMENT DE PRIX EN FONCTION DE L'EMBALLAGE ET DE L'UNITÉ ---
  useEffect(() => {
    if (selectedArticle) {
      let priceToDetermine;

      // D'abord, déterminer le prix basé sur l'unité (pcs ou cageaut)
      if (unit === "pcs") {
        switch (packaging) {
          case "Consigner":
            priceToDetermine = selectedArticle.prixConsigner;
            break;
          case "Echanger":
            priceToDetermine = selectedArticle.prixEchanger;
            break;
          case "AvecBout":
            priceToDetermine = selectedArticle.prixAvecBout;
            break;
          default:
            priceToDetermine = 0;
        }
      } else if (unit === "cageaut") {
        switch (packaging) {
          case "Consigner":
            priceToDetermine = selectedArticle.prixConsignerCageaut;
            break;
          case "Echanger":
            priceToDetermine = selectedArticle.prixEchangerCageaut;
            break;
          case "AvecBout":
            priceToDetermine = selectedArticle.prixAvecBoutCageaut;
            break;
          default:
            priceToDetermine = 0;
        }
      } else {
        priceToDetermine = 0; // Unité non reconnue
      }
      setDisplayedPrice(priceToDetermine);
    } else {
      setDisplayedPrice(0); // Réinitialiser le prix si aucun article n'est sélectionné
    }
  }, [selectedArticle, packaging, unit]); // Dépend de l'article sélectionné, de l'emballage ET de l'unité

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fr-MG", {
      style: "currency",
      currency: "MGA",
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const articleOptions = articles.map((article) => ({
    name: article.designation,
    value: article.id,
  }));

  const clientOptions = clients.map((client) => ({
    name: client.nomCommerciale,
    value: client.id,
  }));

  const handleClientCommercialeSelect = (value) => {
    const client = clients.find((c) => c.id === value);
    if (client) {
      setSelectedClientCommerciale(client);
    } else {
      setSelectedClientCommerciale(null);
    }
  };

  const handleArticleSelect = (value) => {
    const article = articles.find((a) => a.id === value);
    if (article) {
      setSelectedArticle(article);
      // setUnit(article.unite); // L'unité sera sélectionnée par l'utilisateur
      setUnit("pcs"); // Défaut à 'pcs' quand un nouvel article est sélectionné
      setQuantity(1);
      setPackaging("AvecBout"); // Réinitialise l'emballage par défaut lors de la sélection d'un nouvel article
      // Le useEffect ci-dessus gérera la mise à jour du displayedPrice
    } else {
      setSelectedArticle(null);
      setUnit("pcs");
      setQuantity(1);
      setPackaging("AvecBout");
      setDisplayedPrice(0);
    }
  };

  const handlePackagingChange = (e) => {
    const newPackaging = e.target.value;
    setPackaging(newPackaging);
    // Le useEffect qui dépend de 'packaging', 'unit' et 'selectedArticle' se chargera de mettre à jour 'displayedPrice'
  };

  // --- NOUVELLE FONCTION POUR GÉRER LE CHANGEMENT D'UNITÉ ET METTRE À JOUR LE PRIX AFFICHÉ ---
  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
    // Le useEffect qui dépend de 'packaging', 'unit' et 'selectedArticle' se chargera de mettre à jour 'displayedPrice'
  };

  const handleAddArticleToCart = (e) => {
    e.preventDefault();

    if (!selectedArticle) {
      alert("Veuillez sélectionner un article.");
      return;
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert("La quantité doit être un nombre valide.");
      return;
    }

    // --- IMPORTANT : Utilise le prix actuel affiché (displayedPrice) pour les calculs ---
    const prixUnitairePourCalcul = displayedPrice;

    const montantHT = prixUnitairePourCalcul * parsedQuantity;
    // const montantTVA = montantHT * selectedArticle.tva; // s'il y a du TVA
    const montantTVA = 0;
    const montantTTC = montantHT + montantTVA;

    const newItem = {
      id: selectedArticle.id,
      designation: selectedArticle.designation,
      // Stocke le prix unitaire réel utilisé pour cette ligne de panier
      prixUnitaire: prixUnitairePourCalcul,
      quantity: parsedQuantity,
      unit: unit, // Enregistre l'unité choisie pour cet article dans le panier
      packaging: packaging, // Enregistre l'option d'emballage choisie pour cet article dans le panier
      montantHT,
      montantTVA,
      montantTTC,
    };

    setCart([...cart, newItem]);
    setSelectedArticle(null);
    setQuantity(1);
    setUnit("pcs"); // Réinitialise l'unité par défaut pour le prochain article
    setPackaging("AvecBout"); // Réinitialise l'emballage par défaut pour le prochain article
    setDisplayedPrice(0); // Réinitialise le prix affiché
  };

  const handleDeleteItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleValidateFacture = () => {
    if (cart.length === 0) return alert("Le panier est vide.");
    if (!selectedClientCommerciale)
      return alert("Veuillez sélectionner un client commercial.");
    if (!clientName.trim())
      return alert("Veuillez entrer le nom du client (personne).");
    if (!modePaiement.trim())
      return alert("Veuillez sélectionner le mode de paiement.");
    if (!conditionPaiement.trim())
      return alert("Veuillez sélectionner la condition de paiement.");

    const saleData = {
      general: { serie, numero, idVente, etat, date },
      client: {
        id: selectedClientCommerciale.id,
        nomClient: clientName,
        nomCommerciale: nomCommerciale,
        adresse: adresse,
        modePaiement: modePaiement,
        conditionPaiement: conditionPaiement,
      },
      articles: cart, // Le panier contient déjà le prix unitaire correct pour chaque ligne
      totals: { totalHT, totalTVA, totalTTC },
    };

    console.log("Facture validée :", saleData);
    alert("Facture validée !");
    // Réinitialiser tous les états du formulaire après une validation réussie
    setSerie("BS"); // Remettre la série par défaut
    setNumero((prev) => prev + 1);
    setEtat("non payé");
    setDate(new Date().toISOString().slice(0, 10));
    setSelectedClientCommerciale(null);
    setClientName("");
    setNomCommerciale("");
    setAdresse("");
    setModePaiement("Espèces"); // Réinitialiser au défaut
    setConditionPaiement("Comptant"); // Réinitialiser au défaut
    setCart([]);
    setSelectedArticle(null);
    setQuantity(1);
    setUnit("pcs");
    setPackaging("AvecBout");
    setDisplayedPrice(0);
  };

  const handleCreateDevis = () => {
    if (cart.length === 0) return alert("Le panier est vide.");
    if (!selectedClientCommerciale)
      return alert("Veuillez sélectionner un client commercial.");
    if (!clientName.trim())
      return alert("Veuillez entrer le nom du client (personne).");

    const devisData = {
      general: { serie, numero, idVente, date },
      client: {
        id: selectedClientCommerciale.id,
        nomClient: clientName,
        nomCommerciale: nomCommerciale,
        adresse: adresse,
        conditionPaiement: conditionPaiement,
      },
      articles: cart,
      totals: { totalHT, totalTVA, totalTTC },
    };

    console.log("Devis créé :", devisData);
    alert("Devis créé !");
    // Optionnellement réinitialiser les parties du formulaire pertinentes pour les articles
    setCart([]);
    setSelectedArticle(null);
    setQuantity(1);
    setUnit("pcs");
    setPackaging("AvecBout");
    setDisplayedPrice(0);
  };

  const totalHT = cart.reduce((sum, item) => sum + item.montantHT, 0);
  const totalTVA = cart.reduce((sum, item) => sum + item.montantTVA, 0);
  const totalTTC = cart.reduce((sum, item) => sum + item.montantTTC, 0);

  return (
    <div className="container">
      {/* <h1 className="titre-tableau">Nouvelle Vente</h1> */}
      <form onSubmit={handleAddArticleToCart} className="main-form">
        <div className="form-grid">
          {/* Première colonne: Informations générales */}
          <div className="form-column general-info">
            <h2>Informations Générales</h2>
            <div className="div-form-group">
              <div className="form-group">
                <label htmlFor="numeroVente">Numero Vente :</label>
                <input type="text" id="numeroVente" value={idVente}  />
              </div>
              <div className="form-group">
                <label htmlFor="serie">Série :</label>
                <select
                  id="serie"
                  value={serie}
                  onChange={(e) => setSerie(e.target.value)}
                  required
                >
                  <option value="BS">BS</option>
                </select>
              </div>
            </div>
            <div className="div-form-group">
              <div className="form-group">
                <label htmlFor="etat">État :</label>
                <select
                  id="etat"
                  value={etat}
                  onChange={(e) => setEtat(e.target.value)}
                  required
                >
                  <option value="payé">Payé</option>
                  <option value="non payé">Non Payé</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="date">Date :</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Deuxième colonne: Informations du tiers */}
          <div className="form-column client-info">
            <h2>Informations du Tiers</h2>
            {/* Nom commercial en SelectSearch */}
            <div className="div-form-group">
              <div className="form-group">
                <label htmlFor="nomCommercialeSelect">Nom Commerciale :</label>
                <div className="select-search-wrapper">
                  <SelectSearch
                    options={clientOptions || []}
                    value={
                      selectedClientCommerciale
                        ? selectedClientCommerciale.id
                        : ""
                    }
                    onChange={handleClientCommercialeSelect}
                    name="nomCommerciale"
                    placeholder="..."
                    search
                    required
                  />
                </div>
              </div>
              {/* Nom client (personne) - MODIFIABLE */}

              <div className="form-group">
                <label htmlFor="nomClient">Nom client (personne) :</label>
                <input
                  type="text"
                  id="nomClient"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* Adresse - AUTO-REMPLIE ET NON MODIFIABLE MANUELLEMENT */}

            <div className="div-form-group">
              <div className="form-group">
                <label htmlFor="adresse">Adresse :</label>
                <input type="text" id="adresse" value={adresse}  />
              </div>
              <div className="form-group">
                <label htmlFor="modePaiement">Mode de Paiement :</label>
                <select
                  id="modePaiement"
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value)}
                  required
                >
                  <option value="Espèces">Espèces</option>
                  <option value="Carte Bancaire">Carte Bancaire</option>
                  <option value="Virement">Virement</option>
                  <option value="Chèque">Chèque</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="conditionPaiement">
                  Condition de Paiement :
                </label>
                <select
                  id="conditionPaiement"
                  value={conditionPaiement}
                  onChange={(e) => setConditionPaiement(e.target.value)}
                  required
                >
                  <option value="Comptant">Comptant</option>
                  <option value="À 30 jours">À 30 jours</option>
                  <option value="À 60 jours">À 60 jours</option>
                  <option value="Autres">Autres</option>
                </select>
              </div>
            </div>
          </div>

          {/* Troisième colonne: Informations de l'article */}
          <div className="form-column article-selection">
            <h2>Informations de l'Article</h2>
            <div className="div-form-group">
              <div className="form-group">
                <label>Recherche articles :</label>
                <div className="select-search-wrapper">
                  <SelectSearch
                    options={articleOptions || []}
                    value={selectedArticle ? selectedArticle.id : ""}
                    onChange={handleArticleSelect}
                    name="article"
                    placeholder="..."
                    search
                  />
                </div>
              </div>
              {selectedArticle && (
                <div className="form-group">
                  <label htmlFor="prixUnitaire">Prix Unitaire :</label>
                  <input
                    type="text"
                    id="prixUnitaire"
                    // Affiche le prix basé sur la sélection de l'emballage et de l'unité
                    value={formatCurrency(displayedPrice)}
                    disabled
                  />
                </div>
              )}
            </div>

            {selectedArticle && (
              <>
                <div className="div-form-group">
                  <div className="form-group">
                    <label htmlFor="quantity">Quantité :</label>
                    <input
                      type="number"
                      id="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min="1"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="unit">Unité :</label>
                    <select
                      id="unit"
                      value={unit}
                      // Gère le changement d'unité
                      onChange={handleUnitChange}
                    >
                      <option value="pcs">pcs</option>
                      <option value="cageaut">Cageaut</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="packaging">Emballage :</label>
                    <select
                      id="packaging"
                      value={packaging}
                      onChange={handlePackagingChange}
                    >
                      <option value="AvecBout">Avec Bouteille</option>
                      <option value="Consigner">Consigner</option>
                      <option value="Echanger">Échanger</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="add-to-cart-button">
                  Ajouter au panier
                </button>
              </>
            )}
          </div>
        </div>
      </form>

      <div className="cart-section">
        <h3 className="titre-tableau">Panier</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Désignation</th>
                <th>Prix U HT</th>
                <th>QTE</th>
                <th>Unité</th>
                <th>Emballage</th>
                <th>Montant HT</th>
                <th>Montant TVA</th>
                <th>Montant TTC</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.length === 0 ? (
                <tr>
                  <td colSpan="9" className="t-center">
                    Le panier est vide.
                  </td>
                </tr>
              ) : (
                cart.map((item, index) => (
                  <tr key={index}>
                    <td>{item.designation}</td>
                    <td className="td-number">
                      {formatCurrency(item.prixUnitaire)}
                    </td>
                    <td className="t-center">{item.quantity}</td>
                    <td className="t-center">{item.unit}</td>
                    <td className="t-center">{item.packaging}</td>
                    <td className="td-number">
                      {formatCurrency(item.montantHT)}
                    </td>
                    <td className="td-number">
                      {formatCurrency(item.montantTVA)}
                    </td>
                    <td className="td-number">
                      {formatCurrency(item.montantTTC)}
                    </td>
                    <td className="t-center">
                      <button
                        onClick={() => handleDeleteItem(index)}
                        className="delete-button"
                      >
                        <MdDelete />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            {cart.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="5"></td>
                  <td className="td-number">
                    <strong>{formatCurrency(totalHT)}</strong>
                  </td>
                  <td className="td-number">
                    <strong>{formatCurrency(totalTVA)}</strong>
                  </td>
                  <td className="td-number">
                    <strong>{formatCurrency(totalTTC)}</strong>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      <div className="actions-buttons">
        <button onClick={handleValidateFacture} className="validate-button">
          Valider facture
        </button>
        <button onClick={handleCreateDevis} className="devis-button">
          Devis
        </button>
      </div>
    </div>
  );
}

export default NewVente;

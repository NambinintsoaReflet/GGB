import React, { useState, useEffect } from "react";
import SelectSearch from "react-select-search";
import "react-select-search/style.css";
import { articles } from "../../../Data/Articles";
import { clients } from "../../../Data/Clients";
import { MdDelete } from "react-icons/md";
import "./NewVente.css";
import ReceiptModal from "./ReceiptModal";
import AutoPrintReceipt from "./AutoPrintReceipt";

function NewVente() {
  // Information générales States
  const [serie, setSerie] = useState("BS");
  const [numero, setNumero] = useState(1);
  const [idVente, setIdVente] = useState("A1");
  const [etat, setEtat] = useState("non payé");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  // Information du tiers States
  const [selectedClientCommerciale, setSelectedClientCommerciale] =
    useState(null);
  const [clientName, setClientName] = useState("");
  const [nomCommerciale, setNomCommerciale] = useState("");
  const [adresse, setAdresse] = useState("");
  const [modePaiement, setModePaiement] = useState("Espèces");
  const [conditionPaiement, setConditionPaiement] = useState("Comptant");

  // Information de l'article States
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");
  const [packaging, setPackaging] = useState("AvecBout");
  const [displayedPrice, setDisplayedPrice] = useState(0);

  const [cart, setCart] = useState([]);

  // NOUVEAUX ÉTATS POUR LA MONNAIE ET L'IMPRESSION
  const [montantRecu, setMontantRecu] = useState(0);
  const [renduMonnaie, setRenduMonnaie] = useState(0);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  // NOUVEAUX ÉTATS POUR LES TOTAUX
  const [totalHT, setTotalHT] = useState(0);
  const [totalTVA, setTotalTVA] = useState(0);
  const [totalTTC, setTotalTTC] = useState(0);

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
      setModePaiement(
        selectedClientCommerciale.modePaiementDefaut || "Espèces"
      );
      setConditionPaiement(
        selectedClientCommerciale.conditionPaiementDefaut || "Comptant"
      );
    } else {
      setNomCommerciale("");
      setAdresse("");
      setClientName("");
      setModePaiement("Espèces");
      setConditionPaiement("Comptant");
    }
  }, [selectedClientCommerciale]);

  // Effet pour gérer le changement de prix en fonction de l'emballage et de l'unité
  useEffect(() => {
    if (selectedArticle) {
      let priceToDetermine;
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
        priceToDetermine = 0;
      }
      setDisplayedPrice(priceToDetermine);
    } else {
      setDisplayedPrice(0);
    }
  }, [selectedArticle, packaging, unit]);

  // NOUVEL EFFECT POUR CALCULER LES TOTAUX (HT, TVA, TTC) LORSQUE LE PANIER CHANGE
  useEffect(() => {
    const calculatedHT = cart.reduce((sum, item) => sum + item.montantHT, 0);
    const calculatedTVA = cart.reduce((sum, item) => sum + item.montantTVA, 0);
    const calculatedTTC = cart.reduce((sum, item) => sum + item.montantTTC, 0);

    setTotalHT(calculatedHT);
    setTotalTVA(calculatedTVA);
    setTotalTTC(calculatedTTC);
  }, [cart]); // Se déclenche chaque fois que le panier (cart) change

  // EFFECT POUR CALCULER LE RENDU MONNAIE (maintenant totalTTC est un état)
  useEffect(() => {
    if (montantRecu >= totalTTC) {
      setRenduMonnaie(montantRecu - totalTTC);
    } else {
      setRenduMonnaie(0);
    }
  }, [montantRecu, totalTTC]); // Dépend de la monnaie reçue et du total TTC

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
    if (
      cart.length > 0 &&
      selectedClientCommerciale &&
      selectedClientCommerciale.id !== value
    ) {
      alert(
        "Veuillez valider ou annuler la vente en cours avant de changer de client."
      );
      return;
    }
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
      setUnit("pcs");
      setQuantity(1);
      setPackaging("AvecBout");
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
  };

  const handleUnitChange = (e) => {
    const newUnit = e.target.value;
    setUnit(newUnit);
  };

  const handleAddArticleToCart = (e) => {
    e.preventDefault();

    if (!selectedClientCommerciale) {
      alert(
        "Veuillez sélectionner un client avant d'ajouter des articles au panier."
      );
      return;
    }

    if (!selectedArticle) {
      alert("Veuillez sélectionner un article.");
      return;
    }

    const parsedQuantity = parseInt(quantity);
    if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
      alert("La quantité doit être un nombre valide.");
      return;
    }

    const prixUnitairePourCalcul = displayedPrice;

    const montantHT = prixUnitairePourCalcul * parsedQuantity;
    // Assurez-vous que l'article a bien une propriété 'tva'
    const montantTVA = selectedArticle.tva
      ? montantHT * selectedArticle.tva
      : 0;
    const montantTTC = montantHT + montantTVA;

    const newItem = {
      id: selectedArticle.id,
      designation: selectedArticle.designation,
      prixUnitaire: prixUnitairePourCalcul,
      quantity: parsedQuantity,
      unit: unit,
      packaging: packaging,
      montantHT,
      montantTVA,
      montantTTC,
    };

    setCart([...cart, newItem]);
    setSelectedArticle(null);
    setQuantity(1);
    setUnit("pcs");
    setPackaging("AvecBout");
    setDisplayedPrice(0);
  };

  const handleDeleteItem = (index) => {
    const updatedCart = cart.filter((_, i) => i !== index);
    setCart(updatedCart);
    if (updatedCart.length === 0) {
      setSelectedClientCommerciale(null);
      setClientName("");
      setNomCommerciale("");
      setAdresse("");
    }
  };

  // LOGIQUE DE VALIDATION ET D'IMPRESSION MISE À JOUR
  const handleValidateFacture = () => {
    if (cart.length === 0) return alert("Le panier est vide.");
    if (!selectedClientCommerciale)
      return alert("Veuillez sélectionner un client commercial.");
    if (!clientName.trim())
      return alert("Veuillez entrer le nom du client (personne).");
    if (modePaiement === "Espèces" && montantRecu < totalTTC) {
      return alert("Le montant reçu est insuffisant !");
    }
    if (!modePaiement.trim())
      return alert("Veuillez sélectionner le mode de paiement.");
    if (!conditionPaiement.trim())
      return alert("Veuillez sélectionner la condition de paiement.");

    const saleData = {
      general: { idVente, etat, date },
      client: {
        id: selectedClientCommerciale.id,
        nomClient: clientName,
        nomCommerciale: nomCommerciale,
        adresse: adresse,
        modePaiement: modePaiement,
        conditionPaiement: conditionPaiement,
      },
      articles: cart,
      totals: { totalHT, totalTVA, totalTTC },
    };

    console.log("Facture validée :", saleData);

    // Préparer les données pour le reçu
    setReceiptData({
      entreprise: "XXXXXX XXXXX",
      nif: "XXX XXX XXXX",
      stat: "XX XXX XXXXXXXXXXX",
      caissier: "Propriétaire",
      pdv: "GGB 501",
      date: new Date().toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      articles: cart.map((item) => ({
        designation: item.designation,
        quantity: item.quantity,
        prixUnitaire: item.prixUnitaire,
        montantTTC: item.montantTTC,
      })),
      totalTTC: totalTTC,
      montantRecu: montantRecu,
      renduMonnaie: renduMonnaie,
      idVente: idVente,
      ticketNumber: `#1-${Math.floor(Math.random() * 100000)}`,
    });

    setShowPrintModal(true);

    // Réinitialiser tous les états du formulaire après une validation réussie
    setSerie("BS");
    setNumero((prev) => prev + 1);
    setEtat("non payé");
    setDate(new Date().toISOString().slice(0, 10));
    setSelectedClientCommerciale(null);
    setClientName("");
    setNomCommerciale("");
    setAdresse("");
    setModePaiement("Espèces");
    setConditionPaiement("Comptant");
    setCart([]);
    setSelectedArticle(null);
    setQuantity(1);
    setUnit("pcs");
    setPackaging("AvecBout");
    setDisplayedPrice(0);
    setMontantRecu(0);
    setRenduMonnaie(0);

    window.location.reload();
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
    setCart([]);
    setSelectedArticle(null);
    setQuantity(1);
    setUnit("pcs");
    setPackaging("AvecBout");
    setDisplayedPrice(0);
    setSelectedClientCommerciale(null);
    setClientName("");
    setNomCommerciale("");
    setAdresse("");
  };

  return (
    <div className="container">
      <form onSubmit={handleAddArticleToCart} className="main-form">
        <div className="form-grid">
          {/* Première colonne: Informations générales */}
          <div className="form-column general-info">
            <h2>Informations Générales</h2>
            <div className="div-form-group">
              <div className="form-group">
                <label htmlFor="numeroVente">Numero Vente :</label>
                <input type="text" id="numeroVente" value={idVente} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="serie">Série :</label>
                <select
                  id="serie"
                  value={serie}
                  onChange={(e) => setSerie(e.target.value)}
                  required
                  disabled={cart.length > 0}
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
                  disabled={cart.length > 0}
                />
              </div>
            </div>
          </div>

          {/* Deuxième colonne: Informations du tiers */}
          <div className="form-column client-info">
            <h2>Informations du Tiers</h2>
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
                    disabled={cart.length > 0}
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="nomClient">Nom client (personne) :</label>
                <input
                  type="text"
                  id="nomClient"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                  disabled={cart.length > 0}
                />
              </div>
            </div>
            <div className="div-form-group">
              <div className="form-group">
                <label htmlFor="adresse">Adresse :</label>
                <input type="text" id="adresse" value={adresse} disabled />
              </div>
              <div className="form-group">
                <label htmlFor="modePaiement">Mode de Paiement :</label>
                <select
                  id="modePaiement"
                  value={modePaiement}
                  onChange={(e) => setModePaiement(e.target.value)}
                  required
                  disabled={cart.length > 0}
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
                  disabled={cart.length > 0}
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
                    <select id="unit" value={unit} onChange={handleUnitChange}>
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
                <div className="flex-between">
                  <button type="submit" className="add-to-cart-button">
                    Ajouter au panier
                  </button>
                </div>
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
      {/* Nouvelle section pour les totaux et le paiement (pour l'input monnaie) */}
      {cart.length > 0 && (
        <div className="payment-summary-section">
          {modePaiement === "Espèces" && (
            <div className="payment-input-group">
              <label htmlFor="montantRecu">Montant Reçu (Espèces) :</label>
              <input
                type="number"
                id="montantRecu"
                value={montantRecu === 0 ? "" : montantRecu}
                onChange={(e) =>
                  setMontantRecu(parseFloat(e.target.value) || 0)
                }
                min={totalTTC > 0 ? totalTTC : "0"}
                required={modePaiement === "Espèces"}
              />
              <p className="rendu-monnaie">
                Rendu Monnaie : <span>{formatCurrency(renduMonnaie)}</span>
              </p>
            </div>
          )}
        </div>
      )}
      <div className="actions-buttons">
        <button onClick={handleValidateFacture} className="validate-button">
          Valider facture
        </button>
        <button onClick={handleCreateDevis} className="devis-button">
          Devis
        </button>
      </div>
      {/* Modal d'impression du reçu */}
      {showPrintModal && receiptData && (
        <AutoPrintReceipt
          data={receiptData}
          formatCurrency={formatCurrency}
          onAfterPrint={() => setShowPrintModal(false)}
        />
      )}
    </div>
  );
}

export default NewVente;

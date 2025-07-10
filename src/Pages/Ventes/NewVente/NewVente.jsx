import React, { useState } from "react";
import SelectSearch from "react-select-search";
import "react-select-search/style.css";
import { articles } from "../../../Data/Articles";
import { MdDelete } from "react-icons/md";
import "./NewVente.css";

function NewVente() {
  const [clientName, setClientName] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("pcs");
  const [packaging, setPackaging] = useState("Consigner");
  const [cart, setCart] = useState([]);

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
    //   name: `${article.designation} (ID: ${article.id}) - ${formatCurrency(
    //   article.prixUnitaire
    // )}`,
    value: article.id,
  }));

  const handleArticleSelect = (value) => {
    const article = articles.find((a) => a.id === value);
    if (article) {
      setSelectedArticle(article);
      setUnit(article.unite);
      setQuantity(1);
    }
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

    const montantHT = selectedArticle.prixUnitaire * parsedQuantity;
    const montantTVA = montantHT * selectedArticle.tva;
    const montantTTC = montantHT + montantTVA;

    const newItem = {
      id: selectedArticle.id,
      designation: selectedArticle.designation,
      prixUnitaire: selectedArticle.prixUnitaire,
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
    setPackaging("Consigner");
  };

  const handleDeleteItem = (index) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const handleValidateFacture = () => {
    if (cart.length === 0) return alert("Le panier est vide.");
    if (!clientName.trim()) return alert("Veuillez entrer le nom du client.");

    console.log("Facture validée pour :", clientName);
    console.log("Panier :", cart);
    alert("Facture validée !");
    setClientName("");
    setCart([]);
    setSelectedArticle(null);
  };

  const handleCreateDevis = () => {
    if (cart.length === 0) return alert("Le panier est vide.");
    if (!clientName.trim()) return alert("Veuillez entrer le nom du client.");

    console.log("Devis créé pour :", clientName);
    console.log("Articles :", cart);
    alert("Devis créé !");
  };

  const totalHT = cart.reduce((sum, item) => sum + item.montantHT, 0);
  const totalTVA = cart.reduce((sum, item) => sum + item.montantTVA, 0);
  const totalTTC = cart.reduce((sum, item) => sum + item.montantTTC, 0);

  return (
    <div className="container">
      <form onSubmit={handleAddArticleToCart}>
        <h1 className="titre-tableau">Nouvelle Vente</h1>
        <div className="form-vente">
          <div>
            <div>
              <label htmlFor="">Numero Vente :</label>
              <br />
              <input type="text" disabled />
            </div>
            <div>
              <label>Nom client :</label>
              <br />
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Recherche articles :</label>
              <div className="select-search-wrapper">
                <SelectSearch
                  options={articleOptions || []}
                  value={selectedArticle ? selectedArticle.id : ""}
                  onChange={handleArticleSelect}
                  name="article"
                  placeholder="Rechercher ou sélectionner un article"
                  search
                />
              </div>
            </div>
          </div>

          {selectedArticle && (
            <>
              <div>
                <div>
                  <label htmlFor="">Prix Unitaire :</label>
                  <br />
                  <input
                    type="text"
                    value={formatCurrency(selectedArticle.prixUnitaire)}
                    disabled
                  />
                </div>

                <label>Quantité :</label>
                <br />
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  min="1"
                  required
                />
                <br />
                <label>Unité :</label>
                <br />
                <select value={unit} onChange={(e) => setUnit(e.target.value)}>
                  <option value="pcs">Pièces</option>
                  <option value="kg">Kilogramme</option>
                  <option value="L">Litre</option>
                </select>
              </div>
              <div>
                <label>Emballage :</label>
                <select
                  value={packaging}
                  onChange={(e) => setPackaging(e.target.value)}
                >
                  <option value="Consigner">Consigner</option>
                  <option value="Echanger">Échanger</option>
                  <option value="Retourner">Retourner</option>
                </select>
                <br />
                <button type="submit">Ajouter au panier</button>
              </div>
            </>
          )}
        </div>
      </form>

      <div className="cart-section">
        <br />
        <h3 className="titre-tableau">Panier</h3>
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

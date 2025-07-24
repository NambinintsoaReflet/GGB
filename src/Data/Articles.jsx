// src/Data/Articles.js
export const articles = [
  {
    id: "ART001",
    designation: "THB Bouteille 65cl", // J'ai ajouté plus de détails pour la clarté
    unite: "pcs",
    tva: 0.20,
    prixConsigner: 1000,
    prixEchanger: 900,
    prixAvecBout: 1200,
    prixConsignerCageaut: 12000,
    prixEchangerCageaut: 10800,
    prixAvecBoutCageaut: 14400,
    pcsParCageaut: 12,
    // Nouveaux champs pour le bénéfice et le stock
    costPrice: 850,     // <--- NOUVEAU: Prix d'achat unitaire pour calculer le bénéfice
    stock: 150,         // <--- NOUVEAU: Stock actuel disponible (en pcs)
    minStock: 50        // <--- NOUVEAU: Seuil minimum pour déclencher une alerte
  },
  {
    id: "ART002",
    designation: "Coca Bouteille 1L", // J'ai ajouté plus de détails pour la clarté
    unite: "pcs",
    tva: 0.20,
    prixConsigner: 1000,
    prixEchanger: 900,
    prixAvecBout: 1200,
    prixConsignerCageaut: 12000,
    prixEchangerCageaut: 10800,
    prixAvecBoutCageaut: 14400,
    pcsParCageaut: 12,
    // Nouveaux champs pour le bénéfice et le stock
    costPrice: 900,     // <--- NOUVEAU: Prix d'achat unitaire pour calculer le bénéfice
    stock: 25,          // <--- NOUVEAU: Exemple de stock bas pour voir l'alerte
    minStock: 30        // <--- NOUVEAU: Seuil minimum
  },
  {
    id: "ART003",
    designation: "Jus Mangue 25cl",
    unite: "pcs",
    tva: 0.20,
    prixConsigner: 500, // Peut-être pas de consigne pour un jus, ajustez si besoin
    prixEchanger: 450,
    prixAvecBout: 600,
    // Si pas de cageot, vous pouvez omettre ces champs ou les laisser à 0/null
    prixConsignerCageaut: 0,
    prixEchangerCageaut: 0,
    prixAvecBoutCageaut: 0,
    pcsParCageaut: 0, // Ou 1 si vendu à l'unité sans emballage spécifique
    costPrice: 350,
    stock: 200,
    minStock: 75
  },
  {
    id: "ART004",
    designation: "Fanta Orange 1L",
    unite: "pcs",
    tva: 0.20,
    prixConsigner: 1000,
    prixEchanger: 900,
    prixAvecBout: 1200,
    prixConsignerCageaut: 12000,
    prixEchangerCageaut: 10800,
    prixAvecBoutCageaut: 14400,
    pcsParCageaut: 12,
    costPrice: 880,
    stock: 10, // Exemple de stock très bas
    minStock: 20
  },
];
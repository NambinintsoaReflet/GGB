// src/Data/Sales.js
export const sales = [
  {
    general: { idVente: "BS100", etat: "payé", date: "2025-07-17" },
    client: {
      id: "CL002",
      nomClient: "RANDRIA Malala",
      nomCommerciale: "Épicerie B",
      adresse: "Rue Pasteur Isoraka, Antananarivo",
      modePaiement: "Espèces",
      conditionPaiement: "Comptant",
    },
    articles: [
      {
        id: "ART001",
        designation: "THB Bouteille 65cl",
        prixUnitaire: 1200, // Prix avec Bout (valeur de prixAvecBout)
        quantity: 10,
        unite: "pcs",
        packaging: "AvecBout", // Important pour identifier le prix appliqué
        montantHT: 12000,
        montantTVA: 2400, // Si TVA appliquée
        montantTTC: 14400,
      },
      {
        id: "ART002",
        designation: "Coca Bouteille 1L",
        prixUnitaire: 1000, // Prix Consigner (valeur de prixConsigner)
        quantity: 5,
        unite: "pcs",
        packaging: "Consigner", // Important
        montantHT: 5000,
        montantTVA: 1000,
        montantTTC: 6000,
      },
    ],
    totals: { totalHT: 17000, totalTVA: 3400, totalTTC: 20400 },
  },
  {
    general: { idVente: "BS101", etat: "non payé", date: "2025-07-18" }, // Date d'aujourd'hui
    client: {
      id: "CL001",
      nomClient: "RAKOTO Jean",
      nomCommerciale: "SuperMarket A",
      adresse: "Lot II F 23 Ambohijatovo, Antananarivo",
      modePaiement: "Carte Bancaire",
      conditionPaiement: "À 30 jours",
    },
    articles: [
      {
        id: "ART001",
        designation: "THB Bouteille 65cl",
        prixUnitaire: 14400, // Prix pour un cageot AvecBout
        quantity: 2, // 2 cageots
        unite: "cageots", // Unité vendue
        packaging: "AvecBoutCageaut", // Important
        montantHT: 28800,
        montantTVA: 5760,
        montantTTC: 34560,
      },
      {
        id: "ART003",
        designation: "Jus Mangue 25cl",
        prixUnitaire: 600, // Prix AvecBout
        quantity: 15,
        unite: "pcs",
        packaging: "AvecBout",
        montantHT: 9000,
        montantTVA: 1800,
        montantTTC: 10800,
      },
    ],
    totals: { totalHT: 37800, totalTVA: 7560, totalTTC: 45360 },
  },
  {
    general: { idVente: "BS102", etat: "payé", date: "2025-07-18" }, // Date d'aujourd'hui
    client: {
      id: "CL004",
      nomClient: "RASOA Martine",
      nomCommerciale: "Restaurant D",
      adresse: "Anosy, Antananarivo",
      modePaiement: "Espèces",
      conditionPaiement: "Comptant",
    },
    articles: [
      {
        id: "ART004",
        designation: "Fanta Orange 1L",
        prixUnitaire: 1200, // Prix AvecBout
        quantity: 10,
        unite: "pcs",
        packaging: "AvecBout",
        montantHT: 12000,
        montantTVA: 2400,
        montantTTC: 14400,
      },
    ],
    totals: { totalHT: 12000, totalTVA: 2400, totalTTC: 14400 },
  },
  // ... autres ventes
];
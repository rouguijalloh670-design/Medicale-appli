const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const centres = [
  {
    id: 1,
    nom: "Centre Médical Nongo",
    adresse: "Nongo, Conakry",
    contact: "622 000 001"
  },
  {
    id: 2,
    nom: "Clinique Camayenne",
    adresse: "Camayenne, Conakry",
    contact: "622 000 002"
  }
];

const specialites = [
  { id: 1, nom: "Médecine générale" },
  { id: 2, nom: "Pédiatrie" },
  { id: 3, nom: "Cardiologie" }
];

const medecins = [
  { id: 1, nom: "Dr. Amadou Bah", centreId: 1, specialiteId: 1 },
  { id: 2, nom: "Dr. Fatou Camara", centreId: 1, specialiteId: 2 },
  { id: 3, nom: "Dr. Mohamed Diallo", centreId: 2, specialiteId: 3 }
];

const disponibilites = [
  { id: 1, medecinId: 1, date: "2026-09-23", heure: "09:00" },
  { id: 2, medecinId: 1, date: "2026-09-23", heure: "10:00" },
  { id: 3, medecinId: 2, date: "2026-09-23", heure: "11:00" },
  { id: 4, medecinId: 3, date: "2026-09-23", heure: "14:00" }
];

const rendezVous = [];

const absences = [
  {
    id: 1,
    medecinId: 2,
    date: "2026-09-23",
    motif: "Congé"
  }
];

const utilisateurs = [
  {
    id: 1,
    email: "admin@medical.com",
    motDePasse: "123456",
    nom: "Administrateur"
  }
];

app.post("/login", (req, res) => {
  const { email, motDePasse } = req.body;

  const utilisateur = utilisateurs.find(
    u => u.email === email && u.motDePasse === motDePasse
  );

  if (!utilisateur) {
    return res.status(401).json({
      message: "Email ou mot de passe incorrect."
    });
  }

  res.json({
    message: "Connexion réussie",
    utilisateur: {
      id: utilisateur.id,
      email: utilisateur.email,
      nom: utilisateur.nom
    }
  });
});

// Accueil
app.get("/", (req, res) => {
  res.json({ message: "API Medical App OK" });
});

// Centres
app.get("/centres", (req, res) => {
  res.json(centres);
});

// Spécialités
app.get("/specialites", (req, res) => {
  res.json(specialites);
});

// Médecins filtrés
app.get("/medecins", (req, res) => {
  const { centreId, specialiteId } = req.query;

  let resultat = medecins;

  if (centreId) {
    resultat = resultat.filter(m => m.centreId === Number(centreId));
  }

  if (specialiteId) {
    resultat = resultat.filter(m => m.specialiteId === Number(specialiteId));
  }

  res.json(resultat);
});

// Disponibilités
app.get("/medecins/:id/disponibilites", (req, res) => {
  const medecinId = Number(req.params.id);

  const estAbsent = absences.some(
    (a) => a.medecinId === medecinId && a.date === "2026-09-23"
  );

  if (estAbsent) {
    return res.json([]);
  }

  const resultat = disponibilites.filter(
    (d) =>
      d.medecinId === medecinId &&
      !rendezVous.some((r) => r.disponibiliteId === d.id)
  );

  res.json(resultat);
});
// Réserver
app.post("/rendez-vous", (req, res) => {
  const { medecinId, disponibiliteId, patientNom } = req.body;

  const dejaReserve = rendezVous.some(
    r => r.disponibiliteId === Number(disponibiliteId)
  );

  if (dejaReserve) {
    return res.status(400).json({
      message: "Ce créneau est déjà réservé."
    });
  }

  const nouveauRdv = {
    id: rendezVous.length + 1,
    medecinId: Number(medecinId),
    disponibiliteId: Number(disponibiliteId),
    patientNom,
    statut: "CONFIRME"
  };

  rendezVous.push(nouveauRdv);

  res.status(201).json(nouveauRdv);
});

app.listen(5000, () => {
  console.log("Serveur lancé sur http://localhost:5000");
});
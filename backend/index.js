const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   CONNEXION
========================= */

app.post("/login", async (req, res) => {
  try {
    const { email, motDePasse } = req.body;

    const utilisateur = await prisma.utilisateur.findUnique({
      where: {
        email: email
      }
    });

    if (!utilisateur || utilisateur.motDePasse !== motDePasse) {
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
  } catch (error) {
    console.error("Erreur login :", error);

    res.status(500).json({
      message: "Erreur serveur lors de la connexion."
    });
  }
});

/* =========================
   ACCUEIL
========================= */

app.get("/", (req, res) => {
  res.json({
    message: "API Medical App OK"
  });
});

/* =========================
   CENTRES
========================= */

app.get("/centres", async (req, res) => {
  try {
    const centres = await prisma.centre.findMany({
      orderBy: {
        id: "asc"
      }
    });

    res.json(centres);
  } catch (error) {
    console.error("Erreur centres :", error);

    res.status(500).json({
      message: "Erreur lors de la récupération des centres."
    });
  }
});

/* =========================
   SPECIALITES
========================= */

app.get("/specialites", async (req, res) => {
  try {
    const specialites = await prisma.specialite.findMany({
      orderBy: {
        id: "asc"
      }
    });

    res.json(specialites);
  } catch (error) {
    console.error("Erreur spécialités :", error);

    res.status(500).json({
      message: "Erreur lors de la récupération des spécialités."
    });
  }
});

/* =========================
   MEDECINS
========================= */

app.get("/medecins", async (req, res) => {
  try {
    const { centreId, specialiteId } = req.query;

    const filtre = {};

    if (centreId) {
      filtre.centreId = Number(centreId);
    }

    if (specialiteId) {
      filtre.specialiteId = Number(specialiteId);
    }

    const medecins = await prisma.medecin.findMany({
      where: filtre,
      orderBy: {
        id: "asc"
      }
    });

    res.json(medecins);
  } catch (error) {
    console.error("Erreur médecins :", error);

    res.status(500).json({
      message: "Erreur lors de la récupération des médecins."
    });
  }
});

/* =========================
   DISPONIBILITES
========================= */

app.get("/medecins/:id/disponibilites", async (req, res) => {
  try {
    const medecinId = Number(req.params.id);

    /*
      On récupère les disponibilités du médecin
      qui ne possèdent pas encore de rendez-vous.
    */

    const disponibilites = await prisma.disponibilite.findMany({
      where: {
        medecinId: medecinId,
        disponible: true,
        rendezVous: null
      },
      orderBy: [
        {
          date: "asc"
        },
        {
          heure: "asc"
        }
      ]
    });

    res.json(disponibilites);
  } catch (error) {
    console.error("Erreur disponibilités :", error);

    res.status(500).json({
      message: "Erreur lors de la récupération des disponibilités."
    });
  }
});

/* =========================
   RESERVATION
========================= */

app.post("/rendez-vous", async (req, res) => {
  try {
    const {
      medecinId,
      disponibiliteId,
      patientNom,
      utilisateurId
    } = req.body;

    const medecinIdNumber = Number(medecinId);
    const disponibiliteIdNumber = Number(disponibiliteId);

    /*
      Pour l'instant, si le frontend n'envoie pas
      utilisateurId, on utilise l'utilisateur admin
      créé dans notre seed.
    */

    const utilisateurIdNumber = utilisateurId
      ? Number(utilisateurId)
      : 1;

    /* Vérifier la disponibilité */

    const disponibilite = await prisma.disponibilite.findUnique({
      where: {
        id: disponibiliteIdNumber
      },
      include: {
        rendezVous: true
      }
    });

    if (!disponibilite) {
      return res.status(404).json({
        message: "Disponibilité introuvable."
      });
    }

    if (
      disponibilite.medecinId !== medecinIdNumber ||
      !disponibilite.disponible ||
      disponibilite.rendezVous
    ) {
      return res.status(400).json({
        message: "Ce créneau est déjà réservé ou indisponible."
      });
    }

    /* Créer le rendez-vous */

    const nouveauRdv = await prisma.rendezVous.create({
      data: {
        utilisateurId: utilisateurIdNumber,
        medecinId: medecinIdNumber,
        disponibiliteId: disponibiliteIdNumber,
        patientNom: patientNom
      }
    });

    /*
      On marque également le créneau comme indisponible.
    */

    await prisma.disponibilite.update({
      where: {
        id: disponibiliteIdNumber
      },
      data: {
        disponible: false
      }
    });

    res.status(201).json(nouveauRdv);
  } catch (error) {
    console.error("Erreur réservation :", error);

    res.status(500).json({
      message: "Erreur lors de la réservation."
    });
  }
});

/* =========================
   SERVEUR
========================= */

app.listen(5000, () => {
  console.log("Serveur lancé sur http://localhost:5000");
});

/* =========================
   FERMETURE PRISMA
========================= */

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Début du seed...");

  // =========================
  // UTILISATEUR ADMIN
  // =========================

  const admin = await prisma.utilisateur.upsert({
    where: {
      email: "admin@medical.com"
    },
    update: {},
    create: {
      email: "admin@medical.com",
      motDePasse: "123456",
      nom: "Administrateur"
    }
  });

  // =========================
  // CENTRES
  // =========================

  const centreNongo = await prisma.centre.create({
    data: {
      nom: "Centre Médical Nongo",
      adresse: "Nongo, Conakry",
      contact: "622 000 001"
    }
  });

  const centreCamayenne = await prisma.centre.create({
    data: {
      nom: "Clinique Camayenne",
      adresse: "Camayenne, Conakry",
      contact: "622 000 002"
    }
  });

  // =========================
  // SPECIALITES
  // =========================

  const medecineGenerale = await prisma.specialite.create({
    data: {
      nom: "Médecine générale"
    }
  });

  const pediatrie = await prisma.specialite.create({
    data: {
      nom: "Pédiatrie"
    }
  });

  const cardiologie = await prisma.specialite.create({
    data: {
      nom: "Cardiologie"
    }
  });

  // =========================
  // MEDECINS
  // =========================

  const docteurAmadou = await prisma.medecin.create({
    data: {
      nom: "Dr. Amadou Bah",
      centreId: centreNongo.id,
      specialiteId: medecineGenerale.id
    }
  });

  const docteurFatou = await prisma.medecin.create({
    data: {
      nom: "Dr. Fatou Camara",
      centreId: centreNongo.id,
      specialiteId: pediatrie.id
    }
  });

  const docteurMohamed = await prisma.medecin.create({
    data: {
      nom: "Dr. Mohamed Diallo",
      centreId: centreCamayenne.id,
      specialiteId: cardiologie.id
    }
  });

  // =========================
  // DISPONIBILITES
  // =========================

  await prisma.disponibilite.createMany({
    data: [
      {
        medecinId: docteurAmadou.id,
        date: new Date("2026-09-23"),
        heure: "09:00",
        disponible: true
      },
      {
        medecinId: docteurAmadou.id,
        date: new Date("2026-09-23"),
        heure: "10:00",
        disponible: true
      },
      {
        medecinId: docteurFatou.id,
        date: new Date("2026-09-23"),
        heure: "11:00",
        disponible: true
      },
      {
        medecinId: docteurMohamed.id,
        date: new Date("2026-09-23"),
        heure: "14:00",
        disponible: true
      }
    ]
  });

  // =========================
  // ABSENCE
  // =========================

  await prisma.absence.create({
    data: {
      medecinId: docteurFatou.id,
      date: new Date("2026-09-23"),
      motif: "Congé"
    }
  });

  console.log("✅ Seed terminé avec succès !");
  console.log(`👤 Administrateur : ${admin.email}`);
  console.log("🏥 Centres créés");
  console.log("👨‍⚕️ Médecins créés");
  console.log("📅 Disponibilités créées");
  console.log("🚫 Absence créée");
}

main()
  .catch((error) => {
    console.error("❌ Erreur pendant le seed :", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
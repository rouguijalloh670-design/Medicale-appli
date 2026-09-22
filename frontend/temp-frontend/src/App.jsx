import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000";

function App() {
  // =========================
  // AUTHENTIFICATION
  // =========================

  const [connecte, setConnecte] = useState(false);
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState("");
  const [chargement, setChargement] = useState(false);
  const [utilisateur, setUtilisateur] = useState(null);

  // =========================
  // DONNÉES MÉDICALES
  // =========================

  const [centres, setCentres] = useState([]);
  const [specialites, setSpecialites] = useState([]);
  const [medecins, setMedecins] = useState([]);
  const [disponibilites, setDisponibilites] = useState([]);

  const [centreId, setCentreId] = useState("");
  const [specialiteId, setSpecialiteId] = useState("");
  const [medecinId, setMedecinId] = useState("");
  const [disponibiliteId, setDisponibiliteId] = useState("");
  const [patientNom, setPatientNom] = useState("");

  // =========================
  // CONNEXION
  // =========================

  const seConnecter = async (e) => {
    e.preventDefault();

    setErreur("");
    setChargement(true);

    try {
      const res = await axios.post(`${API}/login`, {
        email,
        motDePasse
      });

      setUtilisateur(res.data.utilisateur);
      setConnecte(true);

      setEmail("");
      setMotDePasse("");
    } catch (error) {
      setErreur(
        error.response?.data?.message ||
          "Une erreur est survenue lors de la connexion."
      );
    } finally {
      setChargement(false);
    }
  };

  // =========================
  // DÉCONNEXION
  // =========================

  const seDeconnecter = () => {
    setConnecte(false);
    setUtilisateur(null);

    setCentreId("");
    setSpecialiteId("");
    setMedecinId("");
    setDisponibiliteId("");
    setPatientNom("");
  };

  // =========================
  // RÉCUPÉRATION DES CENTRES
  // =========================

  useEffect(() => {
    if (!connecte) return;

    axios.get(`${API}/centres`).then((res) => {
      setCentres(res.data);
    });

    axios.get(`${API}/specialites`).then((res) => {
      setSpecialites(res.data);
    });
  }, [connecte]);

  // =========================
  // RÉCUPÉRATION DES MÉDECINS
  // =========================

  useEffect(() => {
    if (!centreId || !specialiteId) {
      setMedecins([]);
      return;
    }

    axios
      .get(
        `${API}/medecins?centreId=${centreId}&specialiteId=${specialiteId}`
      )
      .then((res) => setMedecins(res.data));
  }, [centreId, specialiteId]);

  // =========================
  // DISPONIBILITÉS
  // =========================

  useEffect(() => {
    if (!medecinId) {
      setDisponibilites([]);
      return;
    }

    axios
      .get(`${API}/medecins/${medecinId}/disponibilites`)
      .then((res) => setDisponibilites(res.data));
  }, [medecinId]);

  // =========================
  // RÉSERVER
  // =========================

  const reserver = async (e) => {
    e.preventDefault();

    if (!patientNom || !disponibiliteId) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    try {
      await axios.post(`${API}/rendez-vous`, {
        medecinId,
        disponibiliteId,
        patientNom
      });

      alert("Rendez-vous réservé avec succès !");

      setPatientNom("");
      setDisponibiliteId("");

      const res = await axios.get(
        `${API}/medecins/${medecinId}/disponibilites`
      );

      setDisponibilites(res.data);
    } catch (error) {
      alert("Impossible de réserver ce créneau.");
    }
  };

  // ==================================================
  // PAGE DE CONNEXION
  // ==================================================

  if (!connecte) {
    return (
      <div className="app">
        <div className="card login-card">
          <h1>Medical App</h1>

          <p>Connectez-vous à votre compte</p>

          <form onSubmit={seConnecter}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Mot de passe</label>

            <input
              type="password"
              placeholder="Entrez votre mot de passe"
              value={motDePasse}
              onChange={(e) => setMotDePasse(e.target.value)}
              required
            />

            {erreur && <p className="error-message">{erreur}</p>}

            <button type="submit" disabled={chargement}>
              {chargement ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==================================================
  // APPLICATION APRÈS CONNEXION
  // ==================================================

  return (
    <div className="app">
      <div className="card">
        <div className="header">
          <div>
            <h1>Medical App</h1>

            <p>Bienvenue, {utilisateur?.nom}</p>
          </div>

          <button
            type="button"
            className="logout-button"
            onClick={seDeconnecter}
          >
            Déconnexion
          </button>
        </div>

        <p>Réservation de rendez-vous médical</p>

        <form onSubmit={reserver}>
          <label>Centre médical</label>

          <select
            value={centreId}
            onChange={(e) => {
              setCentreId(e.target.value);
              setMedecinId("");
              setDisponibiliteId("");
            }}
          >
            <option value="">Choisir un centre</option>

            {centres.map((centre) => (
              <option key={centre.id} value={centre.id}>
                {centre.nom}
              </option>
            ))}
          </select>

          <label>Spécialité</label>

          <select
            value={specialiteId}
            onChange={(e) => {
              setSpecialiteId(e.target.value);
              setMedecinId("");
              setDisponibiliteId("");
            }}
          >
            <option value="">Choisir une spécialité</option>

            {specialites.map((specialite) => (
              <option key={specialite.id} value={specialite.id}>
                {specialite.nom}
              </option>
            ))}
          </select>

          <label>Médecin</label>

          <select
            value={medecinId}
            onChange={(e) => {
              setMedecinId(e.target.value);
              setDisponibiliteId("");
            }}
            disabled={!centreId || !specialiteId}
          >
            <option value="">Choisir un médecin</option>

            {medecins.map((medecin) => (
              <option key={medecin.id} value={medecin.id}>
                {medecin.nom}
              </option>
            ))}
          </select>

          <label>Créneau disponible</label>

          <select
            value={disponibiliteId}
            onChange={(e) => setDisponibiliteId(e.target.value)}
            disabled={!medecinId}
          >
            <option value="">Choisir un créneau</option>

            {disponibilites.map((d) => (
              <option key={d.id} value={d.id}>
                {d.date} à {d.heure}
              </option>
            ))}
          </select>

          <label>Nom du patient</label>

          <input
            type="text"
            placeholder="Votre nom"
            value={patientNom}
            onChange={(e) => setPatientNom(e.target.value)}
          />

          <button type="submit">
            Réserver le rendez-vous
          </button>
        </form>
      </div>
    </div>
  );
}

export default App;
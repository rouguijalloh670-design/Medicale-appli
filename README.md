# Medical App

Application web de réservation de rendez-vous médicaux permettant aux utilisateurs de se connecter et de rechercher un médecin selon un centre et une spécialité, puis de réserver un créneau disponible.

## Fonctionnalités

* Authentification utilisateur
* Connexion avec email et mot de passe
* Consultation des centres médicaux
* Sélection d'une spécialité
* Filtrage des médecins par centre et spécialité
* Consultation des créneaux disponibles
* Gestion des absences des médecins
* Réservation d'un rendez-vous
* Un créneau réservé devient automatiquement indisponible
* Déconnexion de l'utilisateur

## Technologies

### Frontend

* React
* Axios
* CSS
* JavaScript / JSX

### Backend

* Node.js
* Express.js
* CORS
* API REST

### Base de données

* PostgreSQL
* Prisma ORM

## Architecture

L'application est organisée selon l'architecture suivante :

```text
React
   ↓
Axios
   ↓
API REST
   ↓
Node.js / Express.js
   ↓
Prisma ORM
   ↓
PostgreSQL
```

## Structure du projet

```text
Medical-App/
│
├── backend/
│   ├── index.js
│   ├── package.json
│   ├── package-lock.json
│   ├── .env
│   └── prisma/
│       ├── schema.prisma
│       ├── seed.js
│       └── migrations/
│
├── frontend/
│   └── temp-frontend/
│       └── ...
│
└── README.md
```

> Le fichier `.env` contient les informations de connexion à la base de données et n'est pas envoyé sur GitHub.

## Installation

### Backend

```bash
cd backend
npm install
```

### Configuration de PostgreSQL

Créer une base de données PostgreSQL nommée :

```text
medical_app
```

Créer ensuite un fichier `.env` dans le dossier `backend` :

```env
DATABASE_URL="postgresql://postgres@localhost:5432/medical_app?schema=public"
```

### Prisma

Pour appliquer les migrations :

```bash
npx prisma migrate dev
```

Pour générer le client Prisma :

```bash
npx prisma generate
```

Pour insérer les données de démonstration :

```bash
node prisma/seed.js
```

### Lancer le backend

```bash
node index.js
```

Le serveur démarre sur :

```text
http://localhost:5000
```

### Frontend

Dans un autre terminal :

```bash
cd frontend/temp-frontend
npm install
npm run dev
```

L'application sera ensuite accessible à l'adresse indiquée par Vite, généralement :

```text
http://localhost:5173
```

## Authentification

Pour tester la connexion, utiliser les identifiants suivants :

```text
Email : admin@medical.com
Mot de passe : 123456
```

Après une connexion réussie, l'utilisateur accède à l'interface de réservation des rendez-vous.

## API principale

| Méthode | Route                          | Description                             |
| ------- | ------------------------------ | --------------------------------------- |
| POST    | `/login`                       | Authentification de l'utilisateur       |
| GET     | `/`                            | Vérification du fonctionnement de l'API |
| GET     | `/centres`                     | Liste des centres médicaux              |
| GET     | `/specialites`                 | Liste des spécialités                   |
| GET     | `/medecins`                    | Liste des médecins avec filtres         |
| GET     | `/medecins/:id/disponibilites` | Créneaux disponibles d'un médecin       |
| POST    | `/rendez-vous`                 | Réservation d'un rendez-vous            |

## Modèle de données

La base de données PostgreSQL est gérée avec Prisma et contient notamment les entités suivantes :

* Utilisateur
* Centre
* Spécialité
* Médecin
* Disponibilité
* Absence
* Rendez-vous

Les relations entre ces entités permettent de gérer les médecins, leurs spécialités, leurs centres, leurs disponibilités et les rendez-vous des utilisateurs.

## Règles métier

* Un médecin peut être associé à un centre et à une spécialité.
* Les médecins peuvent avoir des absences enregistrées.
* Lorsqu'un médecin est absent à une date donnée, aucun créneau ne doit être proposé pour cette date.
* Un créneau ne peut être réservé qu'une seule fois.
* Après réservation, le créneau devient indisponible.
* L'utilisateur doit être connecté avant d'accéder à l'interface de réservation.

## Statut du projet

Projet réalisé dans le cadre d'un exercice de développement web.

L'objectif est de mettre en pratique la conception d'une application React avec une API REST développée avec Node.js et Express.js, ainsi que la gestion d'une base de données PostgreSQL avec Prisma, de l'authentification et des règles métier liées aux rendez-vous médicaux.

const express = require("express");
const cors = require("cors");
const app = express();
const port = 5000;

const { Client } = require("pg");

const client = new Client({
  user: "qvpcbtbb",
  host: "bubble.db.elephantsql.com",
  database: "qvpcbtbb",
  password: "InubxDuQZ1hQGFpKJnmto767w7eZypll",
  port: 5432, // Port par défaut de PostgreSQL
});

client.connect();

app.use(cors());

app.use(express.json());

//  pour récupérer la liste des tâches
app.get("/api/tasks", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM taches order by titre");
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/connexion", (req, res) => {
  try {
    const { email, motdepasse } = req.body;
    const result = client.query(
      "SELECT * FROM compte order where email = $1 and motdepasse = $2 "
    );
    const values = [email, motdepasse];
    res.json(result.rows);
    console.log(result.rows);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
//add compte
app.post("/submit-form", (req, res) => {
  const { nom, prenom, email, password, dateDeNaissance } = req.body; // Remplacez champ1, champ2, champ3 par les noms de vos champs de formulaire

  const sqlQuery =
    "INSERT INTO compte (nom, prenom, motdepasse, datedenaissance, email) VALUES ($1, $2, $3, $4, $5)";
  const values = [nom, prenom, email, password, dateDeNaissance];

  client.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données :", err);
      res.status(500).send("Erreur lors de l'insertion des données");
    } else {
      console.log("Données insérées avec succès.");
      res.status(200).send("Données insérées avec succès");
      // window.location.href = "/taches";
    }
  });
});

//add task
app.post("/submit-tache", (req, res) => {
  const { titre, description, etat, priorité, date_debut, date_fin } = req.body; // Remplacez champ1, champ2, champ3 par les noms de vos champs de formulaire

  const sqlQuery =
    "INSERT INTO taches (titre, description, etat, priorité, date_debut, date_fin) VALUES ($1, $2, $3, $4, $5, $6)";
  const values = [titre, description, etat, priorité, date_debut, date_fin];

  client.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données  Taches:", err);
      res.status(500).send("Erreur lors de l'insertion des données");
    } else {
      console.log("Données insérées avec succès Taches.");
      res.status(200).send("Données insérées avec succès Taches");
    }
  });
});

//update task task
app.post("/update-tache", (req, res) => {
  const { titre, description, etat, priorité, date_debut, date_fin } = req.body; // Remplacez champ1, champ2, champ3 par les noms de vos champs de formulaire

  const sqlQuery =
    "UPDATE taches SET description = $2, etat = $3, priorité = $4, date_debut = $5, date_fin = $6 WHERE titre = $1";

  const values = [titre, description, etat, priorité, date_debut, date_fin];

  client.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de la modification des données  Taches:", err);
      res.status(500).send("Erreur lors de la modification des données");
    } else {
      console.log("Données modifié avec succès Taches.");
      res.status(200).send("Données modifié avec succès Taches");
      /*   const result = client.query("SELECT * FROM taches");
      res.json(result.rows);*/
    }
  });
});

//delete task task

app.post("/delete-tache", (req, res) => {
  try {
    const titreToDelete = req.body.titre;

    const sql_delete_tache = "DELETE FROM taches WHERE titre = $1";
    const result = client.query(sql_delete_tache, [titreToDelete]);

    // Check the result or send a response
    res.send("Tache deleted successfully");
  } catch (error) {
    console.error("Error deleting tache:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

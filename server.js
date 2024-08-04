const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");

const cors = require("cors");
const app = express();
app.use(bodyParser.json());
const port = 5000;

const { Client } = require("pg");

const database = {
  users: [
    {
      id: "123",
      name: "John",
      email: "john@gmail.com",
      password: "cookies",
      entries: 0,
      joined: new Date(),
    },
    {
      id: "124",
      name: "Sally",
      email: "Sally@gmail.com",
      password: "bananas",
      entries: 0,
      joined: new Date(),
    },
  ],
};

global.sign = false;

app.get("/signout", (req, res) => {
  //  const { sign } = req.body;
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.send(database.users);
  global.sign = false;
  console.log(global.sign);
});

app.post("/signin", (req, res) => {
  if (
    req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password
  ) {
    res.json("success");
  } else {
    res.status(400).json("error login in");
  }
  res.json("singning");
});

app.get("/profile/:id", (req, res) => {
  if (sign == true) {
    const { id } = req.params;
    let found = false;
    database.users.forEach((user) => {
      if (user.id === id) {
        found = true;
        res.json(found);
      }

      if (!found) {
        res.status(404).json("No such user");
      }
    });
  }
});

app.post("/image", (req, res) => {
  const { id } = req.body;
  let found = false;
  database.users.forEach((user) => {
    if (user.id === id) {
      found = true;
      user.entries++;
      res.json(user.entries);
    }

    if (!found) {
      res.status(404).json("No such user");
    }
  });
});

app.post("/register", (req, res) => {
  const { email, name, password } = req.body;
  bcrypt.hash(password, null, null, function (err, hash) {
    console.log(hash);
  });
  database.users.push({
    id: "125",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date(),
  });
  res.json(database.users[database.users.length - 1]);
});

const client = new Client({
  user: "qvpcbtbb",
  host: "bubble.db.elephantsql.com",
  database: "qvpcbtbb",
  password: "InubxDuQZ1hQGFpKJnmto767w7eZypll",
  port: 5432, // Port par défaut de PostgreSQL
});

const { v4: uuidv4 } = require("uuid");

client.connect();

app.use(cors());

app.use(express.json());

//  pour récupérer la liste des tâches
app.get("/api/tasks/:id_compte", async (req, res) => {
  if (global.sign) {
    const id_compte = req.params.id_compte;
    console.log(id_compte);
    try {
      const result = await client.query(
        "SELECT * FROM taches WHERE id_compte = $1 ORDER BY titre",
        [id_compte]
      );
      global.sign = true;
      res.json(result.rows);
      console.log(result.rows);
      console.log(global.sign);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/connexion", async (req, res) => {
  try {
    const { email, motdepasse } = req.body;

    const result = await client.query(
      "SELECT * FROM compte WHERE email = $1 AND motdepasse = $2 ",
      [email, motdepasse]
    );

    const firstRow = result.rows[0];
    const email_result = firstRow.email;
    const id_compte = firstRow.id_compte;
    //   console.log(firstRow.id_compte);
    //  const id_compte = firstRow.id_compte;

    const m_pass_result = firstRow.motdepasse;
    if (email_result == email && m_pass_result == motdepasse) {
      res.status(200).json({ message: "Connexion full", id_compte });
    }
    global.sign = true;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//add compte
app.post("/submit-form", (req, res) => {
  const idCompte = uuidv4();
  console.log(idCompte);

  const { nom, prenom, email, password, dateDeNaissance } = req.body; // Remplacez champ1, champ2, champ3 par les noms de vos champs de formulaire

  const sqlQuery =
    "INSERT INTO compte (id_compte, nom, prenom, motdepasse, datedenaissance, email) VALUES ($1, $2, $3, $4, $5, $6)";
  const values = [idCompte, nom, prenom, password, dateDeNaissance, email];

  client.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données :", err);
      res.status(500).send("Erreur lors de l'insertion des données");
    } else {
      res.status(200).json({ message: "Connexion full", idCompte });
    }
  });
});

//add task
app.post("/submit-tache", (req, res) => {
  const {
    titre,
    description,
    etat,
    priorité,
    date_debut,
    date_fin,
    id_compte,
  } = req.body; // Remplacez champ1, champ2, champ3 par les noms de vos champs de formulaire

  const id_tache = uuidv4();
  const sqlQuery =
    "INSERT INTO taches (titre, description, etat, priorité, date_debut, date_fin ,id_compte,id_tache) VALUES ($1, $2, $3, $4, $5, $6, $7,$8)";
  const values = [
    titre,
    description,
    etat,
    priorité,
    date_debut,
    date_fin,
    id_compte,
    id_tache,
  ];

  client.query(sqlQuery, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'insertion des données  Taches----:", err);
      res.status(500).send("Erreur lors de l'insertion des données");
    } else {
      console.log("Données insérées avec succès Taches.");
      res.status(200).send("Données insérées avec succès Taches");
    }
  });
});

//update task task
app.post("/update-tache", (req, res) => {
  const { id_tache, titre, description, etat, priorité, date_debut, date_fin } =
    req.body; // Remplacez champ1, champ2, champ3 par les noms de vos champs de formulaire

  const sqlQuery =
    "UPDATE taches SET titre = $2, description = $3, etat = $4, priorité = $5, date_debut = $6, date_fin = $7 WHERE id_tache = $1";

  const values = [
    id_tache,
    titre,
    description,
    etat,
    priorité,
    date_debut,
    date_fin,
  ];

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
    const id_tache = req.body.id_tache;
    //const titreToDelete = req.body.titre;

    const sql_delete_tache = "DELETE FROM taches WHERE id_tache = $1";
    const result = client.query(sql_delete_tache, [id_tache]);

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

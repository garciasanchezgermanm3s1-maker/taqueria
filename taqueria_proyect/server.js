const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient } = require("mongodb");
const path = require("path");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Servir archivos estáticos

// Conexión a MongoDB
const uri = "mongodb://localhost:27017"; // tu MongoDB local
const client = new MongoClient(uri);

async function conectar() {
  try {
    await client.connect();
    console.log("✅ Conectado a MongoDB");
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
  }
}

async function iniciarServidor() {
  await conectar();
  const db = client.db("taqueria"); // nombre de tu base
  const usuarios = db.collection("usuario"); // colección (tabla)

  // Servir página de login
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "login.html"));
  });

  // Ruta para login
  app.post("/login", async (req, res) => {
    try {
      const { usuario, contrasena } = req.body;
      const usuarioEncontrado = await usuarios.findOne({ nombre: usuario, contrasena: contrasena });
      if (usuarioEncontrado) {
        res.send("Bienvenido " + usuarioEncontrado.nombre + " 😃");
      } else {
        res.send("Usuario o contraseña incorrectos ❌");
      }
    } catch (error) {
      console.error("Error en login:", error);
      res.status(500).send("Error en el servidor");
    }
  });

  // Ruta para registro
  app.post("/registro", async (req, res) => {
    try {
      const { nombre, contrasena } = req.body;
      await usuarios.insertOne({ nombre, contrasena });
      res.send("Usuario registrado con éxito 🎉");
    } catch (error) {
      console.error("Error en registro:", error);
      res.status(500).send("Error al registrar");
    }
  });

  // Iniciar servidor
  app.listen(3000, () => {
    console.log("🚀 Servidor corriendo en http://localhost:3000");
  });
}

iniciarServidor();


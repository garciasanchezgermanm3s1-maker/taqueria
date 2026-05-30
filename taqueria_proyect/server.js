const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Usuario = require("./models/usuario");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Conexión a MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/taqueria", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("✅ Conectado a MongoDB"))
.catch(err => console.error("❌ Error de conexión:", err));

// Servir archivos estáticos (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Ruta para procesar login
app.post("/login", async (req, res) => {
  const { usuario, contrasena } = req.body;

  try {
    const user = await Usuario.findOne({ nombre: usuario, contrasena: contrasena });
    if (user) {
      res.send("✅ Login exitoso, bienvenido " + user.nombre);
    } else {
      res.send("❌ Usuario o contraseña incorrectos");
    }
  } catch (err) {
    res.status(500).send("Error en el servidor");
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});

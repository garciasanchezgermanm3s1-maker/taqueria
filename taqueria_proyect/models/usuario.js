const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  id: Number,
  nombre: String,
  apellidos: String,
  contrasena: String
});

module.exports = mongoose.model("Usuario", usuarioSchema);

const express = require("express");
const cors = require("cors");
const autos = require("./data/autos.json");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const normalizar = (texto) =>
  String(texto).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();

app.get("/", (req, res) => {
  res.json({
    servicio: "API Catálogo de Autos",
    version: "1.0.0",
    descripcion: "Microservicio web REST que recupera un catálogo básico de autos",
    rutas: [
      { metodo: "GET", ruta: "/api/autos", descripcion: "Lista todos los autos; acepta filtros por query string" },
      { metodo: "GET", ruta: "/api/autos/:id", descripcion: "Obtiene un auto por su identificador" },
      { metodo: "GET", ruta: "/api/marcas", descripcion: "Lista las marcas disponibles en el catálogo" },
      { metodo: "GET", ruta: "/health", descripcion: "Verifica el estado del servicio" }
    ],
    filtros: ["marca", "modelo", "anio", "color", "precioMin", "precioMax", "orden (precio|anio)", "dir (asc|desc)"]
  });
});

app.get("/health", (req, res) => {
  res.json({ estado: "ok", fecha: new Date().toISOString() });
});

app.get("/api/autos", (req, res) => {
  const { marca, modelo, anio, color, precioMin, precioMax, orden, dir } = req.query;

  for (const [nombre, valor] of Object.entries({ anio, precioMin, precioMax })) {
    if (valor !== undefined && isNaN(Number(valor))) {
      return res.status(400).json({ error: `El parámetro ${nombre} debe ser numérico` });
    }
  }

  let resultado = autos.filter((auto) =>
    (!marca || normalizar(auto.marca) === normalizar(marca)) &&
    (!modelo || normalizar(auto.modelo).includes(normalizar(modelo))) &&
    (!anio || auto.anio === Number(anio)) &&
    (!color || normalizar(auto.color) === normalizar(color)) &&
    (!precioMin || auto.precio >= Number(precioMin)) &&
    (!precioMax || auto.precio <= Number(precioMax))
  );

  if (orden === "precio" || orden === "anio") {
    const factor = dir === "desc" ? -1 : 1;
    resultado = [...resultado].sort((a, b) => (a[orden] - b[orden]) * factor);
  }

  res.json({ total: resultado.length, datos: resultado });
});

app.get("/api/autos/:id", (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id)) {
    return res.status(400).json({ error: "El id debe ser un número entero" });
  }
  const auto = autos.find((a) => a.id === id);
  if (!auto) {
    return res.status(404).json({ error: `No existe un auto con id ${id}` });
  }
  res.json(auto);
});

app.get("/api/marcas", (req, res) => {
  const marcas = [...new Set(autos.map((a) => a.marca))].sort();
  res.json({ total: marcas.length, datos: marcas });
});

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.listen(PORT, () => {
  console.log(`Servicio de catálogo de autos escuchando en el puerto ${PORT}`);
});

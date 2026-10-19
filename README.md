# API Catálogo de Autos

Microservicio web REST desarrollado con Node.js y Express que recupera un catálogo básico de autos con los atributos marca, modelo, año, precio y color.

## Ejecución local

```bash
npm install
npm start
```

El servicio escucha en el puerto definido por la variable `PORT` (3000 por defecto).

## Rutas

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Información del servicio y listado de rutas |
| GET | `/health` | Estado del servicio |
| GET | `/api/autos` | Lista el catálogo completo |
| GET | `/api/autos/:id` | Obtiene un auto por su id |
| GET | `/api/marcas` | Lista las marcas disponibles |

### Filtros de `/api/autos`

| Parámetro | Ejemplo | Descripción |
|---|---|---|
| `marca` | `?marca=toyota` | Marca exacta, sin distinguir mayúsculas ni acentos |
| `modelo` | `?modelo=cor` | Coincidencia parcial del modelo |
| `anio` | `?anio=2024` | Año del modelo |
| `color` | `?color=rojo` | Color exacto |
| `precioMin` / `precioMax` | `?precioMin=300000&precioMax=500000` | Rango de precio en MXN |
| `orden` / `dir` | `?orden=precio&dir=desc` | Ordena por `precio` o `anio`, ascendente o descendente |

### Ejemplo de respuesta

```json
{
  "total": 1,
  "datos": [
    { "id": 3, "marca": "Mazda", "modelo": "Mazda 3", "anio": 2024, "precio": 429900, "color": "Rojo" }
  ]
}
```

### Códigos de estado

- `200` Solicitud correcta
- `400` Parámetro inválido
- `404` Auto o ruta no encontrada

## Despliegue

Publicado en Render como Web Service con runtime Node, comando de build `npm install` y comando de inicio `node server.js`.

import express from 'express';
const app = express();
const PORT = 8080;
app.use(express.json());

// Datos de ejemplo
let usuarios = [
    { id: 1, nombre: 'Juan', edad: 28 },
    { id: 2, nombre: 'Ana', edad: 22 },
    { id: 3, nombre: 'Luis', edad: 35 }
];

app.get('/', (req, res) => {
    res.send('Hola mundo');
});

app.get('/usuarios', (req, res) => {
    res.json(usuarios);
});

app.post('/usuarios', (req, res) => {

    const nuevoUsuario = req.body;

    if (!nuevoUsuario.nombre || !nuevoUsuario.edad) {
        return res.status(400).json({ error: 'Faltan datos del usuario' });
    }

    nuevoUsuario.id = usuarios.length + 1;

    usuarios.push(nuevoUsuario);
    res.status(201).json(nuevoUsuario);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
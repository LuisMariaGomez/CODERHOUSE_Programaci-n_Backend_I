import express from 'express';

const app = express();
const PORT = 8080;

app.use(express.json());

// "Base de datos"

let products = [
  {
    id: 1,
    title: "Camiseta Negra",
    description: "Camiseta de algodón 100% color negro.",
    code: "C001",
    price: 15.99,
    status: true,
    stock: 50,
    category: "ropa",
    thumbnails: ["/img/camiseta-negra.png"]
  },
  {
    id: 2,
    title: "Pantalón Jeans",
    description: "Pantalón denim azul estilo clásico.",
    code: "P001",
    price: 39.99,
    status: true,
    stock: 25,
    category: "ropa",
    thumbnails: ["/img/jeans.png"]
  }
];

let carts = []; // { id, products: [ { product, quantity } ] }


// Controladores simples para id de productos y carritos

let lastProductId = products.length;

function generateProductId() {
  lastProductId++;
  return lastProductId;
}

let lastCartId = 0;

function generateCartId() {
  lastCartId++;
  return lastCartId;
}

// Rutas

app.get('/', (req, res) => { 
  res.send('Servidor ejecutándose en http://localhost:8080');
 });

// Rutas de productos

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:pid', (req, res) => {
  const pid = Number(req.params.pid);   // <--- convertir a número SI o SI

  const product = products.find(p => p.id === pid);

  if (!product) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.json(product);
});



app.post('/api/products', (req, res) => {
  const required = ["title","description","code","price","status","stock","category","thumbnails"]; //para no tener que poner uno por uno los campos en if's y que diga que falta ese en particular

  for (const field of required) {
    if (!(field in req.body)) { // Onda si no lo encuentra en el body salta el error, auqnue bueno, encuentra el primer campo que falta, si falta más de uno solo dirá el primero
      return res.status(400).json({ error: `Falta el campo: ${field}` });
    }
  }

  const newProduct = {
    id: generateProductId(),
    ...req.body // copio todos los campos del body asi no los pongo uno por uno
  };

  products.push(newProduct);
  res.status(201).json(newProduct);
});

app.put('/api/products/:pid', (req, res) => {
  const pid = Number(req.params.pid);

  const indice = products.findIndex(p => p.id === pid);

  if (indice === -1) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  const product_mod = { ...products[indice], ...req.body };
  product_mod.id = products[indice].id; // No modificar el id

  products[indice] = product_mod;

  res.json(product_mod);
});


app.delete('/api/products/:pid', (req, res) => {
    const pid = Number(req.params.pid);

    const initialLength = products.length;

    products = products.filter(p => p.id !== pid);

    if (products.length === initialLength) {
        return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado" });
});

// Rutas de carritos

app.post('/api/carts', (req, res) => {
  const newCart = {
    id: generateCartId(),
    products: []
  };

  carts.push(newCart);
  res.status(201).json(newCart);
});

app.get('/api/carts/:cid', (req, res) => {
    const cid = Number(req.params.cid);
    const cart = carts.find(c => c.id === cid);

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    res.json(cart.products);
});

app.post('/api/carts/:cid/product/:pid', (req, res) => {
    const cid = Number(req.params.cid);

    const cart = carts.find(c => c.id === cid);

    if (!cart) {
        return res.status(404).json({ error: "Carrito no encontrado" });
    }

    const pid = Number(req.params.pid);

    const product = products.find(p => p.id === pid);

    if (!product) {
        return res.status(404).json({ error: "Producto no existe" });
    }

    const existing = cart.products.find(p => p.product === pid);

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.products.push({ product: pid, quantity: 1 });
    }

    res.json(cart);
});

// -------------------------------------------------------

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});

# PROYECTO FINAL ECOMMERCE PASARELA DE PAGO

- Proyecto Final de Backend de CODERHOUSE
- Ecommerce
- Se usa Node JS Express, Router y websocket
- Se MongoDB y Mongoose
- Se usa websocket para un CHAT Comunitario

## Para clonar el repositorio ejecute

```
git clone https://github.com/javalos87/PF3.git

```

### Para correrlo ejecutar el siguiente comando

```
npm start

```

### API CARTS

Metodo GET
Endpoint /api/carts
Endpoint /api/carts/id

Metodo POST
Endpoint /api/carts/id/products

### API PRODUCTS

Metodo GET
Endpoint /api/products
Endpoint /api/products/id

Metodo POST
Endpoint /api/products/
Ejemplo
{ "title": "Samsung A8",
"description": "Celular Samsung A8",
"code": "abc8636",
"price": "150000",
"stock": "60",
"category": "celulares",
"status": true,
"thumbnails": [
"C:\\Users\\Desktop\\Backend\\PF2\\src\\public\\img\\captura.png"
]
}

Metodo PUT
Endpoint /api/products/id
Ejemplo
{
"title": "Samsung A10",  
}

Metodo DELETE
Endpoint /api/products/id

import express from "express";
import IndexRoute from "./routes/index.router.js";
import CartRoute from "./routes/cart.router.js";
import ProductsRoute from "./routes/products.router.js";
import MessagesRoute from "./routes/messages.js";
import __dirname from "./utils.js";
import mongoose from "mongoose";
import path from "path";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.js";
import { Server } from "socket.io";
import Messages from "../src/dao/db/manager/messages.js";

const app = express();
const port = 8080;

// Cadena de Conexion a la BD
mongoose.connect(
  "mongodb+srv://CHBack:A1svajZkX7apkmwC@chbackend.prxbo9w.mongodb.net/ecommerce"
);
// Instancia a la clase
const messages = new Messages();

//Settings
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Carpeta static
app.use(express.static(`${__dirname}/public`));

//Settings Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

//Routes
app.use(IndexRoute);
app.use(CartRoute);
app.use(ProductsRoute);
app.use("/api/messages", MessagesRoute);
app.use("/", viewsRouter);

const server = app.listen(port, (req, res) => {
  console.log(`Server levantado sobre puerto: ${port}`);
});

//Settings Socket.io

const io = new Server(server);
io.on("connection", async (socket) => {
  console.log("Nuevo cliente");
  socket.on("message", async (data) => {
    messages.saveMessage(data);
    io.emit("messageLogs", await messages.getAll());
  });
  socket.on("authenticated", (data) => {
    socket.broadcast.emit("newUserConnected", data);
  });
  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});

import { Router } from "express";
import { messagesModel } from "../dao/db/models/messages.js";

const router = Router();
router.get("/", async (req, res) => {
  try {
    let messages = await messagesModel.find();
    res.send({ result: "success", payload: messages });
  } catch (error) {
    console.log("Error de conexion: ", error);
  }
});

router.post("/", async (req, res) => {
  const { user, messages } = req.body;
  let result = messagesModel.create({ user, messages });
  try {
    let messages = await messagesModel.find();
    res.send({ result: "success", payload: messages });
  } catch (error) {
    console.log("Error de conexion: ", error);
  }
});

export default router;

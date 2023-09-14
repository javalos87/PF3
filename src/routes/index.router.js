import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.send("La conexion es exitosa");
});

export default router;

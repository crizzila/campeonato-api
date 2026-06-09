import { Router } from "express"
import { listarPartidas, criarPartida, atualizarPlacar, classificacao } from "../controllers/partidas.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/", listarPartidas)
router.get("/classificacao", classificacao)
router.post("/", authMiddleware, criarPartida)
router.put("/:id", authMiddleware, atualizarPlacar)

export default router 




import { Router } from "express"
import { listarJogadores, buscarJogador, criarJogador, atualizarJogador, deletarJogador } from "../controllers/jogadores.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/", listarJogadores)
router.get("/:id", buscarJogador)
router.post("/", authMiddleware, criarJogador)
router.put("/:id", authMiddleware, atualizarJogador)
router.delete("/:id", authMiddleware, deletarJogador)

export default router
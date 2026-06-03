import { Router } from "express"
import { listarTimes, buscarTime, criarTime, atualizarTime, deletarTime } from "../controllers/times.controller.js"
import { authMiddleware } from "../middlewares/auth.middleware.js"

const router = Router()

router.get("/", listarTimes)
router.get("/:id", buscarTime)
router.post("/", authMiddleware, criarTime)
router.put("/:id", authMiddleware, atualizarTime)
router.delete("/:id", authMiddleware, deletarTime)

export default router
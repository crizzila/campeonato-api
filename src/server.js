import "dotenv/config"
import express from "express"
import authRoutes from "./routes/auth.routes.js"
import timesRoutes from "./routes/times.routes.js"
import jogadoresRoutes from "./routes/jogadores.routes.js"
import partidasRoutes from "./routes/partidas.routes.js"

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.use("/auth", authRoutes)
app.use("/times", timesRoutes)
app.use("/jogadores", jogadoresRoutes)
app.use("/partidas", partidasRoutes)

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
});
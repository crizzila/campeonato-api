import prisma from "../lib/prisma.js"

export async function listarPartidas(req, res) {
  try {
    const partidas = await prisma.partida.findMany({
      include: {
        mandante: true,
        visitante: true,
      },
    })
    return res.status(200).json(partidas)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function criarPartida(req, res) {
  const { mandanteId, visitanteId, dataPartida } = req.body

  if (!mandanteId || !visitanteId || !dataPartida) {
    return res.status(400).json({ erro: "mandanteId, visitanteId e dataPartida são obrigatórios" })
  }

  if (Number(mandanteId) === Number(visitanteId)) {
    return res.status(400).json({ erro: "Um time não pode jogar contra si mesmo" })
  }

  try {
    const mandante = await prisma.time.findUnique({ where: { id: Number(mandanteId) } })
    if (!mandante) {
      return res.status(404).json({ erro: "Time mandante não encontrado" })
    }

    const visitante = await prisma.time.findUnique({ where: { id: Number(visitanteId) } })
    if (!visitante) {
      return res.status(404).json({ erro: "Time visitante não encontrado" })
    }

    const partida = await prisma.partida.create({
      data: {
        mandanteId: Number(mandanteId),
        visitanteId: Number(visitanteId),
        dataPartida: new Date(dataPartida),
      },
      include: {
        mandante: true,
        visitante: true,
      },
    })

    return res.status(201).json(partida)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function atualizarPlacar(req, res) {
  const { id } = req.params
  const { golsMandante, golsVisitante, status } = req.body

  if (golsMandante === undefined || golsVisitante === undefined) {
    return res.status(400).json({ erro: "golsMandante e golsVisitante são obrigatórios" })
  }

  if (Number(golsMandante) < 0 || Number(golsVisitante) < 0) {
    return res.status(400).json({ erro: "Gols não podem ser negativos" })
  }

  const statusValidos = ["agendada", "em_andamento", "finalizada"]
  if (status && !statusValidos.includes(status)) {
    return res.status(400).json({ erro: "Status inválido. Use: agendada, em_andamento ou finalizada" })
  }

  try {
    const partida = await prisma.partida.findUnique({ where: { id: Number(id) } })
    if (!partida) {
      return res.status(404).json({ erro: "Partida não encontrada" })
    }

    const partidaAtualizada = await prisma.partida.update({
      where: { id: Number(id) },
      data: {
        golsMandante: Number(golsMandante),
        golsVisitante: Number(golsVisitante),
        status: status || partida.status,
      },
      include: {
        mandante: true,
        visitante: true,
      },
    })

    return res.status(200).json(partidaAtualizada)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function classificacao(req, res) {
  try {
    const times = await prisma.time.findMany();
    const partidas = await prisma.partida.findMany({
      where: { status: "finalizada" },
    })

    const tabela = times.map((time) => {
      const jogos = partidas.filter(
        (p) => p.mandanteId === time.id || p.visitanteId === time.id
      );

      let pontos = 0, vitorias = 0, empates = 0, derrotas = 0;
      let golsPro = 0, golsContra = 0;

      jogos.forEach((p) => {
        const isMandante = p.mandanteId === time.id
        const golesFavor = isMandante ? p.golsMandante : p.golsVisitante
        const golesContra = isMandante ? p.golsVisitante : p.golsMandante

        golsPro += golesFavor;
        golsContra += golesContra;

        if (golesFavor > golesContra) {
          pontos += 3;
          vitorias++;
        } else if (golesFavor === golesContra) {
          pontos += 1;
          empates++;
        } else {
          derrotas++;
        }
      })

      return {
        time: time.nome,
        cidade: time.cidade,
        jogos: jogos.length,
        pontos,
        vitorias,
        empates,
        derrotas,
        golsPro,
        golsContra,
        saldoGols: golsPro - golsContra,
      }
    })

    tabela.sort((a, b) => {
      if (b.pontos !== a.pontos) return b.pontos - a.pontos
      if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias
      return b.saldoGols - a.saldoGols;
    })

    return res.status(200).json(tabela)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}
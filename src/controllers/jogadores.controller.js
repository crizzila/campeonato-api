import prisma from "../lib/prisma.js"

export async function listarJogadores(req, res) {
  try {
    const jogadores = await prisma.jogador.findMany({
      include: { time: true },
    })
    return res.status(200).json(jogadores)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function buscarJogador(req, res) {
  const { id } = req.params;

  try {
    const jogador = await prisma.jogador.findUnique({
      where: { id: Number(id) },
      include: { time: true },
    });

    if (!jogador) {
      return res.status(404).json({ erro: "Jogador não encontrado" })
    }

    return res.status(200).json(jogador)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function criarJogador(req, res) {
  const { nome, posicao, numero, timeId } = req.body;

  if (!nome || !posicao || !numero || !timeId) {
    return res.status(400).json({ erro: "Nome, posição, número e timeId são obrigatórios" })
  }

  try {
    const time = await prisma.time.findUnique({ where: { id: Number(timeId) } })
    if (!time) {
      return res.status(404).json({ erro: "Time não encontrado" })
    }

    const jogador = await prisma.jogador.create({
      data: {
        nome,
        posicao,
        numero: Number(numero),
        timeId: Number(timeId),
      },
    })

    return res.status(201).json(jogador)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function atualizarJogador(req, res) {
  const { id } = req.params;
  const { nome, posicao, numero, timeId } = req.body;

  if (!nome || !posicao || !numero || !timeId) {
    return res.status(400).json({ erro: "Nome, posição, número e timeId são obrigatórios" })
  }

  try {
    const jogador = await prisma.jogador.findUnique({ where: { id: Number(id) } })
    if (!jogador) {
      return res.status(404).json({ erro: "Jogador não encontrado" })
    }

    const time = await prisma.time.findUnique({ where: { id: Number(timeId) } })
    if (!time) {
      return res.status(404).json({ erro: "Time não encontrado" })
    }

    const jogadorAtualizado = await prisma.jogador.update({
      where: { id: Number(id) },
      data: {
        nome,
        posicao,
        numero: Number(numero),
        timeId: Number(timeId),
      },
    });

    return res.status(200).json(jogadorAtualizado)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function deletarJogador(req, res) {
  const { id } = req.params;

  try {
    const jogador = await prisma.jogador.findUnique({ where: { id: Number(id) } })
    if (!jogador) {
      return res.status(404).json({ erro: "Jogador não encontrado" })
    }

    await prisma.jogador.delete({ where: { id: Number(id) } })

    return res.status(200).json({ mensagem: "Jogador deletado com sucesso" })
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}
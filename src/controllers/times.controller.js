import prisma from "../lib/prisma.js"

export async function listarTimes(req, res) {
  try {
    const times = await prisma.time.findMany({
      include: { jogadores: true },
    });
    return res.status(200).json(times)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function buscarTime(req, res) {
  const { id } = req.params;

  try {
    const time = await prisma.time.findUnique({
      where: { id: Number(id) },
      include: { jogadores: true },
    });

    if (!time) {
      return res.status(404).json({ erro: "Time não encontrado" })
    }

    return res.status(200).json(time);
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function criarTime(req, res) {
  const { nome, cidade, escudo } = req.body;

  if (!nome || !cidade) {
    return res.status(400).json({ erro: "Nome e cidade são obrigatórios" })
  }

  try {
    const timeExistente = await prisma.time.findUnique({ where: { nome } })
    if (timeExistente) {
      return res.status(409).json({ erro: "Já existe um time com esse nome" })
    }

    const time = await prisma.time.create({
      data: { nome, cidade, escudo },
    });

    return res.status(201).json(time)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function atualizarTime(req, res) {
  const { id } = req.params;
  const { nome, cidade, escudo } = req.body;

  if (!nome || !cidade) {
    return res.status(400).json({ erro: "Nome e cidade são obrigatórios" })
  }

  try {
    const time = await prisma.time.findUnique({ where: { id: Number(id) } })
    if (!time) {
      return res.status(404).json({ erro: "Time não encontrado" })
    }

    const timeAtualizado = await prisma.time.update({
      where: { id: Number(id) },
      data: { nome, cidade, escudo },
    });

    return res.status(200).json(timeAtualizado)
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}

export async function deletarTime(req, res) {
  const { id } = req.params;

  try {
    const time = await prisma.time.findUnique({ where: { id: Number(id) } })
    if (!time) {
      return res.status(404).json({ erro: "Time não encontrado" })
    }

    await prisma.time.delete({ where: { id: Number(id) } })

    return res.status(200).json({ mensagem: "Time deletado com sucesso" })
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}
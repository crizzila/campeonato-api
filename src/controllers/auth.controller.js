import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import prisma from "../lib/prisma.js"


export async function register(req, res) {
  const { nome, email, senha } = req.body

  if (!nome || !email || !senha) {
    return res.status(400).json({ erro: "Nome, email e senha são obrigatórios" })
  }

  try {
    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } })
    if (usuarioExistente) {
      return res.status(409).json({ erro: "Email já cadastrado" })
    }

    const senhaHash = await bcrypt.hash(senha, 10) 
    const usuario = await prisma.usuario.create({
      data: { nome, email, senha: senhaHash },
    });

    return res.status(201).json({ mensagem: "Usuário criado com sucesso", id: usuario.id })
  }  catch (error) {
    console.error(error)
    return res.status(500).json({ erro: error.message })
}
}

export async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: "Email e senha são obrigatórios" })
  }

  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) {
      return res.status(401).json({ erro: "Credenciais inválidas" })
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha)
    if (!senhaValida) {
      return res.status(401).json({ erro: "Credenciais inválidas" })
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: "8h" })

    return res.status(200).json({ mensagem: "Login realizado com sucesso", token })
  } catch (error) {
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
}
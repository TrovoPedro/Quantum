const express = require('express');
const multer = require('multer');
const path = require('path');
const { pool } = require('./db'); // Supondo que você tenha uma configuração de banco de dados

const app = express();
app.use(express.json());

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/'); // Diretório onde as imagens serão salvas
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extensão do arquivo
    const filename = `${Date.now()}${ext}`; // Nome único para o arquivo
    cb(null, filename); // Define o nome do arquivo no diretório
  }
});

const upload = multer({ storage });

// Rota para fazer upload da imagem
app.post('/upload-imagem', upload.single('imagem'), (req, res) => {
  const { idUsuario } = req.body; // ID do usuário a ser atualizado
  const nomeImagem = req.file.filename; // Nome do arquivo gerado pelo Multer

  // Atualiza o banco de dados com o nome da imagem
  const query = 'UPDATE usuarios SET imagemPerfil = $1 WHERE idUsuario = $2';
  pool.query(query, [nomeImagem, idUsuario], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao atualizar imagem' });
    }
    res.status(200).json({ message: 'Imagem atualizada com sucesso' });
  });
});
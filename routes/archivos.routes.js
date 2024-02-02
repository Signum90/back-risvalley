const { Router } = require('express');
const express = require('express');
const CryptoJS = require('crypto-js')
const fs = require('fs');
const path = require('path');
const router = Router();
const Middlewares = require('../middlewares/middlewares');
const { secret } = require('../config/config');

//■► RUTEO: ===================================== ◄■:
router.use("/", express.static(path.join(__dirname, '../public/files')));

// router.get('/:nombreArchivo', (req, res) => {
//     const fileName = req.params.nombreArchivo;
//     const pathFile = path.join('public/files', fileName);
//     if (!fs.existsSync(pathFile)) {
//         return res.status(404).json({ mensaje: 'Archivo no encontrado' });
//     }
//     const contenido = fs.readFileSync(pathFile);
//     const encrypted = CryptoJS.AES.encrypt(JSON.stringify(contenido), secret).toString();
//     const decrypted = CryptoJS.AES.decrypt(encrypted, secret);
//     const decryptedData = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
//     res.json({ decryptedData });
//     //res.json(decryptedData.data);
// });



module.exports = router;
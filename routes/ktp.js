const express = require('express');
const router = express.Router();

// Import express-validator
const { body, validationResult } = require('express-validator');

// Import database
const connection = require('../config/db');

// Define allowed values for agama and jenis_kelamin
const allowedAgamaValues = ['ISLAM', 'KRISTEN'];
const allowedJenisKelaminValues = ['PEREMPUAN', 'LAKI-LAKI'];

// Function Create data
router.post('/create', [
  // Validation
  body('nik').notEmpty(),
  body('nama_lengkap').notEmpty(),
  body('tempat_lahir').notEmpty(),
  body('tanggal_lahir').notEmpty(),
  body('pendidikan').notEmpty(),
  body('jenis_pekerjaan').notEmpty(),
  body('golongan_darah').notEmpty(),
  body('kewarganegaraan').notEmpty(),
  // Custom validation for agama and jenis_kelamin
  body('agama').custom((value) => {
    if (!allowedAgamaValues.includes(value)) {
      throw new Error('Invalid value for agama. Only ISLAM or KRISTEN allowed.');
    }
    return true;
  }),
  body('jenis_kelamin').custom((value) => {
    if (!allowedJenisKelaminValues.includes(value)) {
      throw new Error('Invalid value for jenis_kelamin. Only PEREMPUAN or LAKI-LAKI allowed.');
    }
    return true;
  }), 
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  let Data = {
    nik: req.body.nik,
    nama_lengkap: req.body.nama_lengkap,
    jenis_kelamin: req.body.jenis_kelamin,
    tempat_lahir: req.body.tempat_lahir,
    tanggal_lahir: req.body.tanggal_lahir,
    agama: req.body.agama,
    pendidikan: req.body.pendidikan,
    jenis_pekerjaan: req.body.jenis_pekerjaan,
    golongan_darah: req.body.golongan_darah,
    kewarganegaraan: req.body.kewarganegaraan,
  };
  connection.query('INSERT INTO ktp SET ?', Data, function (err, rows) {
    if (err) {
      console.log(err);
      return res.status(500).json({
        status: false,
        message: 'Server Error',
      });
    } else {
      return res.status(201).json({
        status: true,
        message: 'Insert Data Success...',
      });
    }
  });
});

// Function Read data
router.get('/', function (req, res) {
  connection.query('SELECT * FROM ktp ORDER BY nik DESC', function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Failed',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data KTP',
        data: rows,
      });
    }
  });
});

// Function Update data
router.patch('/update/:nik', [
  // Validation
  body('nik').notEmpty(),
  body('nama_lengkap').notEmpty(),
  body('tempat_lahir').notEmpty(),
  body('tanggal_lahir').notEmpty(),
  body('pendidikan').notEmpty(),
  body('jenis_pekerjaan').notEmpty(),
  body('golongan_darah').notEmpty(),
  body('kewarganegaraan').notEmpty(),
  // Custom validation for agama and jenis_kelamin
body('agama').custom((value) => {
  if (!allowedAgamaValues.includes(value)) {
    throw new Error('Invalid value for agama. Only ISLAM or KRISTEN allowed.');
  }
  return true;
}),
body('jenis_kelamin').custom((value) => {
  if (!allowedJenisKelaminValues.includes(value)) {
    throw new Error('Invalid value for jenis_kelamin. Only PEREMPUAN or LAKI-LAKI allowed.');
  }
  return true;
}),

], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errors: errors.array(),
    });
  }
  let nik = req.params.nik;
  let Data = {
    nik: req.body.nik,
    nama_lengkap: req.body.nama_lengkap,
    jenis_kelamin: req.body.jenis_kelamin,
    tempat_lahir: req.body.tempat_lahir,
    tanggal_lahir: req.body.tanggal_lahir,
    agama: req.body.agama,
    pendidikan: req.body.pendidikan,
    jenis_pekerjaan: req.body.jenis_pekerjaan,
    golongan_darah: req.body.golongan_darah,
    kewarganegaraan: req.body.kewarganegaraan,
  };
  connection.query(`UPDATE ktp SET ? WHERE nik = ${nik}`, Data, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Update Success..!',
      });
    }
  });
});

// Function Delete data
router.delete('/delete/:nik', function (req, res) {
  let nik = req.params.nik;
  connection.query(`DELETE FROM ktp WHERE nik = ${nik}`, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Error',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Delete Success..!',
      });
    }
  });
});

// Function Search data
router.get('/search/:nik', function (req, res) {
  let nik = req.params.nik;

  connection.query(`SELECT * FROM ktp WHERE nik = ${nik}`, function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Error',
      });
    }
    if (rows.length <= 0) {
      return res.status(404).json({
        status: false,
        message: 'Not Found',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data KTP',
        data: rows[0],
      });
    }
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();

// Import express-validator
const { body, validationResult } = require('express-validator');

// Import database
const connection = require('../config/db');

// Function to execute SQL queries
function queryAsync(query, params) {
  return new Promise((resolve, reject) => {
    connection.query(query, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
}

// Function Read data
router.get('/', function (req, res) {
  connection.query('SELECT * FROM detail_kk ORDER BY id_detail DESC', function (err, rows) {
    if (err) {
      return res.status(500).json({
        status: false,
        message: 'Server Failed',
      });
    } else {
      return res.status(200).json({
        status: true,
        message: 'Data Detail Keluarga',
        data: rows,
      });
    }
  });
});

// Function Create data
router.post('/create', [
    // Validation
    body('no_kk').notEmpty(),
    body('nik').notEmpty(),
    body('status_hubungan_dalam_keluarga')
      .notEmpty()
      .custom((value) => {
        // Memeriksa apakah nilai adalah salah satu dari tiga pilihan yang diizinkan
        if (['kepala-keluarga', 'istri', 'anak'].includes(value)) {
          return true;
        }
        throw new Error('Status hubungan dalam keluarga tidak valid');
      }),
  ], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }

  let Data = {
    no_kk: req.body.no_kk,
    nik: req.body.nik,
    status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
  };

  // Fetch 'ayah' and 'ibu' from 'ktp' based on 'nik'
  const queryKtp = `SELECT ayah, ibu FROM ktp WHERE nik = ?`;
  try {
    const ktpData = await queryAsync(queryKtp, [Data.nik]);

    if (ktpData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Data not found in ktp table',
      });
    }

    Data.ayah = ktpData[0].ayah;
    Data.ibu = ktpData[0].ibu;

    // Fetch 'no_kk' from 'kk' based on 'no_kk'
    const queryKk = `SELECT no_kk FROM kk WHERE no_kk = ?`;
    const kkData = await queryAsync(queryKk, [Data.no_kk]);

    if (kkData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Data not found in kk table',
      });
    }

    // Now, you can insert 'Data' into 'detail_kk'
    const insertQuery = `INSERT INTO detail_kk (no_kk, nik, status_hubungan_dalam_keluarga, ayah, ibu) VALUES (?, ?, ?, ?, ?)`;
    connection.query(
      insertQuery,
      [Data.no_kk, Data.nik, Data.status_hubungan_dalam_keluarga, Data.ayah, Data.ibu],
      function (err, rows) {
        if (err) {
          return res.status(500).json({
            status: false,
            message: 'Server Error',
          });
        } else {
          return res.status(201).json({
            status: true,
            message: 'Create Data Success...',
          });
        }
      }
    );
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: err.message,
    });
    }
});

// Function Search data berdasarkan id_detail
router.get('/search/:id_detail', function (req, res) {
  let id_detail = req.params.id_detail;

  connection.query(`SELECT * FROM detail_kk WHERE id_detail = ${id_detail}`, function (err, rows) {
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
        message: 'Data Detail Keluarga',
        data: rows[0],
      });
    }
  });
});


// Function Update data
router.patch('/update/:id_detail', [
    body('no_kk').notEmpty(),
    body('nik').notEmpty(),
    body('status_hubungan_dalam_keluarga')
      .notEmpty()
      .custom((value) => {
        // Memeriksa apakah nilai adalah salah satu dari tiga pilihan yang diizinkan
        if (['kepala-keluarga', 'istri', 'anak'].includes(value)) {
          return true;
        }
        throw new Error('Status hubungan dalam keluarga tidak valid');
      }),
  ], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(422).json({
        error: error.array(),
      });
    }
  
    let id_detail = req.params.id_detail;
    let Data = {
      no_kk: req.body.no_kk,
      nik: req.body.nik,
      status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
    };

  // Fetch 'ayah' and 'ibu' from 'ktp' based on 'nik'
  const queryKtp = `SELECT ayah, ibu FROM ktp WHERE nik = ?`;
  try {
    const ktpData = await queryAsync(queryKtp, [Data.nik]);

    if (ktpData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Data not found in ktp table',
      });
    }

    Data.ayah = ktpData[0].ayah;
    Data.ibu = ktpData[0].ibu;

    // Fetch 'no_kk' from 'kk' based on 'no_kk'
    const queryKk = `SELECT no_kk FROM kk WHERE no_kk = ?`;
    const kkData = await queryAsync(queryKk, [Data.no_kk]);

    if (kkData.length === 0) {
      return res.status(404).json({
        status: false,
        message: 'Data not found in kk table',
      });
    }

    // Now, you can update 'Data' in 'detail_kk'
    const updateQuery = `UPDATE detail_kk SET no_kk = ?, nik = ?, status_hubungan_dalam_keluarga = ?, ayah = ?, ibu = ? WHERE id_detail = ?`;
    connection.query(
      updateQuery,
      [Data.no_kk, Data.nik, Data.status_hubungan_dalam_keluarga, Data.ayah, Data.ibu, id_detail],
      function (err, rows) {
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
      }
    );
  } catch (err) {
    return res.status(500).json({
      status: false,
      message: 'Server Error',
    });
  }
});

// Function Delete data
router.delete('/delete/:id_detail', function (req, res) {
  let id_detail = req.params.id_detail;
  connection.query(`DELETE FROM detail_kk WHERE id_detail = ${id_detail}`, function (err, rows) {
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

module.exports = router;

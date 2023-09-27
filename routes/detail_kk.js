const express = require('express');
const router = express.Router();

//import express-validator
const { body, validationResult } = require('express-validator');

//import database
const connection = require('../config/db');

// Function Create Data
router.post('/create', [
    // Validation
    body('no_kk').notEmpty(),
    body('nik').notEmpty(),
    body('status_hubungan_dalam_keluarga').notEmpty(),
    body('ayah').notEmpty(),
    body('ibu').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let data = {
        no_kk: req.body.no_kk,
        nik: req.body.nik,
        status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
        ayah: req.body.ayah,
        ibu: req.body.ibu
    };
    connection.query('INSERT INTO detail_kk SET ?', data, function (err, result) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else {
            return res.status(201).json({
                status: true,
                message: 'Data detail_kk berhasil ditambahkan',
                insertedId: result.insertId
            });
        }
    });
});

// Function Read All Data
router.get('/', function (req, res) {
    connection.query(' SELECT kartu_keluarga.no_kk, ktp.nama_lengkap AS nama, ' +
    ' detail_kk.status_hubungan_dalam_keluarga, ' +
    ' ayah.nama_lengkap AS ayah, ibu.nama_lengkap AS ibu ' +
    ' FROM detail_kk JOIN ktp ON detail_kk.nik = ktp.nik ' +
    ' LEFT JOIN ktp AS ayah ON detail_kk.ayah = ayah.nik ' +
    ' LEFT JOIN ktp AS ibu ON detail_kk.ibu = ibu.nik ' +
    ' LEFT JOIN kartu_keluarga ON detail_kk.no_kk = kartu_keluarga.no_kk ', function (err, rows) {
            if (err) {
                return res.status(500).json({
                    status: false,
                    message: 'Server Failed',
                })
            } else {
                return res.status(200).json({
                    status: true,
                    message: 'Data detail_kk',
                    data: rows
                })
            }
        })
});

// Function Update Data
router.patch('/update/:id', [
    body('no_kk').notEmpty(),
    body('nik').notEmpty(),
    body('status_hubungan_dalam_keluarga').notEmpty(),
    body('ayah').notEmpty(),
    body('ibu').notEmpty()
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            errors: errors.array()
        });
    }
    let id = req.params.id;
    let data = {
        no_kk: req.body.no_kk,
        nik: req.body.nik,
        status_hubungan_dalam_keluarga: req.body.status_hubungan_dalam_keluarga,
        ayah: req.body.ayah,
        ibu: req.body.ibu
    };
    connection.query('UPDATE detail_kk SET ? WHERE id_detail = ?', [data, id], function (err, result) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            });
        } else if (result.affectedRows === 0) {
            return res.status(404).json({
                status: false,
                message: 'Data detail_kk tidak ditemukan',
            });
        } else {
            return res.status(200).json({
                status: true,
                message: 'Data detail_kk berhasil diperbarui',
            });
        }
    });
});

// Function Delete Data
router.delete('/delete/:id', function(req, res){
    let id = req.params.id;
    connection.query(`DELETE FROM detail_kk WHERE id_detail = ${id}`,  function(err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        } else {
            return res.status(200).json({
                status: true,
                message: 'Delete Success..!',
            })
        }
    })
})

// Function Get Data by Id
router.get('/(:id)', function (req, res){
    let id = req.params.id;
    connection.query(`SELECT kartu_keluarga.no_kk, ktp.nama_lengkap AS nama, 
    detail_kk.status_hubungan_dalam_keluarga, ayah.nama_lengkap AS ayah, 
    ibu.nama_lengkap AS ibu FROM detail_kk JOIN ktp ON detail_kk.nik = ktp.nik 
    LEFT JOIN ktp AS ayah ON detail_kk.ayah = ayah.nik LEFT JOIN ktp AS ibu ON detail_kk.ibu = ibu.nik 
    LEFT JOIN kartu_keluarga ON detail_kk.no_kk = kartu_keluarga.no_kk 
    WHERE id_detail = ${id}`, function(err, rows) {
        if (err) {
            return res.status(500).json({
                status: false,
                message: 'Server Error',
            })
        }
        if (rows.length <= 0) {
            return res.status(404).json({
                status: false,
                message: 'Not Found',
            })
        }
        else{
            return res.status(200).json({
                status: true,
                message: 'Data detail_kk',
                data: rows[0]
            })
        }
    })
})

module.exports = router;
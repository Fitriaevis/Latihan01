const express = require('express') // membuat variable baru dengan nama express
const app = express() // membuat variable baru dengan nama app yang isinya express
const port = 4000 // membuat variable dengan nama port yang isinya 3000

// app.get('/', (req,res)=>{
//     res.send('Halo Ini Latihan Modul 7')
// })

const bodyPs = require('body-parser'); // import body-parser
app.use(bodyPs.urlencoded({ extended: false }));
app.use(bodyPs.json());


//import route posts ktp
const ktpRouter = require('./routes/ktp');
app.use('/api/ktp', ktpRouter);

//import route posts kk
const kkRouter = require('./routes/kartu_keluarga');
app.use('/api/kk', kkRouter);

//import route posts detail_kk
const detailRouter = require('./routes/detail_kk');
app.use('/api/detail_kk', detailRouter);

//listen express.js kedalam port 
app.listen(port, () => {
    console.log(`aplikasi berjalan di http://localhost:${port}`)
})
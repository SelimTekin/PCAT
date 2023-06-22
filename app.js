// express sayesinde http metoları kullanabiliriz.(get, post, put, fetch, delete)
const express = require('express');
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const Photo = require('./models/Photo');

// Yukarıdaki express fonksiyonunu app değişkenine atıyoruz
const app = express();

// connect DB
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// TEMPLATE ENGINE
// set metodunda genelde önceden tanımlı konfigürasyon değişkenleri kullanılır. Burada express'e, template engine olarak ejs kullandığımızı söyledik. ejs views klasörüne bakar.
app.set('view engine', 'ejs'); // ejs'nin kullanacağımız template engine olacağını belirtiyoruz.

// Middleware fonksiyonu
// const myLogger = (req, res, next) => {
//   console.log('Middleware Log 1');
//   next();
// };

// const myLogger2 = (req, res, next) => {
//   console.log('Middleware Log 2');
//   next();
// };

// MIDDLEWARES -> ara yazılım. Yani request response arasında olanlardır. routingler bile.
app.use(express.static('public')); // static dosyaları public klasörüne koyduk
app.use(express.urlencoded({ extended: true })); // url'deki datayı okumamızı sağlar.
app.use(express.json()); // url'deki datayı json formatına döndürür.
// app.use(myLogger);
// app.use(myLogger2);

// Bu da bir middleware'dır. Dolayısıyla myLogger'da next demeseydik bu middleware'e geçiş yapamayacaktı. request -> ... <- response (noktalar middleware oluyor.)
app.get('/', async (req, res) => {
  // res.sendFile(path.resolve(__dirname, '.temp/index.html')); // path.resolve ile dosya yolu çözümlüyoruz. __dirname -> proje klasörümün yolu.
  const photos = await Photo.find({});
  res.render('index', {
    photos
  }); // response objesi, kendisine request geldiğinde render metodunu kullanarak views klasörü içindeki index dosyasını render eder yani işler.
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  await Photo.create(req.body);
  res.redirect('/'); // req-> ... <-res döngüsünü bir sayfaya yönlendirerek sonlandırdık.
});

// Server'ın çalışması listen metodu yazıyoruz
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});

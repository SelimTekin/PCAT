// express sayesinde http metoları kullanabiliriz.(get, post, put, fetch, delete)
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override'); // put request'i post request'e simüle eder. ( Çünkü tarayıcı put request'i desteklemiyor. )
const ejs = require('ejs');
const photoController = require('./controllers/photoControllers');
const pageController = require('./controllers/pageControllers');

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
app.use(fileUpload()); // express-fileupload'u require ettik. Burada middleware fonksiyonunu yazıyoruz. ( Yukarıdakiler de öyle )
app.use(
  methodOverride('_method', {
    methods: ['GET', 'POST'],
  })
); // Sadece post ile gelen veriler değil get ile gelen veriler de override edilebilsin.
// app.use(myLogger);
// app.use(myLogger2);

// Bu da bir middleware'dır. Dolayısıyla myLogger'da next demeseydik bu middleware'e geçiş yapamayacaktı. request -> ... <- response (noktalar middleware oluyor.)
app.get('/', photoController.getAllPhotos);

// get ile gönderilen _id'yi alırken : (iki nokta) kullandık. (id yerine istediğini yazabilirsin)
app.get('/photos/:id', photoController.getPhoto);
app.post('/photos', photoController.createPhoto);
app.put('/photos/:id', photoController.updatePhoto);
app.delete('/photos/:id', photoController.deletePhoto);

app.get('/about', pageController.getAboutPage);

app.get('/add', pageController.getAddPage);

app.get('/photos/edit/:id', pageController.getEditPage);


// Server'ın çalışması listen metodu yazıyoruz
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});

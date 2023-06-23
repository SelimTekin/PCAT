// express sayesinde http metoları kullanabiliriz.(get, post, put, fetch, delete)
const express = require('express');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const methodOverride = require('method-override'); // put request'i post request'e simüle eder. ( Çünkü tarayıcı put request'i desteklemiyor. )
const ejs = require('ejs');
const path = require('path');
const fs = require('fs');
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
app.use(fileUpload()); // express-fileupload'u require ettik. Burada middleware fonksiyonunu yazıyoruz. ( Yukarıdakiler de öyle )
app.use(methodOverride('_method'));
// app.use(myLogger);
// app.use(myLogger2);

// Bu da bir middleware'dır. Dolayısıyla myLogger'da next demeseydik bu middleware'e geçiş yapamayacaktı. request -> ... <- response (noktalar middleware oluyor.)
app.get('/', async (req, res) => {
  // res.sendFile(path.resolve(__dirname, '.temp/index.html')); // path.resolve ile dosya yolu çözümlüyoruz. __dirname -> proje klasörümün yolu.
  const photos = await Photo.find({}).sort('-dateCreated'); // db'deki fotoları sondan başlayarak sıralasın. ( - bunun için var )
  res.render('index', {
    photos,
  }); // response objesi, kendisine request geldiğinde render metodunu kullanarak views klasörü içindeki index dosyasını render eder yani işler.
});

// get ile gönderilen _id'yi alırken : (iki nokta) kullandık. (id yerine istediğini yazabilirsin)
app.get('/photos/:id', async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  // photo template'ine gidecek ve photo nesnesini gönderecek
  res.render('photo', {
    photo,
  });
});

app.get('/about', (req, res) => {
  res.render('about');
});

app.get('/add', (req, res) => {
  res.render('add');
});

app.post('/photos', async (req, res) => {
  const uploadDir = 'public/uploads';

  // exitsSync() ve mkdirSync() bunlarda Sync kullanmamızın sebebi bunu önceden yapmasını istememizdir. Yani senkron çalışsın. Klasör olmadan görseli yükleyemeyiz. existsSync() klasörün var olup olnmadığını kontrol eder.
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/public/uploads/' + uploadedImage.name;

  // resmi uploads klasörüne yüklüyoruz. (... -> spread)
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body, // gönderilen string inputları aldık.
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/'); // req-> ... <-res döngüsünü bir sayfaya yönlendirerek sonlandırdık.
  });
});

app.get('/photos/edit/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  // photo'yu ilgili template'e gönderiyorum.
  res.render('edit', {
    photo,
  });
});

app.put('/photos/:id', async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  photo.title = req.body.title;
  photo.description = req.body.description;

  photo.save();

  res.redirect(`/photos/${req.params.id}`);
});

// Server'ın çalışması listen metodu yazıyoruz
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});

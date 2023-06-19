// express sayesinde http metoları kullanabiliriz.(grt, post, put, fetch, delete)
const express = require('express');
const path = require('path');

// Yukarıdaki express fonksiyonunu app değişkenine atıyoruz
const app = express();

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
app.use(express.static('public'));
// app.use(myLogger);
// app.use(myLogger2);

// Bu da bir middleware'dır. Dolayısıyla myLogger'da next demeseydik bu middleware'e geçiş yapamayacaktı. request -> ... <- response (noktalar middleware oluyor.)
app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '.temp/index.html')); // path.resolve ile dosya yolu çözümlüyoruz. __dirname -> proje klasörümün yolu.
});

// Server'ın çalışması listen metodu yazıyoruz
const port = 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda başlatıldı...`);
});

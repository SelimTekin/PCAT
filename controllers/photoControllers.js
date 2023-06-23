exports.getAllPhotos = async (req, res) => {
  // res.sendFile(path.resolve(__dirname, '.temp/index.html')); // path.resolve ile dosya yolu çözümlüyoruz. __dirname -> proje klasörümün yolu.
  const photos = await Photo.find({}).sort('-dateCreated'); // db'deki fotoları sondan başlayarak sıralasın. ( - bunun için var )
  res.render('index', {
    photos,
  }); // response objesi, kendisine request geldiğinde render metodunu kullanarak views klasörü içindeki index dosyasını render eder yani işler.
};

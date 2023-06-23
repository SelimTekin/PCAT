const Photo = require('../models/Photo');
const fs    = require("fs");

exports.getAllPhotos = async (req, res) => {
  // res.sendFile(path.resolve(__dirname, '.temp/index.html')); // path.resolve ile dosya yolu çözümlüyoruz. __dirname -> proje klasörümün yolu.
  const photos = await Photo.find({}).sort('-dateCreated'); // db'deki fotoları sondan başlayarak sıralasın. ( - bunun için var )
  res.render('index', {
    photos,
  }); // response objesi, kendisine request geldiğinde render metodunu kullanarak views klasörü içindeki index dosyasını render eder yani işler.
};

exports.getPhoto = async (req, res) => {
  const photo = await Photo.findById(req.params.id);
  // photo template'ine gidecek ve photo nesnesini gönderecek
  res.render('photo', {
    photo,
  });
};

exports.createPhoto = async (req, res) => {
  const uploadDir = 'public/uploads';

  // exitsSync() ve mkdirSync() bunlarda Sync kullanmamızın sebebi bunu önceden yapmasını istememizdir. Yani senkron çalışsın. Klasör olmadan görseli yükleyemeyiz. existsSync() klasörün var olup olnmadığını kontrol eder.
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  let uploadedImage = req.files.image;
  let uploadPath = __dirname + '/../public/uploads/' + uploadedImage.name;

  // resmi uploads klasörüne yüklüyoruz. (... -> spread)
  uploadedImage.mv(uploadPath, async () => {
    await Photo.create({
      ...req.body, // gönderilen string inputları aldık.
      image: '/uploads/' + uploadedImage.name,
    });
    res.redirect('/'); // req-> ... <-res döngüsünü bir sayfaya yönlendirerek sonlandırdık.
  });
};

exports.updatePhoto = async (req, res) => {
  const photo = await Photo.findOne({ _id: req.params.id });

  photo.title = req.body.title;
  photo.description = req.body.description;

  photo.save();

  res.redirect(`/photos/${req.params.id}`);
};

exports.deletePhoto = async (req, res) => {
  const photo = await Photo.findByIdAndRemove(req.params.id);
  let deletedImage = __dirname + '/../public' + photo.image;
  fs.unlinkSync(deletedImage); // Sync kullanmamızın sebebi bu işlemi yapmadan bir alt satıra geçmesin. Senkronize çalışsın yani.
  await Photo.findByIdAndRemove(req.params.id);

  res.redirect('/');
};

const mongoose = require('mongoose'); // mongoose bir ODM'dir. Schema'larda oluşturduğumuz veri nesnelerini veritabanı içerisindeki dokümanlara dönüştürür. ( Yani crud işlemleri yapıyoruz. )

const Schema = mongoose.Schema;

// connect DB
mongoose.connect('mongodb://127.0.0.1:27017/pcat-test-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// create schema
const photoSchema = new Schema({
  title: String,
  description: String,
});

const photo = mongoose.model('photo', photoSchema);

// create a photo
// photo.create({
//   title: 'Photo 2',
//   description: 'Photo description 2 lorem ipsum',
// });

// read a photo
// photo.find({}).then((data) => console.log(data));

// update photo
// const id = '649328d6b0e1eccbe304ea72';

// // new: true ile güncellenen verinin güncel halini göerbildik. Yazmazsak eski halini görecektik
// photo.findByIdAndUpdate(
//   id,
//   {
//     title: 'Photo Title 2 updated',
//     description: 'Photo description 2 updated',
//   },
//   {
//     new: true,
//   }
// ).then((data) => {
//     console.log(data)
// });

// delete a photo
const id = '649328d6b0e1eccbe304ea72';

photo.findByIdAndDelete(id).then((err, data) => {
  console.log('Photo is deleted...');
});

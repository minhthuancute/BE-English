require('dotenv').config();
require('./config/connectMongo');
const upload = require('./middlewares/upload');
const catchError = require('./middlewares/error');

// routes
const translateRoutes = require('./routes/translateRoutes');

const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const colorRoutes = require('./routes/colorRoutes');
const sizeRoutes = require('./routes/sizeRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const filterRoutes = require('./routes/filterRoutes');

// const { basicAuth } = require("./middlewares/basicAuth");

// import package
const cors = require('cors');
const express = require('express');
const app = express();
const server = require('http').Server(app);

// Socket
const Socket = require('./utils/Socket-io');

const ApiError = require('./utils/ApiError');
const socketInstance = new Socket(server);
socketInstance.initiSocketConnection();
// socketInstance.SocketHandler();

const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const { jwtAuth } = require('./middlewares/jwtAuth');
const conn = mongoose.connection;
let gfs;
conn.once('open', function () {
  gridfsBucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: 'photos'
  });

  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('photos');
});

app.post('/api/v1/file', upload.single('avatar'), (req, res) => {
  if (!req.file) {
    throw new ApiError(400, 'you must select a file.');
  }
  const imgUrl = `/file/${req.file.filename}`;

  return res.status(200).json({
    imgUrl
  });
});

app.post('/api/v1/files', upload.array('imgs', 50), (req, res, next) => {
  if (!req.files) {
    throw new ApiError(400, 'you must select files.');
  }
  const files = req.files;
  const imgsUrl = files.map((val) => {
    return `/file/${val.filename}`;
  });

  return res.status(200).json({
    imgsUrl
  });
});

app.get('/api/v1/file/:filename', async (req, res) => {
  try {
    const file = await gfs.files.findOne({ filename: req.params.filename });
    const readStream = gridfsBucket.openDownloadStream(file._id);
    readStream.pipe(res);
  } catch (error) {
    return res.status(400).json({
      message: error.message
    });
  }
});

app.use(express.json());
app.use(
  cors({
    origin: '*'
  })
);

app.use('/api/v1/translate', translateRoutes);

app.use('/api/v1/auth', userRoutes);
app.use('/api/v1/product', jwtAuth, productRoutes);
app.use('/api/v1/category', jwtAuth, categoryRoutes);
app.use('/api/v1/color', jwtAuth, colorRoutes);
app.use('/api/v1/size', jwtAuth, sizeRoutes);
app.use('/api/v1/size', jwtAuth, sizeRoutes);
app.use('/api/v1/upload', jwtAuth, uploadRoutes);

app.use('/api/v1/filter', jwtAuth, filterRoutes);

app.use(catchError);

server.listen(process.env.PORT, () => {
  console.log('Server is running on ' + process.env.PORT);
});

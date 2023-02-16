const catchAsync = require('../middlewares/catchAsync');
const axios = require('axios');

const fetchDataTranslate = (content = '') => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await axios.get(
        `https://dict.laban.vn/find?type=3&query=${content}`
      );
      resolve(data);
    } catch {
      reject(null);
    }
  });
};

exports.translate = catchAsync(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    res.status(400).json({
      success: false,
      message: 'Content is required !'
    });
  }

  const data = await fetchDataTranslate(content);
  console.log(data);

  res.status(200).json({
    success: true
  });
});

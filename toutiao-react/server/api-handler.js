const https = require('https');
const URL = "https://m.toutiao.com/list/?tag=__all__&ac=wap&count=20&format=json_raw&as=A1E50D0AF733090&cp=5DA743E04930BE1&min_behot_time=0&_signature=8D0UkwAAraTDWVc9uC4HDfA9FI&i";

const getData = () => {
  let data = "";
  return new Promise((resolve, reject) => {
    https.get(URL, list => {
      list.on('data', chunk => {
        data += chunk;
      });
      list.on('end', () => {
        resolve(data);
      });
    });
  });
}

const convertData = (dataString) => {
  let dataJson = JSON.parse(dataString);
  let dataConverted = dataJson.data.filter(item => {
    return typeof item.image_url !== "undefined" || item.image_list.length > 0;
  }).map(item => {
    let type = 'default';
    let imageList = [];
    if (item.image_list.length >= 3) {
      type = 'multiplePic';
      imageList = item.image_list.map(image => image.url);
    }
    else if (item.image_url) {
      type = 'singlePic';
      imageList = [item.image_url];
    }

    return {
      "type": type,
      "data": {
        "articleUrl": item.article_url,
        "title": item.title,
        "id": "i6727851773362438664",
        "articleType": "video",
        "imageList": imageList
      }
    };
  });

  return dataConverted;
}

module.exports = {
  getData,
  convertData
}

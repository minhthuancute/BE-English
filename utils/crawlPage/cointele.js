const schedule = require("node-schedule");
const puppeteer = require("puppeteer");
const { structItemDataCrawl } = require("../../constants");
const Translator = require("../translate");

const UnapprovedPost = require("../../models/UnapprovedPost");
const { GET_ALL_POSTS_UNAPPROVED } = require("../../constants/socketTypes");

const evaluate = () => {
  const selectors = [
    "post-card-inline__title",
    "post-card-inline__date",
    "post-card-inline__text",
    "post-card-inline__figure-link",
    "post-card-inline__stats-item span",
  ];

  const titlesQuery = document.querySelectorAll(`.${selectors[0]}`);
  const datesQuery = document.querySelectorAll(`.${selectors[1]}`);
  const textsQuery = document.querySelectorAll(`.${selectors[2]}`);
  const categoryQuery = document.querySelectorAll(`.${selectors[3]}`);
  const starQuery = document.querySelectorAll(`.${selectors[4]}`);

  const titles = [],
    dates = [],
    texts = [],
    categories = [],
    stars = [];

  const regexRemoveSpace = /\s+\\/g;
  titlesQuery.forEach((item) => {
    titles.push(item.textContent.trim().replace(regexRemoveSpace, " "));
  });
  datesQuery.forEach((item) => {
    dates.push(item.textContent.trim().replace(regexRemoveSpace, " "));
  });
  textsQuery.forEach((item) => {
    texts.push(item.textContent.trim().replace(regexRemoveSpace, " "));
  });
  categoryQuery.forEach((item) => {
    categories.push(item.textContent.trim().replace(regexRemoveSpace, " "));
  });
  starQuery.forEach((item) => {
    stars.push(item.textContent.trim().replace(regexRemoveSpace, " "));
  });

  // values crawl
  const values = titles.map((val, index) => {
    return {
      sourceTitle: val,
      sourceDescription: texts[index],
      date: dates[index],
      sourceCategory: categories[index],
      star: starQuery[index],
    };
  });
  return values;
};

// /10 * * * * *
const crawlCointele = (io) =>
  schedule.scheduleJob("*/10 * * * *", async () => {
    const browser = await puppeteer.launch({
      headless: false,
    });
    const pageBusiness = await browser.newPage();

    await pageBusiness.goto("https://cointelegraph.com/tags/business");
    const dataBusiness = await pageBusiness.evaluate(evaluate);
    const pageBlockchain = await browser.newPage();
    await pageBlockchain.goto("https://cointelegraph.com/tags/business");
    const dataBlockchain = await pageBlockchain.evaluate(evaluate);

    const data = [...dataBlockchain, ...dataBusiness];
    // Translate data
    const translator = new Translator(data, structItemDataCrawl.pageCoinTele);
    const dataTranslate = await translator.translateReuslt();

    const dataToClient = dataTranslate.map((val, index) => {
      return {
        sourceTitle: data[index].sourceTitle,
        translatedTitle: val.sourceTitle,
        sourceDescription: data[index].sourceDescription,
        translatedDescription: val.sourceDescription,
        date: val.date,
        translatedCategory: val.sourceCategory,
        sourceCategory: data[index].sourceCategory,
      };
    });

    const oldPosts = await UnapprovedPost.findOne({});
    // Case empty DB
    if (!oldPosts) {
      UnapprovedPost.insertMany(dataToClient);
    } else {
      const currentPosts = await UnapprovedPost.find({}).select("sourceTitle");
      const titles = currentPosts.map((val) => val.sourceTitle);
      const newPost = [];
      for (let i = 0; i < dataToClient.length; i++) {
        if (!titles.includes(dataToClient[i].sourceTitle)) {
          newPost.push(dataToClient[i]);
        }
      }
      await UnapprovedPost.insertMany(newPost);
      // Emit data to client
      const posts = await UnapprovedPost.find({});
      io.emit(GET_ALL_POSTS_UNAPPROVED, posts);
    }

    browser.close();
  });
module.exports = crawlCointele;

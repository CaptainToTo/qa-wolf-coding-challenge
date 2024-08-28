// EDIT THIS FILE TO COMPLETE ASSIGNMENT QUESTION 1
const { chromium } = require("playwright");

async function sortHackerNewsArticles() {
  // launch browser
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // go to Hacker News
  await page.goto("https://news.ycombinator.com/newest");

  articlesChecked = 0;
  lastTimestamp = 0;

  // get 100 timestamps, loads at most 5 pages of results
  for (let i = 0; i < 5; i++) {
    const articleAges = await page.locator(".age").all();

    for (const age of articleAges) {
      const titleStr = await age.getAttribute("title");

      const timestamp = Date.parse(titleStr);
      if (timestamp > lastTimestamp && lastTimestamp > 0) {
        await context.close();
        await browser.close();
        return false;
      }

      lastTimestamp = timestamp;
      articlesChecked++;

      if (articlesChecked >= 100) {
        break;
      }
    }

    if (articlesChecked >= 100) {
      break;
    }

    await page.locator(".morelink").click();
  }

  // end test
  await context.close();
  await browser.close();

  return true;
}

(async () => {
  const result = await sortHackerNewsArticles();
  if (result) {
    console.log("All articles in order.");
  } else {
    console.log("Out of order!");
  }
})();

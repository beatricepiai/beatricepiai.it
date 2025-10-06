require('dotenv').config();
const fs = require('fs');

const { storyblokInit, apiPlugin } = require("@storyblok/js");

const { storyblokApi } = storyblokInit({
    accessToken: process.env.STORYBLOK_API_TOKEN,
    use: [apiPlugin],
  });

let cv = null;


async function fetchData() {
    try {
      const { data } = await storyblokApi.get("cdn/spaces/me", { version: "published" });
      cv = data.space.version
      const res = { cv, 'ci': process.env.CI ?? 0 }
      fs.writeFileSync('data/prefetch.json', JSON.stringify(res, null, 2));

    } catch (error) {
      console.error(error);
    }
}
  
fetchData();
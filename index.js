#! /usr/bin/env node

/**

 pulls a bunch of data from demo studio

 // sample html blog
 <li class="demo row-first ">
     <h2 class="demo-title">
         <a href="/en-US/demos/detail/cu-fest1"><img src="https://developer.cdn.mozilla.net/media/uploads/demos/r/i/richa-sh/166f6186a802641fffd8ee92f07aaa7b/1445070194_screenshot_1_thumb.png" alt="" height="150" width="200">CU Fest1</a>
             </h2>
     <p class="byline vcard">
       <a href="/en-US/profiles/richa-sh" class="url fn" title="See richa-sh's profile">richa-sh</a>
     </p>
     <div class="extra">
       <ul class="stats">
                                         <li class="views" title="This demo has been viewed 378 times" data-recent="160">378</li>
         <li class="likes" title="1 person liked this demo" data-recent="1">1</li>
       </ul>
       <p class="desc">
         mega cultural fest's site

         <a href="/en-US/demos/detail/cu-fest1" class="descLink">Details</a>
       </p>
       <p class="launch"><a href="/en-US/demos/detail/cu-fest1/launch" target="" class="button" title="Launch CU Fest1">Launch</a></p>
     </div>
 </li>
 */


var cheerio = require('cheerio');
var fetch = require('request-promise');

var Promise = require('promise');


var root = "https://developer.mozilla.org";

var pages = 111;
var urls = [];

var extractDemoUrls = Promise.denodeify(function(studioPage, _, __, callback) {
  try {
    $ = cheerio.load(studioPage);

    callback(null, $('.demo').map(function() {
      return root + $(this).find('.demo-title a').attr('href');
    }));
  } catch (err) {
    callback(err);
  }
});

var extractDemoInformation = Promise.denodeify(function(page, _, __, callback) {
  try {
    $ = cheerio.load(page);
    callback(null, {
      title: $('.page-title').text().trim().split("\n")[0].replace(/,/g, ''),
      author: $('.byline a').text().trim().replace(/"/g, '').replace(/,/g, ''),
      views: $('.views').text().trim().split(' ')[0],
      likes: $('.likes').text().trim().split(' ')[0],
      download_url: root + $1('.download a').attr('href'),
      license: $('.license a').text().trim()
    });
  } catch (err) {
    callback(err);
  }
});

for (var i = 1; i <= pages; i++) {
  urls.push(root + "/en-US/demos/all?sort=created&page=" + i);
}

Promise.all(urls.map(fetch))
  .then(partialPmap(extractDemoUrls))
  .then(cflatten)
  .then(partialPmap(fetch))
  .then(partialPmap(extractDemoInformation))
  .then(console.log)
  .catch(function(e) {
    console.log(e.stack);
  });

/**
 * Wraps map in Pomise.all static method
 * makes arrays of Promises easier to manipulate
 */
function pmap(iterable, callback, context) {
  return Promise.all(iterable.map(callback, context));
}

/**
 * prepare a specialized pmap
 *
 * preload a function into pmap that can later be applied against an iterable
 */
function partialPmap(callback) {
  return function(iterable) {
    return pmap(iterable, callback);
  };
}

/*
 * flattens a JS array of cheerio objects
 *
 * cheerio objects have a slightly different api for map than array,
 * which is annoying.
 */
function cflatten(array) {
  return array.reduce(function(total, subArray) {
    subArray.map(function(index, item) {
      total.push(item);
    });

    return total;
  }, []);
}

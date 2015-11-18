#! /usr/bin/env node

// prints a CSV file of MDN demo studio stats to stdout

var request = require('request');
var cheerio = require('cheerio');

function println() {
  console.log(Array.prototype.slice.call(arguments).join(','));
}

var pages = 111;
var demos = [];

console.log('title,author,views,likes');
for (var i = 1; i <= pages; i++) {
  request(
    "https://developer.mozilla.org/en-US/demos/all?sort=created&page=" + i,
    parseDemoPage);
}

function parseDemoPage(e, r, b) {
  if (e || r.statusCode != 200) {
    console.error("failed to load: ", i, " : ", r.statusCode, e);
    return;
  }

  $ = cheerio.load(b);
  $('.demo').map(function(i, el) {
    println(
      // remove contest placements that optionally appears in title on newline
      $(this).find('.demo-title').text().trim().split("\n")[0].replace(/,/g, ''),   $(this).find('.vcard').text().trim().replace(/"/g, '').replace(/,/g, ''),
      $(this).find('.views').text().trim(),
      $(this).find('.likes').text().trim()
    );
  });
}

/** sample html blog
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

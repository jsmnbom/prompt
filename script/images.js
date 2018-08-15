'use strict';
const Flickr = require('flickr-sdk');
const meow = require('meow');
const util = require('util');
const fs = require('fs');
const pick = require("lodash/object").pick;
const pprint = (obj) => console.log(util.inspect(obj, {showHidden: false, depth: null}));

const cli = meow(`
    Usage
      $ images <name> <text>
`);

const [name, text] = cli.input;

const licenses = [1/*by-nc-sa*/, 2/*by-nc*/, 3/*by-nc-nd*/, 4/*by*/, 5/*by-sa*/, 6/*by-nd*/, 9/*CC0*/];
//

let flickr = new Flickr(process.env.FLICKR_API_KEY);

function getImages(query, min, cb) {
    const images = [];
    let i = 0;

    function inner(page) {
        console.log(page, i);
        i++;
        if (i > 3) {
            process.exit()
        }
        flickr.photos.search({
            ...query,
            page: page
        }).then(function (res) {
            res.body.photos.photo.forEach((photo) => {
                if (photo.url_z || photo.url_b || photo.url_h) {
                    images.push(pick(photo, ['id', 'owner', 'ownername', 'title', 'license', 'views', 'url_z', 'url_b', 'url_h']))
                } else {
                    console.log(photo);
                }
            });
            if (images.length >= min) {
                cb(images);
            } else {
                inner(page + 1)
            }
        }).catch(function (err) {
            console.error('bonk', err);
        });
    }

    inner(1)
}

getImages({
    text: text,
    license: licenses.join(','),
    extras: 'license, owner_name, icon_server, views, url_z, url_b, url_h',
    sort: 'interestingness-desc'
}, 100, (images) => {
    fs.writeFile(`../src/motifs/${name.toLowerCase()}.json`, JSON.stringify({
        images: images,
        name: name
    }), 'utf8');
    const html = `<html>
<head>
<title>${name}</title>
<style>
img {
width: 50%;
}
</style>
</head>
<body>
${images.map((img) => `<img src="${img.url_z}" /><p>${img.id}</p>`).join('\n')}
</body>
</html>`;
    fs.writeFile(`temp/${name.toLowerCase()}.html`, html, 'utf8');
});





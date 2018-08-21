'use strict';
const Flickr = require('flickr-sdk');
const meow = require('meow');
const util = require('util');
const fs = require('fs');
const pick = require("lodash/object").pick;
const uniqBy = require("lodash/array").uniqBy;
const pprint = (obj) => console.log(util.inspect(obj, {showHidden: false, depth: null}));

const cli = meow(`
    Usage
      $ flickr <name> <text>
`);

const [name, text] = cli.input;

const licenses = [1/*by-nc-sa*/, 2/*by-nc*/, 3/*by-nc-nd*/, 4/*by*/, 5/*by-sa*/, 6/*by-nd*/, 9/*CC0*/];
//

let flickr = new Flickr(process.env.FLICKR_API_KEY);

function getImages(query, min, cb) {
    let images = [];
    let i = 0;

    function inner(page) {
        console.log(page, i);
        i++;
        if (i > 7) {
            process.exit()
        }
        flickr.photos.search({
            ...query,
            page: page
        }).then(function (res) {
            res.body.photos.photo.forEach((photo) => {
                if (photo.url_z || photo.url_b || photo.url_h) {
                    const img = pick(photo, ['id', 'owner', 'ownername', 'title', 'license']);
                    img.urlBase = photo.url_z.split('_')[0] + '_';
                    img.url_m = photo.url_m.replace(img.urlBase, '');
                    img.url_z = photo.url_z.replace(img.urlBase, '');
                    if (photo.url_b) img.url_b = photo.url_b.replace(img.urlBase, '');
                    if (photo.url_h) img.url_h = photo.url_h.replace(img.urlBase, '');
                    images.push(img);
                    images = uniqBy(images, 'id');
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
    extras: 'license, owner_name, icon_server, views, url_m, url_z, url_b, url_h',
    sort: 'interestingness-desc'
}, 500, (images) => {
    fs.writeFile(`../src/data/motifs/${name.toLowerCase()}.json`, JSON.stringify({
        images: images,
        name: name,
        thumb: null
    }), 'utf8');
});





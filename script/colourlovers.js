'use strict';
const util = require('util');
const fs = require('fs');
const pprint = (obj) => console.log(util.inspect(obj, {showHidden: false, depth: null}));
const request = require('superagent');
const pick = require("lodash/object").pick;

function getPalettes(min, cb) {
    const palettes = [];
    let i = 0;

    function inner(offset) {
        console.log(offset, i);
        i++;
        if (i > 5) {
            process.exit()
        }
        const per = 100;
        request.get('http://www.colourlovers.com/api/palettes/top').query({
            format: 'json',
            resultOffset: offset,
            numResults: per,
            showPaletteWidths: 1
        }).then(function (res) {
            res.body.forEach((palette) => {
                palettes.push(pick(palette, ['id', 'title', 'userName', 'colors', 'colorWidths', 'url']));
            });
            if (palettes.length >= min) {
                cb(palettes);
            } else {
                inner(offset + per)
            }
        }).catch(function (err) {
            console.error('bonk', err);
        });
    }

    inner(0)
}

getPalettes(200, (palettes) => {
    fs.writeFile(`../src/palettes.json`, JSON.stringify({
        palettes: palettes
    }), 'utf8');
});



import path from 'path';
import fs from 'mz/fs';
import zlib from "zlib";
import * as t from 'babel-types';
import {encode} from '../lib/base62';
import getContentsFactory from '../lib/getContents';
import invertObject from '../lib/invertObject';
import stringifyObject from '../lib/stringifyObject';

const browsers = require('../../data/browsers');
const versions = require('../../data/browserVersions');

const browsersInverted = invertObject(browsers);
const versionsInverted = invertObject(versions);

const base = path.join(
    path.dirname(require.resolve(`caniuse-db/data.json`)),
    `region-usage-json`
);

const getContents = getContentsFactory(base);

export default function packRegion () {
    return fs.readdir(base)
        .then(getContents)
        .then(regions => {
            return Promise.all(regions.map(region => {
                const {data} = region.contents;
                const packed = Object.keys(data).reduce((list, key) => {
                    const stats = data[key];
                    list[browsersInverted[key]] = Object.keys(stats).reduce((l, k) => {
                        const stat = stats[k];
                        if (stat === null) {
                            if (l._) {
                                l._ += ` ${k}`;
                            } else {
                                l._ = `${k}`;
                            }
                            return l;
                        }
                        l[k] = stat;
                        return l;
                    }, {});
                    return list;
                }, {});
                
                return fs.writeFile(
                    path.join(__dirname, `../../data/regions/${region.name}.js.zz`),
                    zlib.deflateSync(stringifyObject(packed))
                );
            }));
        })    
}

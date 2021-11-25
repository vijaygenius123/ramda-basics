import fs from "fs";
import {pipe, filter, propEq} from "ramda";


const readFile = path => fs.readFileSync(path, {encoding: 'utf-8'})

const parse = data => JSON.parse(data)

pipe(
    readFile,
    parse,
    filter(propEq('country', 'UK')),
    console.log
)('./input/cities.json')

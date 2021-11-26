import fs from "fs";
import {pipe, map, prop} from "ramda";


const readFile = path => fs.readFileSync(path, {encoding: 'utf-8'})

const parse = data => JSON.parse(data)
const convertKToC = temp => temp - 273.15
const convertCToF = temp =>  (convertKToC(temp) * 9/5 ) + 32


pipe(
    readFile,
    parse,
    map(
        prop('temp'),
        convertCToF
        ),
   // filter(propEq('country', 'UK')),
    console.log
)('./input/cities.json')

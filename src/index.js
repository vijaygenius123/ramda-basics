import fs from "fs";
import R from "ramda";

const readFile = path => fs.readFileSync(path, 'utf-8')


R.pipe(
    R.map(
    R.pipe(
    readFile,
    R.split('\n'),
    R.dropLast(1),
    R.map(R.split('\t')),
    R.map(R.take(2)),
    console.log
    )
    )
)
(['./input/btc.csv', './input/eth.csv'])

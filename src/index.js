import fs from "fs";
import {
    converge,
    concat,
    replace,
    pipe,
    split,
    dropLast,
    map,
    take,
    __,
    view,
    lensIndex,
    objOf,
    head,
    tail,
    transpose, mergeAll
} from "ramda";

const readFile = path => fs.readFileSync(path, 'utf-8')

const readData = converge(concat,
            [
                pipe(
                    replace(/.*\//, ''),
                    replace(/\..*/, ''),
                    concat('date\t'),
                    concat(__, '\n'),
                ), readFile
            ])

pipe(
    map(
        pipe(
            readData,
            split('\n'),
            dropLast(1),
            map(split('\t')),
            map(take(2)),
            map(view(lensIndex(1))),
            converge(map, [
                pipe(
                    head,
                    objOf
                ), tail
            ]),
        )
    ),
    transpose,
    map(mergeAll),
    console.log
)
(['./input/btc.csv', './input/eth.csv'])

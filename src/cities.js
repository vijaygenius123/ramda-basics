import fs from "fs";
import {pipe, map, prop, curry, append, mergeRight, reduce} from "ramda";


const readFile = path => fs.readFileSync(path, {encoding: 'utf-8'})

const parse = data => JSON.parse(data)
const convertKToC = temp => temp - 273.15
const convertCToF = temp =>  (convertKToC(temp) * 9/5 ) + 32
const updateTemperature = curry((conversionFunc ,city) => {
        const temp = conversionFunc(prop('temp', city))
        return mergeRight(city, {temp})
})

const citiesData = pipe(
    readFile,
    parse,
)('./input/cities.json')
const updatedCities = map(
        updateTemperature(convertKToC)
    )(citiesData)

//console.log(updatedCities)

const groupByReducer = (acc, city) => {
        const {cost = [], internetSpeed = []} = acc;
        return mergeRight(acc, {
                cost: append(prop('cost', city), cost),
                internetSpeed: append(prop('internetSpeed', city), internetSpeed)
        })
}

const groupedByProp = reduce(groupByReducer, {}, updatedCities)

console.log(groupedByProp)

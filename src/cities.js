import fs from "fs";
import {pipe, map, prop, curry, append, mergeRight, reduce, length, filter} from "ramda";


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

//console.log(groupedByProp)

const lessThan = curry((check, value) => {
        return value < check
})

const percentile =  (arr, val) => {
        const N = length(arr)
        const checkLessThan = lessThan(val)
        const n = length(filter(checkLessThan)(arr))
        return  n * 100 / N
}

//console.log(percentile(groupedByProp['cost'], updatedCities[0].cost))
const calcScore =  (city) => {
        const costScore = percentile(groupedByProp['cost'], prop('cost', city))
        const internetScore = percentile(groupedByProp['internetSpeed'], prop('internetSpeed', city))

        return mergeRight(city,{
                costScore,
                internetScore
        } )
}

const citiesWithScore = map(calcScore)(updatedCities)

console.log(citiesWithScore)

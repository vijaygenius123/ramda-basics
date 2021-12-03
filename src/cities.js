import fs from "fs";
import {
        pipe,
        map,
        prop,
        curry,
        append,
        mergeRight,
        reduce,
        length,
        filter,
        sortWith,
        descend,
        take,
        prepend
} from "ramda";
import table from 'text-table'

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
        const score =  80 * (1 - costScore / 100) + 20 * (internetScore/ 100)
        return mergeRight(city,{
                costScore,
                internetScore,
                score
        } )
}

//const citiesWithScore = map(calcScore)(updatedCities)

const filterByWeather = city => {
        const {temp = 0, humidity = 0 } = city;
        return temp > 20 && temp < 25 && humidity > 30 && humidity < 70
}

const cityToArray = city => {
        const {name, country, score, cost, temp, internetSpeed} = city
        return [name, country, score, cost, temp, internetSpeed]
}

const intrestingProps = ['Name', 'Country', 'Score', 'Cost', 'Temp', 'Internet Speed']

const topCities = pipe(
    map(updateTemperature(convertKToC)),
    filter(filterByWeather),
    map(calcScore),
    sortWith([descend(prop('score'))]),
    take(10),
    map(cityToArray),
    prepend(intrestingProps),
    table
)(citiesData)

console.log('Top Cities')
console.log(topCities)

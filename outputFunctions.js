var jsonfile = require('jsonfile')
var fs = require('fs');
var csv = require('csv-parser')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

module.exports ={
writeToCSV: function writeToCSV(path, headerArray, data){
                return new Promise((resolve, reject) =>{
                    var csvOptions = {
                        path: path,
                        header: headerArray
                    };
                    var csvWriter = createCsvWriter(csvOptions);

                    resolve(csvWriter.writeRecords(data))

                })
},
readCSVToArray: function readCSVToArray(csvFile){
                return new Promise((resolve, reject) =>{
                    var accountDictionary = {};
                    var arrayResults = [];
                    fs.createReadStream(csvFile)
                        .pipe(csv())
                        .on('data', (data) => arrayResults.push(data))
                        .on('end', () => {
                            resolve(arrayResults);
                        })        
                    })
}
}
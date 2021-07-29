var api = require('../../apiCalls.js');
var output = require('../../outputFunctions.js');
var q = require('q');

exports.command = 'accounts partnership'
exports.desc = 'List all active accounts from partnership'
exports.builder = function(yargs) {
    return yargs
    .usage('usage: $0 list accounts partnership')
    .example('$0 list accounts partnership -o csv -p ./myaccounts.csv', ' || Lists all accounts within partnership to csv')
    .options({
        'output': {
            alias: 'o',
            default: 'console',
            describe: 'Output type [console|csv]',
            choices: ['console', 'csv'],
            type: 'string'
        }
    })
    .options({
			'path': {
				alias: 'p',
				demandOption: false,
                describe: 'If csv output is selected, provides a path for csv to be written',
                default: 'AccountsList.csv',
				type: 'string'
			}
    })
}
exports.handler = function (argv) {
console.log('Listing all accounts in partnership');
var outputArray = [];
var csvFormatArray = [
    {id: 'name', title: 'account_name'},
    {id: 'id', title: 'account_id'},
    {id: 'status', title: 'account_status'},
    {id: 'license_key', title: 'icense_key'},
    {id: 'api_key', title: 'api_key'}
];
  api.listAccount()
  .then(function(responseArray){
    responseArray.forEach(function(account){
        var outputObject = {
            name : account.name,
            id : account.id,
            status : account.status,
            license_key : account.license_key,
            api_key : account.api_key
        };
        outputArray.push(outputObject);

     })
  })
  .then(function(){
    if(argv.o == 'console'){
        console.log(outputArray);
    } else if(argv.o == 'csv'){
        output.writeToCSV(argv.p, csvFormatArray, outputArray)
        .then(function(){
            console.log('The CSV file was written successfully here: '+argv.p)
        })
    } else{
        console.log('Something seriously went wrong');
    }
  })
}
var api = require('../../apiCalls.js');
var q = require('q');

exports.command = 'account partnership'
exports.desc = 'Search for an account from partnership'
exports.builder = function(yargs) {
    return yargs
    .usage('usage: $0 search account partnership -a <accountid>')
    .options({
			'accountid': {
				alias: 'a',
				demandOption: true,
				describe: 'Account ID to query',
				type: 'string'
			}
    })
    .example('$0 search account partnernship -a 123445',' || Searches for accountid 12345 from partnership, returns details of the account')
}
exports.handler = function (argv) {
  if (argv.a != null || argv.a != undefined){
	console.log('Searching for account using account ID %s from the partnership', argv.a)
		api.searchAccount(argv.a).then(function(response){
			console.log('Query success');
			var responseObject = JSON.parse(response);
			console.log(responseObject);
		}
		)
  }
}


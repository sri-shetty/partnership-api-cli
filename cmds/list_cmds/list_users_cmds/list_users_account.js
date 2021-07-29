var api = require('../../../apiCalls.js');
var output = require('../../../outputFunctions.js');
var q = require('q');

exports.command = 'account'
exports.desc = 'Lists all users within specified account'
exports.builder = function(yargs) {
    return yargs
    .usage('usage: $0 list users account -a <accountid> [options]')
    .options({
        'accountid': {
            alias: 'a',
            demandOption: true,
            describe: 'Account ID to query',
            type: 'string'
        }
    })
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
                default: 'UsersList.csv',
				type: 'string'
			}
    })
    .example('$0 list users account -a 123456 -o csv -p UsersList.csv', ' || Creates a list of users within an account and outputs to UsersList.csv')
    .example('$0 list users account -a 123456', ' || Creates a list of users within an account and outputs to console')
}

exports.handler = function (argv) {
        console.log('Listing all users in account %s', argv.a);
        var outputArray = [];
        var csvFormatArray = [
            {id: 'email', title: 'user_email'},
            {id: 'id', title: 'user_id'},
            {id: 'role', title: 'user_role'},
            {id: 'account', title: 'account_name'},
            {id: 'accountid', title: 'account_id'}
        ];

        api.searchAccount(argv.a).then(function(response){
            api.listUsersFromAccount(argv.a, response.name)
            .then(function(userList){
                userList.users.forEach(function(user){
                    var outputObject = {
                        email : user.email,
                        id : user.id,
                        role : user.role,
                        account : userList.accountname,
                        accountid : userList.accountid
                    };
                    outputArray.push(outputObject);
                })
            })
            .then(function(){
                if(argv.output == 'console'){
                    console.log(outputArray);
                } else if(argv.output == 'csv') {
                    output.writeToCSV(argv.p, csvFormatArray, outputArray).then(function(){
                        console.log('The CSV file was written successfully here: '+argv.p)
                    });
                } else {
                    console.log('Something seriously went wrong');
                }  
            })
        })
}


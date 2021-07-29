var api = require('../../../apiCalls.js');
var output = require('../../../outputFunctions.js');
var q = require('q');

exports.command = 'partnership'
exports.desc = 'Lists all users within the partnership'
exports.builder = function(yargs) {
    return yargs
    .usage('usage: $0 list users partnership [options]')
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
    .example('$0 list users partnership -o csv -p UsersList.csv', ' || Creates a list of users within the partnership and outputs to UsersList.csv')
}
exports.handler = function (argv) {
        console.log('Listing all users in the partnership');
        var outputArray = [];
        var csvFormatArray = [
            {id: 'email', title: 'user_email'},
            {id: 'id', title: 'user_id'},
            {id: 'role', title: 'user_role'},
            {id: 'account', title: 'account_name'},
            {id: 'accountid', title: 'account_id'}
        ];

        api.listAccount()
        .then((accountArray) =>{
            var promises = [];
            accountArray.forEach((account) => {
                promises.push(api.listUsersFromAccount(account.id, account.name));
            })
            return Promise.all(promises);
        })
        .then((userlistArray) =>{
            let outputArray=[]
            userlistArray.forEach((userList) => {
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
            if(argv.output == 'console'){
                console.log(outputArray);
            } else if(argv.output == 'csv') {
                output.writeToCSV(argv.p, csvFormatArray, outputArray).then(function(){
                    console.log(`The CSV file was written to ${argv.p}`)
                });
            } else {
                console.log('Something seriously went wrong');
            }  
        })
}
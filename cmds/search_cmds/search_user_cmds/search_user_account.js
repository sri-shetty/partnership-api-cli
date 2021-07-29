var api = require('../../../apiCalls.js');

exports.command = 'account'
exports.desc = 'Search for a user within specified account'
exports.builder = function(yargs) {
    return yargs
    .usage('usage: $0 search user account -a <accountid> -t <typeofuser> -u <user>')
    .options({
        'accountid': {
            alias: 'a',
            demandOption: true,
            describe: 'Account ID to query',
            type: 'string'
        }
    })
    .options({
        'type':{
            alias: 't',
            demandOption: true,
            describe: 'Specify to search using user ID or email',
            choices: ['id', 'email'],
        }
    })
    .options({
        'user':{
            alias: 'u',
            demandOption: true,
            describe: 'Provide either user ID or email',
            type: 'string',
        }
    })
    .options({
        'list':{
            alias: 'l',
            demandOption: false,
            default: false,
            describe: 'Optional boolean to list all users as well',
            type: 'boolean'
        }
    })
    .example('$0 search user account -a 123445 -t id -u 2468123',' || Searches for user id 2468123 from account 123445')
    .example('$0 search user account -a 123445 -t email -u admin@admin.com',' || Searches for user email admin@admin.com from account 123445')
}
exports.handler = function (argv) {

        console.log('Searching if user %s is in account ID %s from the partnership \n', argv.u, argv.a)
        if(argv.u.length > 0){
        api.searchAccount(argv.a)
        .then(function(response){    
        api.listUsersFromAccount(argv.a, response.name)
        .then(function(response){
            if(argv.t == 'id'){
                var findUser = response.users.find(user => user.id == argv.u)
                if(findUser == undefined || findUser == null){
                    console.log('Unable to find user %s within account %s', argv.u, argv.a);
                } else{
                    console.log('User %s found within account %s!', argv.u, argv.a);
                    console.log(findUser);
                }
                if(argv.list){
                    console.log(response);
                }
            }
            else if (argv.t == 'email') {
                var findUser = response.users.find( ({email}) => email == argv.u)
                if(findUser == undefined || findUser == null){
                    console.log('Unable to find user %s within account %s', argv.u, argv.a);
                } else{
                    console.log('User %s found within account %s!', argv.u, argv.a);
                    console.log(findUser);
                }
                if(argv.list){
                    console.log('\nFull List of users :')
                    console.log(response);
                }
            } else {
                console.log('Something badly went wrong');
            }
        })
    })
} else {
    console.log('User field is empty, please provide a user id or email!')
}

}


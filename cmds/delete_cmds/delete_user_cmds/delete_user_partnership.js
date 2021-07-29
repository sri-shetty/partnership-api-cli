var api = require('../../../apiCalls.js');

exports.command = 'partnership'
exports.desc = 'Delete a user within the partnership'
exports.builder = function(yargs) {
    return yargs
    .usage('usage: $0 search user partnership -u <userid>')
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
    .example('$0 delete user partnership -t id -u 2468123',' || Deletes user id 2468123 within partnership accounts')
    .example('$0 delete user partnership -t email -u admin@admin.com',' || Deletes user email admin@admin.com within partnership accounts')
}
exports.handler = function (argv) {
        console.log('Searching for user \'%s\' within the partnership using \'%s\' \n', argv.u, argv.t)
        //Get a list of all accounts within partnership
        api.listAccount().then(function(response){
            var accountsArray = response;
            var promises = [];
            for(i=0; i<accountsArray.length; i++){
                    //Search for users within each account
                    var account = accountsArray[i]
                    promises.push(api.listUsersFromAccount(account.id, account.name));
            }
            return Promise.all(promises);
        }).then(function(userlistArray){
            //Search for user within each account userlist
            var isUser = false;
            var userFound = null;
            var userInAccounts = [];
            userlistArray.forEach(function(userList){
                if(argv.t == 'id'){
                    var findUser = userList.users.find( ({id}) => id == argv.u)
                    if(findUser != undefined && findUser != null) {
                       // console.log('Found user: ' +findUser.id);
                       // console.log(userList.accountname);
                        isUser = true;
                        if(userFound == null){
                            userFound = findUser;
                        }
                        userInAccounts.push(userList)
                    } 
                } else if (argv.t == 'email') {
                    var findUser = userList.users.find( ({email}) => email == argv.u)
                    if(findUser != undefined && findUser != null) {
                      //  console.log('Found user: ' +findUser.email);
                      //  console.log(userList.accountname);
                        isUser = true;
                        if(userFound == null){
                            userFound = findUser;
                        }
                        userInAccounts.push(userList)
                    } 
                } else {
                    console.log('Something badly went wrong');
                }
            })
            if(userInAccounts.length > 0){
                console.log('User found || email: \'%s\' || userid: \'%s\'', userFound.email, userFound.id)
                console.log('Account ID ||  Account Name       || Status ')
                userInAccounts.forEach(function(account){
                    var findUser = account.users.find( ({id}) => id == userFound.id)
                    var userRole;
                    if(findUser != undefined && findUser != null) {
                       // console.log('Found user: ' +findUser.id);
                       // console.log(userList.accountname);
                        userRole = findUser.role;
                    } 
                    api.deleteUser(account.accountid, userFound.id)
                    .then(function(response){
                        console.log('%s    ||  %s    || Deletion success', account.accountid, account.accountname.padEnd(15));
                    })
                    .catch((function(err){
                        console.log('%s    ||  %s    || Deletion failed', account.accountid, account.accountname.padEnd(15));
                    }))

                })
            } else {
                console.log('User \'%s\' not found within partnership using \'%s\'!', argv.u, argv.t)
            }
        })
}
var api = require('../../../apiCalls.js');
var output = require('../../../outputFunctions.js');
var q = require('q');
var fs = require('fs');

exports.command = 'partnership'
exports.desc = 'Create users for multiple specified accounts'
exports.builder = function(yargs) {
    return yargs
    .usage('usage: $0 create users partnership [options]')
    .options({
        'userlist': {
            alias: 'u',
            demandOption: true,
            describe: 'Path to users list',
            type: 'string'
        }
    })
    .options({
        'accountmap': {
            alias: 'm',
            demandOption: false,
            describe: 'To use account names, provide a csv that maps acount name to account ID',
            default: 'AccountsList.csv'
        }
    })
    .example('$0 create users partnership -u techopsList.csv',' || Creates users in techopsList.csv')
    .example('$0 create users partnership -u techopsList.csv -m AccountsList.csv',' || Same as above, but accepts account names specified in AccountsList.csv in \'account\' field')
}
exports.handler = function (argv) {
        console.log('Attempting to create users from file: '+argv.u );
        var accountDictionary = {};
        var requiredProperties = ['firstName', 'lastName', 'role', 'email', 'account']


        if (fs.existsSync(argv.m)) {
            output.readCSVToArray(argv.m)
            .then(function(accountList){
                if(accountList[0].hasOwnProperty('account_name') && accountList[0].hasOwnProperty('account_id')){
                    console.log('Account name map detected, attempting to load: ' +argv.m);
                    accountList.forEach(function(account){
                        if(account.account_name != null && account.account_name != undefined){
                            if(account.account_id != null && account.account_id != undefined){
                                accountDictionary[account.account_name] = account.account_id;
                            } else {
                                //console.log('Account name map has Account_Name with no specified RPM_ID')
                            }
                        }
                        else {
                            //console.log('Account name map does not have Account_Name field');
                        }
                    })
                }
            })
            .then(function(){
                output.readCSVToArray(argv.u)
                .then(function(userList){
                    if(userList.length <= 0){
                        console.log('[Error] User List has no items');
                    } else {
                        userList.forEach(function(user){
                            var hasRequiredProperties = true;
                            requiredProperties.forEach(function(property){
                                if(user.hasOwnProperty(property) && user[property].length != 0){
                                } else {
                                    hasRequiredProperties = false;
                                    console.log('[Error] Missing property \'' + property + '\' for the below:')
                                    console.log(user);
                                }
                             })

                             if(hasRequiredProperties == true){
                                var isNum = /^\d+$/.test(user.account);
                                if(isNum){
                                    var accountID = user.account;
                                    api.createUser(user.email, user.firstName, user.lastName, user.role, accountID)
                                    .then(function(response){
                                        console.log(response);
                                    })
                                } else if(accountDictionary.hasOwnProperty(user.account)) {
                                    var accountID = accountDictionary[user.account]
                                    api.createUser(user.email, user.firstName, user.lastName, user.role, accountID)
                                    .then(function(response){
                                        console.log(response);
                                    })
                                } else {
                                    console.log('[Error] Cannot detect valid account ID or account name provided in account map for user below:');
                                    console.log(user);
                                }
                             } else{

                             }
                        })

                    }
                   
                })
            })
        } else {
            console.log('[Warning] Account Map not provided, you must provide account ID instead of account names in \'account\' field of user list');
            output.readCSVToArray(argv.u)
            .then(function(userList){
                if(userList.length <= 0){
                    console.log('[Error] User List has no items');
                } else {
                    userList.forEach(function(user){
                        var hasRequiredProperties = true;
                        requiredProperties.forEach(function(property){
                            if(user.hasOwnProperty(property) && user[property].length != 0){
                            } else {
                                hasRequiredProperties = false;
                                console.log('[Error] Missing property \'' + property + '\' for the below:')
                                console.log(user);
                            }
                         })

                         if(hasRequiredProperties == true){
                            var isNum = /^\d+$/.test(user.account);
                            if(isNum){
                                var accountID = user.account;
                                api.createUser(user.email, user.firstName, user.lastName, user.role, accountID)
                                .then(function(response){
                                    //console.log(response);
                                    console.log('Successfully created user: ' +user.email);
                                })
                            } else if(accountDictionary.hasOwnProperty(user.account)) {
                                var accountID = accountDictionary[user.account]
                                api.createUser(user.email, user.firstName, user.lastName, user.role, accountID)
                                .then(function(response){
                                    //console.log(response);
                                    console.log('Successfully created user: ' +user.email);
                                })
                            } else {
                                console.log('[Error] Cannot detect valid account ID or account name provided in account map for user below:');
                                console.log(user);
                            }
                         } else{

                         }
                    })

                }
               
            })
        }

}
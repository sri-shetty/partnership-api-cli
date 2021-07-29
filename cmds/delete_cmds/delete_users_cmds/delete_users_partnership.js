var api = require("../../../apiCalls.js");
var output = require("../../../outputFunctions.js");
var q = require("q");
var fs = require("fs");

exports.command = "partnership";
exports.desc = "Delete a list of users across the partnership";
exports.builder = function(yargs) {
  return yargs
    .usage("usage: $0 delete users partnership [options]")
    .options({
      userlist: {
        alias: "u",
        demandOption: true,
        describe: "Path to users list",
        type: "string"
      }
    })
    .options({
      dryrun: {
        alias: "d",
        demandOption: false,
        default: true,
        describe: "Perform dry run whilst true",
        type: "boolean"
      }
    })
    .example(
      "$0 delete users partnership -d false -u techopsList.csv", " || Deletes users in techopsList.csv across the partnership"
    )
    .example(
      "$0 delete users partnership -u techopsList.csv", " || Perform dry run of deleting users in techopsList.csv across the partnership"
    );
};
exports.handler = function(argv) {
  console.log("Attempting to delete users from file: " + argv.u);


  api.listAccount().then(function(response){
    var accountsArray = response;
    var promises = [];
    for(i=0; i<accountsArray.length; i++){
            //Search for user lists within each account
            var account = accountsArray[i]
            promises.push(api.listUsersFromAccount(account.id, account.name));
    }
    return Promise.all(promises);
  })
  .then(function(userlistArray) {
    //userlistArray: array of account user lists
    output.readCSVToArray(argv.u).then(function(userList) {
          //userList: list of users from CSV
          if (userList.length <= 0) {
            console.log("[Error] User List has no items");
          } else {
            console.log("Number of users found in file: " +userList.length);
            var key = Object.keys(userList[0]);
            //For each user in CSV
                userList.forEach(function(user) {
                      console.log(
                        "Searching for user '%s' within the partnership",
                        user[key]
                      );
                      var isUser = false;
                      var userFound = null;
                      var userInAccounts = [];
                      userlistArray.forEach(function(userAccountList) {
                            var findUser = userAccountList.users.find(
                              ({ email }) => email == user[key]
                            );
                            if (findUser != undefined && findUser != null) {
                                //console.log('Found user: ' +findUser.email);
                                //console.log(userAccountList.accountname);
                              isUser = true;
                              if (userFound == null) {
                                userFound = findUser;
                              }
                              userInAccounts.push(userAccountList);
                            }
                      });
                      if(userInAccounts.length > 0){
                        console.log('User found || email: \'%s\' || userid: \'%s\'', userFound.email, userFound.id)
                        console.log('Account ID ||  Account Name                      || Status ')
                        userInAccounts.forEach(function(account){
                            var findUser = account.users.find( ({id}) => id == userFound.id)
                            var userRole;
                            if(findUser != undefined && findUser != null) {
                               // console.log('Found user: ' +findUser.id);
                               // console.log(userList.accountname);
                                userRole = findUser.role;
                            } 

                              if(argv.d == false){
                                api.deleteUser(account.accountid, userFound.id)
                                .then(function(response){
                                    console.log('%s    ||  %s    || Deletion success', account.accountid, account.accountname.padEnd(30));
                                })
                                .catch((function(err){
                                    console.log('%s    ||  %s    || Deletion failed', account.accountid, account.accountname.padEnd(30));
                                }))
                              } else {
                                console.log('%s    ||  %s    || Pending Deletion', account.accountid, account.accountname.padEnd(30));
                              }
                        })
                    } else {
                        console.log('User \'%s\' not found within partnership', user[key])
                    }
                })
          }
    });  
  })

};

if ($http == null) { var $http = require('request-promise'); }
var jsonfile = require('jsonfile')
var fs = require('fs');
var assert = require('assert');
var csv = require('csv-parser')
var yargs = require('yargs')
var config = require('./config.json');

var partnerID = config.partnerID
var partnershipAPIKey = config.partnershipAPIKey

module.exports ={
//Show account in partnership
searchAccount : function searchAccount(accountid){
                    return new Promise((resolve, reject) =>{
                        var Options = {
                            uri: 'https://rpm.newrelic.com/api/v2/partners/'+partnerID+'/accounts/'+accountid,
                            headers: {'Accept': 'application/json', 'X-Api-Key': partnershipAPIKey}
                        }
                        $http.get(Options)
                        .then(function(response){
                            var responseObject = JSON.parse(response);
                            resolve(responseObject);
                        }).catch(function(error){
                            if (error.statusCode == 403){
                                console.log('403 error - this account does NOT belong in the partnership')
                            }
                            else {
                                console.log(error.message);
                            }
                        }) 
                    })
                },
//List all accounts in partnership
listAccount : function listAccount(){
                   return new Promise((resolve, reject) =>{
                        var Options = {
                            uri: 'https://rpm.newrelic.com/api/v2/partners/'+partnerID+'/accounts/',
                            headers: {'Accept': 'application/json', 'X-Api-Key': partnershipAPIKey}
                        }
                        $http.get(Options)
                        .then(function(response){
                            var accountsArray = JSON.parse(response).accounts;
                            var activeAccountsArray = [];
                            accountsArray.forEach(function(account){
                                if(account.status != 'cancelled'){
                                    activeAccountsArray.push(account)
                                }
                            })
                            resolve(activeAccountsArray);
                        }).catch(function(error){
                                console.log(error.message);
                        }) 
                    })
                },
//List all users in an account                
listUsersFromAccount : function listUsersFromAccount(accountid, accountname){

                   return new Promise((resolve, reject) =>{
                        var Options = {
                            uri: 'https://rpm.newrelic.com/api/v2/partners/'+partnerID+'/accounts/'+accountid+'/users',
                            headers: {'Accept': 'application/json', 'X-Api-Key': partnershipAPIKey},
                            timeout: 15000
                        }
                        $http.get(Options)
                        .then(function(response){
                            var resultObject = JSON.parse(response);
                            return {
                                accountid: accountid,
                                accountname: accountname,
                                users: resultObject.users
                            }
                        }).then(function(response){
                            resolve(response);
                        }).catch(function(error){
                            if (error.statusCode == 403){
                                console.log('403 error - this account does NOT belong in the partnership')
                            }
                            else {
                                console.log(error.message);
                            }
                        }) 
                    })
                },

                ///REFACTOR
deleteAccount :  function deleteAccount(accountid){
                console.log('Trying to delete account:' +accountid);	
                var Options = {
                    uri: 'https://rpm.newrelic.com/api/v2/partners/'+partnerID+'/accounts/'+accountid,
                    headers: {'Accept': 'application/json', 'X-Api-Key': partnershipAPIKey}
                }
                $http.delete(Options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        console.log('Query success');
                    }
                    else if (response.statusCode == 202 || response.statusCode == 204){
                        console.log('Query success');
                    } else {
                        console.log(body);
                        console.log('Bad things happen >> ' + response.statusCode);
                        }
                    });
                },
deleteUser :  function deleteUser(accountid, userid){
                return new Promise((resolve, reject) => {
                    var userDeleteEndPoint = 'https://rpm.newrelic.com/api/v2/partners/'+partnerID+'/accounts/'+accountid+'/users/'+userid
                    var userDeleteOptions = {
                        uri: userDeleteEndPoint,
                        headers: {'Accept': 'application/json', 'X-Api-Key': partnershipAPIKey},
                    }
                    $http.delete(userDeleteOptions)
                    .then(function(response){
                        resolve(response)
                    })
                    .catch(function(err){
                        console.log('Failed to delete user \'%s\' for account \'%s\'',userid, accountid)
                        console.log(err.message)
                    })
                });
              },
createUser :  function createUser(email,firstName,lastName,role, accountID){
                return new Promise((resolve, reject) =>{
                    var userData = {
                        "users": [
                            {
                                "email": email,
                                "password": "testing123",
                                "first_name": firstName,
                                "last_name": lastName,
                                "owner": false,
                                "role": role
                            }
                        ]
                    };
                    var userCreateEndPoint = 'https://rpm.newrelic.com/api/v2/partners/'+partnerID+'/accounts/'+accountID+'/users'
                    var userCreationOptions = {
                    uri: userCreateEndPoint,
                    headers: {'Accept': 'application/json', 'X-Api-Key': partnershipAPIKey},
                    json: userData
                 };
                 console.log('Attempting to create user \'%s\' for account \'%s\'', email, accountID)
                 $http.post(userCreationOptions)
                 .then(function(response){
                     resolve(response)
                 })
                 .catch(function(err){
                     console.log('Failed to create user \'%s\' for account \'%s\'',email, accountID)
                     console.log(err.message)
                 })
                })
},




}

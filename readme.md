## How to install

#### Pre-requesites
You will need node and npm to install relevant dependencies, there are many resources online, here is one:
https://www.taniarascia.com/how-to-install-and-use-node-js-and-npm-mac-and-windows/
Ignore sections post-installation, you will not need to npm init

#### Configuring the CLI
Grabs all dependencies and places them in node_modules, also creates package.lock.json from package.json
```
npm install
```
Test the CLI
```
node cli.js --help
```
If this is your first time using the CLI, you will need to set the partnership ID and partnership api key in config.json

#### Examples

##### Create users in the partnership

```
./cli.js create users partnership -u techopsList.csv -m AccountsList.csv
```
Here you will have to provide a csv file with the following headers [firstName, lastName, email, account, role]

 * firstName, lastName and email accept strings
 * account can either be the accountid of the account you wish to create the user in, or if you provide an account map
 * role should be 'user' or 'admin' and rarely, 'owner'

The optional account map csv must have following headers [account_name, account_id]

 * The purpose of the account map is to allow the 'account' field in the --userlist csv to accept account names and convert them to account IDs for human readability
 * account_name accepts strings
 * account_id accepts integers
 * You can generate an account list within your partnership using the 'list accounts partnership' command
 
##### List users in the partnership
```
./cli.js list users partnership -o csv -p UsersList.csv
```

Here you can print a list of users in the partnership to console (by default) or to a csv file specified by --output and provding a path --path (by default set to './UsersList.csv')
##### Search for a user within the partnership
```
search user partnership -t email -u admin@admin.com
```
Here you can search for a given user by their user ID or their email address, if they exist then the CLI will print to console the accounts the user is associated to.

##### Delete a user within the partnership
```
./cli.js delete user partnership -t email -u admin@admin.com
```

Here you can delete a user within the partnership, much like the search above. The CLI will attempt to search for the given user, and if successful, delete the user from its associated accounts. 

##### Delete a user from an account
```
./cli.js delete user account -a 123445 -t id -u 2468123
```

You may not wish to delete a user from all accounts. Here you can delete a user from a specified account using --accountid. If you wish to see a list of accounts associated with a user before deciding which ones to delete them from, you can 'search user partnership' to return this information.

##### Delete a list of users from the partnership
```
Dry Run:
./cli.js delete users partnership -u myUserList.csv

Perform delete:
./cli.js delete users partnership -d false -u myUserList.csv
```
To delete a list of users across the partnership, provide a CSV file with an email header and the respective user emails. 
* By default, the -dryrun (-d) flag is set to true - this means that your deletion command will not execute, and you will instead receive the list of found users and the accounts in which they are found
* To perform the deletion, simply set the -dryrun (-d) flag to false as in the above example
* Ensure that the provided CSV file has 'email' in the first column header like this:

```myUserList.csv
email
test1@test.com
test2@test.com
test3@test.com
```
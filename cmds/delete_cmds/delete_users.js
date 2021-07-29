exports.command = 'users <context>'
exports.desc = 'Delete a list of users from account/partnership'
exports.builder = function (yargs) {
    return yargs.commandDir('delete_users_cmds')
    .usage('usage: $0 delete users <context>')
    .demandCommand()
    .example('$0 delete users partnership -u techopsList.csv',' || Deletes users in techopsList.csv across the partnership')


  }
exports.handler = function (argv) {}

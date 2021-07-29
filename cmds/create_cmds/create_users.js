exports.command = 'users <context>'
exports.desc = 'Creates users for account/partnership'
exports.builder = function (yargs) {
    return yargs.commandDir('create_users_cmds')
    .usage('usage: $0 create users <context>')
    .demandCommand()
    .example('$0 create users partnership -u techopsList.csv',' || Creates users in techopsList.csv')

    
  }
exports.handler = function (argv) {}
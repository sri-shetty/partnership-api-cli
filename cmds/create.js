exports.command = 'create <object> <context>'
exports.desc = 'Create user/account for a context (e.g. account, partnership)'
exports.builder = function (yargs) {
    return yargs.commandDir('create_cmds')
    .usage('usage: $0 create <object> <context>')
    .example('$0 create users partnership -u techopsList.csv',' || Creates users in techopsList.csv')

  }
exports.handler = function (argv) {}
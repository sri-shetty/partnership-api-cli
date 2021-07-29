exports.command = 'list <object> <context>'
exports.desc = 'Lists all users/accounts from a context (e.g. account, partnership)'
exports.builder = function (yargs) {
    return yargs.commandDir('list_cmds')
    .usage('usage: $0 list <object> <context>')
    .example('$0 list users account -a 123456', ' || Creates a list of users within an account and outputs to console')
    .example('$0 list accounts partnership -o csv -p ./myaccounts.csv', ' || Lists all accounts within partnership to csv')
  }
exports.handler = function (argv) {}
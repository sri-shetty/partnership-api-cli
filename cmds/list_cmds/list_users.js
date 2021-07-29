exports.command = 'users <context>'
exports.desc = 'Lists all users from account/partnership'
exports.builder = function (yargs) {
    return yargs.commandDir('list_users_cmds')
    .usage('usage: $0 list users <context>')
    .demandCommand()
    .example('$0 list users partnership -o csv -p UsersList.csv', ' || Creates a list of users within the partnership and outputs to UsersList.csv')
    .example('$0 list users account -a 123456', ' || Creates a list of users within an account and outputs to console')

  }
exports.handler = function (argv) {}

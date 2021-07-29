exports.command = 'user <context>'
exports.desc = 'Search for a user from account/partnership'
exports.builder = function (yargs) {
    return yargs.commandDir('search_user_cmds')
    .usage('usage: $0 search user <context>')
    .demandCommand()
    .example('$0 search user partnership -t email -u admin@admin.com',' || Searches for user email admin@admin.com within partnership accounts')
    .example('$0 search user account -a 123445 -u 2468123',' || Searches for user 2468123 from account 123445')

  }
exports.handler = function (argv) {}

exports.command = 'user <context>'
exports.desc = 'Delete a user from account/partnership'
exports.builder = function (yargs) {
    return yargs.commandDir('delete_user_cmds')
    .usage('usage: $0 delete user <context>')
    .demandCommand()
    .example('$0 delete user partnership -t email -u admin@admin.com',' || Deletes user email admin@admin.com within partnership accounts')
    .example('$0 delete user account -a 123445 -t id -u 2468123',' || Deletes user id 2468123 from account 123445')

  }
exports.handler = function (argv) {}

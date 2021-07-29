exports.command = 'delete <object> <context>'
exports.desc = 'Delete a user/account from a context (e.g. account, partnership)'
exports.builder = function (yargs) {
  return yargs.commandDir('delete_cmds')
}
exports.handler = function (argv) {}
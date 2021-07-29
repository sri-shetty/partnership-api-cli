exports.command = 'search <object> <context>'
exports.desc = 'Search for a user/account from a context (e.g. account, partnership)'
exports.builder = function (yargs) {
    return yargs.commandDir('search_cmds')
    .usage('usage: $0 search <object> <context>')
    .example('$0 search account partnernship -a 123445',' || Searches for accountid 12345 from partnership, returns details of the account')
    .example('$0 search user partnership -t email -u admin@admin.com',' || Searches for user email admin@admin.com within partnership accounts')

  }
exports.handler = function (argv) {}
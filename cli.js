#!/usr/bin/env node
require('yargs')
  .commandDir('cmds')
  .demandCommand()
  .usage('usage: $0 <action> <object> <context>')
  .help()
  .example('$0 search user partnernship -u 123445',' || Searches userid 12345 from partnership, returns which accounts it belongs in')
  .example('$0 list accounts partnership -o csv -p ./myaccounts.csv', ' || Lists all accounts within partnership to csv')
  .example('$0 create users partnership -u techopsList.csv',' || Creates users in techopsList.csv')
  .wrap(null)
  .argv
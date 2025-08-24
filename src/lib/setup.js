require('@sapphire/plugin-logger/register');
require('@sapphire/plugin-editable-commands/register');
require('@sapphire/plugin-subcommands/register');
const { ApplicationCommandRegistries, RegisterBehavior } = require('@sapphire/framework');
const { createColors } = require('colorette');
const { inspect } = require('util');

ApplicationCommandRegistries.setDefaultBehaviorWhenNotIdentical(RegisterBehavior.BulkOverwrite);

inspect.defaultOptions.depth = 1;

createColors({ useColor: true });
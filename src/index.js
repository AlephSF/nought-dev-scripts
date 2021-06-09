#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import chalk from 'chalk'

// commands via components
import Build, { buildInfo } from './cmds/build'
import Db, { dbInfo } from './cmds/db'
import Hello, { helloInfo } from './cmds/hello'
import Nds from './cmds/nds'
import Lint, { lintInfo } from './cmds/lint'
import Logo, { logoInfo } from './cmds/logo'
import Shell, { shellInfo } from './cmds/shell'
import Start, { startInfo } from './cmds/start'
import Stop, { stopInfo } from './cmds/stop'
import Wp, { wpInfo } from './cmds/wp'

// put the command info here to get it to show up in global help
const listedCmds = [
	buildInfo,
	dbInfo,
	lintInfo,
	shellInfo,
	startInfo,
	stopInfo,
	wpInfo,
]


const prop = k => o => o[k]
const pipe = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)

const nds = () => {
	let subCmdList = ''
	listedCmds.forEach((cmdInfo) => {
		subCmdList = subCmdList + chalk`{bold ${cmdInfo.name}}		{dim ${cmdInfo.desc}}\n`
	})

const globalHelp = chalk`
{cyan.dim Usage}
{bold nds} {dim [subcommands]}

{cyan.dim Available subcommands}
${subCmdList}

{cyan.dim Global Flags}
{bold --help}	{dim Get help for any command}
	`
return {
	cli: meow(globalHelp),
	action: () => render(<Nds helpText={globalHelp} />)
}}

nds.build = () => ({
	cli: meow(buildInfo.help, {
		description: chalk`{bold.cyan "${buildInfo.name}"} {cyan.dim ${buildInfo.desc}}`,
	}),
	action: () => render(<Build />)
})

nds.db = () => ({
	cli: meow(dbInfo.help, {
		description: chalk`{bold.cyan "${dbInfo.name}"} {cyan.dim ${dbInfo.desc}}`,
	}),
	action: ({input, flags, showHelp}) => render(<Db input={input} flags={flags} showHelp={showHelp} />)
})

nds.hello = () => ({
	cli: meow(helloInfo.help, {
		description: chalk`{bold.cyan "${helloInfo.name}"} {cyan.dim ${helloInfo.desc}}`,
	}),
	action: ({input, flags, showHelp}) => render(<Hello input={input} flags={flags} showHelp={showHelp} />)
})

nds.lint = () => ({
	cli: meow(lintInfo.help, {
		description: chalk`{bold.cyan "${lintInfo.name}"} {cyan.dim ${lintInfo.desc}}`,
	}),
	action: ({input, flags, showHelp}) => render(<Lint input={input} flags={flags} showHelp={showHelp} />)
})

nds.logo = () => ({
	cli: meow(logoInfo.help, {
		description: chalk`{bold.cyan "${logoInfo.name}"} {cyan.dim ${logoInfo.desc}}`,
	}),
	action: () => render(<Logo />)
})

nds.shell = () => ({
	cli: meow(shellInfo.help, {
		description: chalk`{bold.cyan "${shellInfo.name}"} {cyan.dim ${shellInfo.desc}}`,
	}),
	action: ({input}) => render(<Shell input={input} />)
})

nds.start = () => ({
	cli: meow(startInfo.help, {
		description: chalk`{bold.cyan "${startInfo.name}"} {cyan.dim ${startInfo.desc}}`,
	}),
	action: () => render(<Start />)
})

nds.stop = () => ({
	cli: meow(stopInfo.help, {
		description: chalk`{bold.cyan "${stopInfo.name}"} {cyan.dim ${stopInfo.desc}}`,
	}),
	action: () => render(<Stop />)
})

nds.wp = () => ({
	cli: meow(wpInfo.help, {
		description: chalk`{bold.cyan "${wpInfo.name}"} {cyan.dim ${wpInfo.desc}}`,
	}),
	action: ({input, flags}) => render(<Wp input={input} flags={flags} />)
})

const getSubcommand = (cliObject, level) => pipe(
	prop('input'),
	prop(level),
	name => prop(name)(cliObject),
)(prop('cli')(cliObject()))

const cli = (cliObject, level = 0) => {
	const { cli: nextCli, action } = cliObject()
	const subCommand = getSubcommand(cliObject, level)
	return subCommand ? 
			cli(subCommand, level + 1) :
			nextCli.flags.help ?
					nextCli.showHelp() :
					action(nextCli)
}

cli(nds)
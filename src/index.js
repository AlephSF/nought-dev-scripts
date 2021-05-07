#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import chalk from 'chalk'

// commands via components
import Build, { buildInfo } from './cmds/build'
import Db, { dbInfo } from './cmds/db'
import Nds from './cmds/nds'
import Logo from './cmds/logo/Logo'
import Start, { startInfo } from './cmds/start'
import Stop from './cmds/stop'

const listedCmds = [
	buildInfo,
	dbInfo,
	startInfo,
]

import snakeCaseKeys from 'snakecase-keys'
import Sync from './cmds/wp/Sync'
import output from './utils/output'

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
{bold shell}		{dim Shell into your project's running Docker container}
{bold stop}		{dim Stop the running Docker Compose stack}
{bold wp}		{dim WordPress-specific operations}

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

nds.logo = () => ({
	cli: meow(`
			Usage
				$ nds logo

			Description
				Show the Aleph Logo.
	`),
	action: () => render(<Logo />)
})

nds.shell = () => ({
	cli: meow(`
			Usage
				$ nds shell [container (Default: wordpress)]

			Description
				Shell into the current Docker container.
	`),
	action: ({input}) => {
		const container = input.length > 1 ? input[1] : 'wordpress'

		spawn(`docker-compose exec ${container} bash`, { stdio: 'inherit', shell: true })
	}
})

nds.start = () => ({
	cli: meow(startInfo.help, {
		description: chalk`{bold.cyan "${startInfo.name}"} {cyan.dim ${startInfo.desc}}`,
	}),
	action: () => render(<Start />)
})

nds.stop = () => ({
	cli: meow(`
			Usage
				$ nds stop

			Description
				Starts your project locally.
	`),
	action: () => render(<Stop />)
})

nds.wp = () => ({
	cli: meow(`
			Usage
				$ nds wp <command> <flags>

			Description
				Run a WP ClI command in a running Docker container in the current project.
	`),
	action: ({input, flags}) => {
		if(input[1] === 'init'){
			wpInit()
			return
		}

		if(input[1] === 'sync'){
			render(<Sync />)
			return
		}

		const cliCmd = input.slice(1).join(' ')
		const cliFlags = ['--allow-root'] // need this shazz to run in the Docker process
		if (flags && Object.keys(flags).length !== 0 && flags.constructor === Object) {
			for (const [key, value] of Object.entries(snakeCaseKeys(flags))) {
				const prefix = key.length > 1 ? '--' : '-'
				const val = value === true ? '' : `=${value}`
				const flag = `${prefix}${key}${val}`
				cliFlags.push(flag)
			}
		}
		const flagStr = cliFlags.join(' ')

		const wp = exec(`docker compose exec -T wordpress wp ${cliCmd} ${flagStr}`, { stdio: 'inherit' })
		output(wp)
	}
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
#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'
import meow from 'meow'

// commands via components
import Build from './cmds/build'
import Hi from './Hi'
import Logo from './cmds/logo/Logo'
import Start from './cmds/start'
import Stop from './cmds/stop'

import snakeCaseKeys from 'snakecase-keys'
import Sync from './cmds/wp/Sync'
import output from './utils/output'

const prop = k => o => o[k]
const pipe = (...fns) => x => [...fns].reduce((acc, f) => f(acc), x)

const nds = () => ({
	cli: meow(`
			Usage
			$ nds [command]
			Available Commands
			$ nds publish
			$ nds latest
	`),
	// action: cli => cli.showHelp(),
	action: () => render(<Hi />)
})

nds.build = () => ({
	cli: meow(`
			Usage
				$ nds build

			Description
				Builds your project for production, locally.
	`),
	action: () => render(<Build />)
})

nds.db = () => ({
	cli: meow(`
			Usage
				$ nds db

			Description
				Open local database in SQL Pro.
	`),
	action: ({input, flags, showHelp}) => {
		
		if(input.length < 2){
			showHelp()
		}

		let dbCmd
		switch (input[1]) {
			case 'open':
				dbCmd = exec(`${__dirname}/cmds/db/db-open.sh`)
				break;
			
			case 'dump':
				dbCmd = exec('docker-compose exec -T db /usr/bin/mysqldump -u wordpress --password=wordpress wordpress > dumps/local_dump.sql && gzip -f dumps/local_dump.sql')
				break;

			case 'import':
				dbCmd = exec(`cat dumps/local_dump.sql.gz | zcat | docker-compose exec -T db /usr/bin/mysql -u wordpress --password=wordpress wordpress`)
				break;

			default:
				showHelp()
				break;
		}
		output(dbCmd)
	}
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
	cli: meow(`
			Usage
				$ nds start

			Description
				Starts your project locally.
	`),
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
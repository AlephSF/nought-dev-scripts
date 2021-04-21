#!/usr/bin/env node
import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import Hi from './components/Hi'
import Init from './components/Init'
import Logo from './components/Logo'

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

nds.init = () => ({
	cli: meow(`
			Usage
					$ nds init
			Description
					Initializes NDS configs in an existing project directory.
	`),
	action: () => render(<Init />)
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
import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import snakeCaseKeys from 'snakecase-keys'
import { exec } from 'child_process'
import wpInit from './init'
import Sync from './Sync'

export default {
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
		wp.stdout.on('data', function (data) {
			console.log(data.toString());
		});
		
		wp.stderr.on('data', function (data) {
			console.log(data.toString());
		});
		
		wp.on('exit', function (code) {
			console.log('child process exited with code ' + code.toString());
		});
	}
}

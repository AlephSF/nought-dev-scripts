import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import { spawn } from 'child_process'

export default {
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
}

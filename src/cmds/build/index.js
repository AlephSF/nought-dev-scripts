import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import Build from './Build'

export default {
	cli: meow(`
			Usage
				$ nds build

			Description
				Builds your project for production, locally.
	`),
	action: () => render(<Build />)
}

import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import Logo from './Logo'

export default {
	cli: meow(`
			Usage
				$ nds logo

			Description
				Show the Aleph Logo.
	`),
	action: () => render(<Logo />)
}

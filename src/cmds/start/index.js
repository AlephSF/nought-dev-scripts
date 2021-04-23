import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import Start from './Start'

export default {
	cli: meow(`
			Usage
				$ nds start

			Description
				Starts your project locally.
	`),
	action: () => render(<Start />)
}

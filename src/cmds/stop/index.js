import meow from 'meow'
import childProcess from 'child_process'

export default {
	cli: meow(`
			Usage
				$ nds stop

			Description
				Starts your project locally.
	`),
	action: () => {
		const stop = childProcess.spawn('docker', ['compose', 'down'])

    stop.stdout.on('data', (data) => {
			console.log('stdout: ' + data.toString())
    })

		stop.stderr.on('data', (data) => {
			console.log('stderr: ' + data.toString())
    })

	}
}

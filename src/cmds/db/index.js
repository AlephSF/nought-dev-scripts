import meow from 'meow'
import childProcess from 'child_process'

export default {
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
				dbCmd = childProcess.exec(`${__dirname}/db-open.sh`)
				break;
		
			default:
				showHelp()
				break;
		}

    dbCmd.stdout.on('data', (data) => {
			console.log(data.toString())
    })

		dbCmd.stderr.on('data', (data) => {
			console.log(data.toString())
    })

	}
}

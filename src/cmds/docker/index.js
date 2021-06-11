import React, { useEffect } from 'react'
import chalk from 'chalk'

// import ErrorMsg from '../error'

import shellCmd from '../../utils/shellCmd'

export const dockerInfo = {
	name: 'docker',
	desc: 'Various Docker shortcuts',
	help: chalk`
{cyan.dim Usage}
{bold nds docker	[subcommand]}

{cyan.dim Subcommands}
{bold stop-all}	Stops all running containers
`
}

const Docker = ({input, showHelp}) => {
	// const [errorMsg, setErrorMsg] = useState(false);
	let cmdToRun = false
	useEffect(() => {
		switch (input[1]) {
			case 'stop-all':
				cmdToRun = 'docker stop $(docker ps -a -q)'
				break
		
			default:
				break
		}

		if(cmdToRun){
			shellCmd(cmdToRun)
		} else {
			showHelp()
		}

		// if(somethingsWrong === true){
		// 	setErrorMsg("Something is wrong!")
		// }

	}, []);

	return null
	// return (
	// 	<>
	// 		{errorMsg && <ErrorMsg msg={errorMsg} />}
	// 	</>
	// )
};

export default Docker

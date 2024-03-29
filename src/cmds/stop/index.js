import React, { useState, useEffect } from 'react'
import chalk from 'chalk'
import { existsSync } from 'fs'

import Ask from '../config/Ask'
import ErrorMsg from '../error'

import getConfig, { setConfig } from '../../utils/config'
import shellCmd from '../../utils/shellCmd'

export const stopInfo = {
	name: 'stop',
	desc: 'Stop the currently running Docker stack.',
	help: chalk`
{cyan.dim Usage}
{bold nds stop}
`
}


const Stop = () => {
	const [projectType, setProjectType] = useState(getConfig('projectType'))
	const [errorMsg, setErrorMsg] = useState(false);


	useEffect(() => {
		if(projectType && !getConfig('projectType')){
			// type isn't in config but we know what it is now, so set it in stone
			setConfig({projectType})
		}

		// make sure there's a Compose file
		if(projectType && !existsSync('docker-compose.yml')){
			setErrorMsg('No docker-compose.yml present in the current directory, so I\'m gonna bail.')
		}

		// run it!
		if(projectType && existsSync('docker-compose.yml')){
			shellCmd('docker compose down')
		}

	}, [projectType])

	return (
		<>
			{projectType ? null : <Ask configKey='projectType' setValue={setProjectType} />}
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	);
};

export default Stop

import React, { useState, useEffect } from 'react'
import chalk from 'chalk'
import { existsSync } from 'fs'
import { spawn } from 'child_process'

import Ask from '../config/Ask'
import ErrorMsg from '../error'

import getConfig, { setConfig } from '../../utils/config'

export const shellInfo = {
	name: 'shell',
	desc: 'Open a bash shell in a project\'s Docker container.',
	help: chalk`
{cyan.dim Usage}
{bold nds shell}
`
}

const Shell = ({input}) => {
	const [projectType, setProjectType] = useState(getConfig('projectType'))
	const [errorMsg, setErrorMsg] = useState(false);

	useEffect(() => {
		if(projectType && !getConfig('projectType')){
			// type isn't in config but we know what it is now, so set it in stone
			setConfig({projectType})
		}

		// make sure there's a Docker Compose File
		if(projectType && !existsSync('docker-compose.yml')){
			setErrorMsg('No docker-compose.yml present in the current directory, so I\'m gonna bail.')
		}

		// run it!
		if(projectType && existsSync('docker-compose.yml')){
			// TODO: Be smarter here... Check to see if Docker is running anything and output errors.
			const container = input.length > 1 ? input[1] : 'wordpress'
			spawn(`docker-compose exec ${container} bash`, { stdio: 'inherit', shell: true })
		}

	}, [projectType])

	return (
		<>
			{projectType ? null : <Ask configKey='projectType' setValue={setProjectType} />}
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	);
};

export default Shell

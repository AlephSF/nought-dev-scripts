import React, { useState, useEffect } from 'react'
import chalk from 'chalk'
import { existsSync } from 'fs'
import path from 'path'

import Ask from '../config/Ask'
import ErrorMsg from '../error'

import getConfig, { setConfig } from '../../utils/config'
import getDirectories from '../../utils/getDirectories'
import shellCmd from '../../utils/shellCmd'

export const startInfo = {
	name: 'start',
	desc: 'Start your project as a Docker Compose stack.',
	help: chalk`
{cyan.dim Usage}
{bold nds start}
`
}

const projectName = path.basename(path.resolve()) 

const Start = () => {
	const [projectType, setProjectType] = useState(getConfig('projectType'))
	const [errorMsg, setErrorMsg] = useState(false);


	useEffect(() => {
		if(projectType && !getConfig('projectType')){
			// type isn't in config but we know what it is now, so set it in stone
			setConfig({projectType})
		}

		// make sure there's a Dockerfile
		if(projectType && !existsSync('docker-compose.yml')){
			setErrorMsg('No docker-compose.yml present in the current directory, so I\'m gonna bail.')
		}

		// spawn('sh', ['-c', ''], { stdio: 'inherit', env: {...process.env, 'PROJECT_NAME': projectName, 'THEME_DIR': themeDirs[0]}})
		
		let env = {'PROJECT_NAME': projectName}
		let cmdPrefix = ''
		const themeDirs = getDirectories('themes') // see if there's a WP theme in here
		switch (projectType) {
			case 'noughtWp':
				// Only works if there's a single dir in themes.. TODO: fix this
				env = {'PROJECT_NAME': projectName, 'THEME_DIR': themeDirs[0]}
				break;
		
			case 'wpVip':
				cmdPrefix = 'docker compose pull && '
				break;
		
			default:
				break;
		}

		// run it!
		if(projectType && existsSync('docker-compose.yml')){
			shellCmd(`${cmdPrefix}docker compose up`, env)
		}

	}, [projectType])

	return (
		<>
			{projectType ? null : <Ask configKey='projectType' setValue={setProjectType} />}
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	);
};

export default Start

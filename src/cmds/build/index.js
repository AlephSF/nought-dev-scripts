import React, { useState, useEffect } from 'react'
import chalk from 'chalk'
import { existsSync } from 'fs'
import path from 'path'

import Ask from '../config/Ask'
import ErrorMsg from '../error'

import getConfig, { setConfig } from '../../utils/config'
import getDirectories from '../../utils/getDirectories'
import shellCmd from '../../utils/shellCmd'

export const buildInfo = {
	name: 'build',
	desc: 'Builds your project from a Dockerfile.',
	help: chalk`
{cyan.dim Usage}
{bold nds build}
`
}

const projectName = path.basename(path.resolve()) 

const Build = () => {
	const [projectType, setProjectType] = useState(getConfig('projectType'))
	const [errorMsg, setErrorMsg] = useState(false);

	useEffect(() => {
		if(projectType && !getConfig('projectType')){
			// type isn't in config but we know what it is now, so set it in stone
			setConfig({projectType})
		}

		// make sure there's a Dockerfile
		if(projectType && !existsSync('Dockerfile')){
			setErrorMsg('No Dockerfile present in the current directory, so I\'m gonna bail.')
		}

		// Set build args if we need them
		let buildArgs = ''
		const themeDirs = getDirectories('themes') // see if there's a WP theme in here
		switch (projectType) {
			case 'noughtWp':
				// Only works if there's a single dir in themes.. TODO: fix this
				buildArgs = themeDirs ? ` --build-arg PHP_ENV=dev --build-arg THEME_SLUG=${themeDirs[0]}` : ' '
				break;
		
			default:
				break;
		}
		// run it!
		if(projectType && existsSync('Dockerfile')){
			shellCmd(`docker build${buildArgs} -t ${projectName} .`)
		}

	}, [projectType]);

	return (
		<>
			{projectType ? null : <Ask configKey='projectType' setValue={setProjectType} />}
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	)
};

export default Build

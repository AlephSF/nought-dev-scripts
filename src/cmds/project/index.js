import React, { useState, useEffect } from 'react'
import chalk from 'chalk'
import { UncontrolledTextInput } from 'ink-text-input'
import { Box, Text } from 'ink'

import Ask from '../config/Ask'
import ErrorMsg from '../error'

import getConfig, { setConfig } from '../../utils/config'
import shellCmd from '../../utils/shellCmd'

export const projectInfo = {
	name: 'project',
	desc: 'Create and administer a code project.',
	help: chalk`
{cyan.dim Usage}
{bold nds project	[create]	<project-slug>}

{cyan.dim Examples}
{bold project create my-project-someplatform}
{dim Bootstraps a new project in a folder called my-project-someplatform}
`
}

const Project = ({input, showHelp}) => {
	const [projectSlug, setProjectSlug] = useState(input[2] || false)
	const [projectType, setProjectType] = useState(getConfig('projectType'))
	const [errorMsg, setErrorMsg] = useState(false);

	useEffect(() => {
		if(input[1] !== 'create'){
			showHelp()
		}

		if(projectType && !getConfig('projectType')){
			setConfig({projectType})
		}

		if(projectSlug && projectType){

			let templateRepoFlag = ''
			switch (projectType) {
				case 'noughtWp':
					templateRepoFlag = ' --template AlephSF/nought-wp'
					break;

				case 'next':
					templateRepoFlag = ' --template AlephSF/nought-nextjs'
					break;
					
				default:
					break;
			}
			let instructions = `git init ${projectSlug}
				cp .ndsconfig.json ${projectSlug}
				cd ${projectSlug} 
				gh repo create AlephSF/${projectSlug} --confirm --private${templateRepoFlag}
				git pull origin main`
			shellCmd(instructions)
		}



		// switch (projectType) {
		// 	case 'noughtWp':
		// 		const cmdToRun = 'ls -al'
		// 		break;
		
		// 	default:
		// 		break;
		// }

		// // run it!
		// if(projectType && projectType === 'noughtWp'){
		// 	shellCmd(cmdToRun)
		// }

		// if(somethingsWrong === true){
		// 	setErrorMsg("Something is wrong!")
		// }

	}, [projectType, projectSlug]);

	return (
		input[1] === 'create' ? <>
			{!projectSlug && 
				<>
					<Box padding="2" width="70%">
						<Text color="#eb6e95">
							Please enter the project slug:
						</Text>
					</Box>
					<UncontrolledTextInput onSubmit={(query) => setProjectSlug(query)} />
				</>}
			{projectSlug && !projectType && <Ask configKey='projectType' setValue={setProjectType} />}
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</> : null
	)
};

export default Project

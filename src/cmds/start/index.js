import React, { useState, useEffect } from 'react'
import chalk from 'chalk'
import { existsSync } from 'fs'
import path from 'path'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

import Ask from '../config/Ask'
import ErrorMsg from '../error'

import getConfig, { setConfig } from '../../utils/config'
import getDirectories from '../../utils/getDirectories'
import shellCmd from '../../utils/shellCmd'

const client = new SecretManagerServiceClient();
const secretName = 'projects/aleph-infra/secrets/migrate_db_pro_key/versions/latest';

const getToken = async () => {
  const [version] = await client.accessSecretVersion({
    name: secretName,
  })

  // Extract the payload as a string.
  const payload = version.payload.data.toString()

  // WARNING: Do not print the secret in a production environment - this
  // snippet is showing how to access the secret material.
	return payload
}


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


	useEffect(async () => {
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
		const themeDirs = projectType =='noughtWp' && getDirectories('themes') // see if there's a WP theme in here
		switch (projectType) {
			case 'noughtWp':
				// Only works if there's a single dir in themes.. TODO: fix this
				const token = await getToken()
				env = {'PROJECT_NAME': projectName, 'THEME_DIR': themeDirs[0], 'WPMDB_LICENCE': token}
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

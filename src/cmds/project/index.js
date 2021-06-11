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

{cyan.dim Flags}
{bold --create-env-dbs}	Will create edge and pr sql DBs for WP Nought projects

{cyan.dim Examples}
{bold project create my-project-someplatform}
{dim Bootstraps a new project in a folder called my-project-someplatform}
`
}

const Project = ({input, flags, showHelp}) => {
	const [projectSlug, setProjectSlug] = useState(input[2] || false)
	const [projectType, setProjectType] = useState(getConfig('projectType'))
	const [migrateDbUrl, setMigrateDbUrl] = useState(getConfig('migrateDbUrl'))
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
mv .ndsconfig.json ${projectSlug}/.ndsconfig.json
cd ${projectSlug} 
gh repo create AlephSF/${projectSlug} --confirm --private${templateRepoFlag}
git pull origin main`

			if(flags.createEnvDbs && projectType === 'noughtWp'){
				instructions = `${instructions}
gcloud sql databases create ${projectSlug}-edge  --instance=destructible-sandbox
gcloud sql databases create ${projectSlug}-prs  --instance=destructible-sandbox
nds cloudsql start
docker run --network cloud_sql_proxy -e "DB_HOST=cloud_sql_proxy:3306" -e "DB_USER=proxyadmin" -e "DB_PASSWORD=" -e "DB_NAME=${projectSlug}-edge"  -e "WP_HOME=https://${projectSlug}-edge.phela.dev" -e "WP_SITEURL=https://${projectSlug}-edge.phela.dev/wp" gcr.io/aleph-infra/nought-wp:v0.0.1 sh -c "/start.sh && wp core install --url=https://${projectSlug}-edge.phela.dev --title=temp --admin_user=temp --admin_email=temp@example.com --admin_password=temp --allow-root && wp plugin activate wp-migrate-db-pro wp-migrate-db-pro-cli --allow-root"
docker run --network cloud_sql_proxy -e "DB_HOST=cloud_sql_proxy:3306" -e "DB_USER=proxyadmin" -e "DB_PASSWORD=" -e "DB_NAME=${projectSlug}-prs"  -e "WP_HOME=https://${projectSlug}-prs.phela.dev" -e "WP_SITEURL=https://${projectSlug}-prs.phela.dev/wp" gcr.io/aleph-infra/nought-wp:v0.0.1 sh -c "/start.sh && wp core install --url=https://${projectSlug}-prs.phela.dev --title=temp --admin_user=temp --admin_email=temp@example.com --admin_password=temp --allow-root && wp plugin activate wp-migrate-db-pro wp-migrate-db-pro-cli --allow-root"`
					
				if(flags.sync && migrateDbUrl){
					instructions = `${instructions}
docker run --network cloud_sql_proxy -e "DB_HOST=cloud_sql_proxy:3306" -e "DB_USER=proxyadmin" -e "DB_PASSWORD=" -e "DB_NAME=${projectSlug}-edge"  -e "WP_HOME=https://${projectSlug}-edge.phela.dev" -e "WP_SITEURL=https://${projectSlug}-edge.phela.dev/wp" gcr.io/aleph-infra/nought-wp:v0.0.1 sh -c "/start.sh && wp migratedb pull ${migrateDbUrl} --allow-root"
docker run --network cloud_sql_proxy -e "DB_HOST=cloud_sql_proxy:3306" -e "DB_USER=proxyadmin" -e "DB_PASSWORD=" -e "DB_NAME=${projectSlug}-prs"  -e "WP_HOME=https://${projectSlug}-prs.phela.dev" -e "WP_SITEURL=https://${projectSlug}-prs.phela.dev/wp" gcr.io/aleph-infra/nought-wp:v0.0.1 sh -c "/start.sh && wp migratedb pull ${migrateDbUrl} --allow-root"`
				}

				instructions = `${instructions}
nds cloudsql stop`
			}

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

	}, [projectType, projectSlug, migrateDbUrl]);

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
			{!errorMsg && projectType && flags.sync && !migrateDbUrl && <Ask configKey='migrateDbUrl' setValue={setMigrateDbUrl} />}
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</> : null
	)
};

export default Project

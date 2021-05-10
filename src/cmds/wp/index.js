import React, { useState, useEffect } from 'react'
import chalk from 'chalk'
import open from 'open'
import wpInit from './init'
import cli from './cli'
import shellCmd from '../../utils/shellCmd'
import Ask from '../config/Ask'
import ErrorMsg from '../error'

import getConfig, { setConfig } from '../../utils/config'

export const wpInfo = {
	name: 'wp',
	desc: 'Run WP ClI commands in a running Docker container.',
	help: chalk`
{cyan.dim Usage}
{bold nds wp [command]}

{cyan.dim Useful Shortcuts}
{bold init}
{dim Installs a blank WP instance in your local DB with 
user/pass set to} \`temp\` {dim and WP Migrate DB Pro ready to pull}

{bold sync}
{dim Pulls the latest DB from your set environment using WPMDB}

{bold docs <WP-CLI command>}
{dim Opens a browser to the official WordPress CLI docs.}

{cyan.dim Examples}
{bold nds wp core version}
{dim Outputs the current version of WP}

{bold nds wp search-replace --url=example.com 'example.com' 'localhost:8080' 'wp_options'}
{dim Replace all instances of example.com with localhost:8080 in the wp_options table.}

{bold nds wp docs option}
{dim Opens the docs for the \`option\` command tree in a browser.}
`
}

const Wp = ({input, flags}) => {
	const [projectType, setProjectType] = useState(getConfig('projectType'))
	const [migrateDbUrl, setMigrateDbUrl] = useState(getConfig('migrateDbUrl'))
	const [errorMsg, setErrorMsg] = useState(false);

	useEffect(() => {
		if(projectType && !getConfig('projectType')){
			// type isn't in config but we know what it is now, so set it in stone
			setConfig({projectType})
		}

		// make sure there's a Docker Compose File
		if(projectType && projectType !== 'noughtWp' && projectType !== 'wpVip'){
			setErrorMsg('This isn\'t a WordPress project, silly.')
		} else {
			if(input[1] === 'init'){
				wpInit()
			} else if(input[1] === 'sync'){
				if(migrateDbUrl){
					if(!getConfig('migrateDbUrl')){
						setConfig({migrateDbUrl})
					}
					shellCmd(`nds wp migratedb pull ${migrateDbUrl}`)
				}
			} else if(input[1] === 'docs'){
				const base = 'https://developer.wordpress.org/cli/commands/'
				const docsUrl = `${base}${input[2] ? input[2] : ''}/`
				open(docsUrl)
			} else {
				cli({input, flags})
			}

		}

	}, [projectType, migrateDbUrl])

	return (
		<>
			{!errorMsg && !projectType && <Ask configKey='projectType' setValue={setProjectType} />}
			{!errorMsg && projectType && input[1] === 'sync' && !migrateDbUrl && <Ask configKey='migrateDbUrl' setValue={setMigrateDbUrl} />}
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	);
};

export default Wp

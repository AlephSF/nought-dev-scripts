import React, { useState, useEffect } from 'react'
import chalk from 'chalk'

// import Ask from '../config/Ask'
import ErrorMsg from '../error'

// import getConfig, { setConfig } from '../../utils/config'
import shellCmd from '../../utils/shellCmd'

export const cloudsqlInfo = {
	name: 'cloudsql',
	desc: 'Manage a proxy connection to Cloud SQL on GCP',
	help: chalk`
{cyan.dim Usage}
{bold nds cloudsql	[start|stop]}

{cyan.dim Subcommands}
{bold start}	Starts a proxy to the Cloud SQL sandbox instance at :3306
{bold stop}	Stops the Cloud SQL Proxy
`
}

const CloudSql = ({input, showHelp}) => {
	// const [errorMsg, setErrorMsg] = useState(false);

	useEffect(() => {
		let cmdToRun
		switch (input[1]) {
			case 'start':
				cmdToRun = `docker network create cloud_sql_proxy
docker run -d --network cloud_sql_proxy --name cloud_sql_proxy -p 127.0.0.1:3306:3306 -v ~/.config/gcloud/application_default_credentials.json:/config gcr.io/cloudsql-docker/gce-proxy:1.19.1 /cloud_sql_proxy -instances=aleph-infra:us-west1:destructible-sandbox=tcp:0.0.0.0:3306 -credential_file=/config`
				break;
	
			case 'stop':
				cmdToRun = `docker stop cloud_sql_proxy
docker rm cloud_sql_proxy
docker network rm cloud_sql_proxy`
				break;

			default:
				break;
		}

		if(cmdToRun){
			shellCmd(cmdToRun)
		} else {
			showHelp()
		}

	}, []);

	return null
	// return (
	// 	<>
	// 		{/* {projectType ? null : <Ask configKey='projectType' setValue={setProjectType} />} */}
	// 		{/* {errorMsg && <ErrorMsg msg={errorMsg} />} */}
	// 	</>
	// )
};

export default CloudSql

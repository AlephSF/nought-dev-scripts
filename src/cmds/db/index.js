import React, { useState, useEffect } from 'react'
import chalk from 'chalk'
import { existsSync } from 'fs'
import ErrorMsg from '../error'
import shellCmd from '../../utils/shellCmd'

export const dbInfo = {
	name: 'db',
	desc: 'Local database operations via Docker Compose.',
	help: chalk`
{cyan.dim Usage}
{bold nds db} {dim [open | dump | import]}

{cyan.dim Flags}
{bold -d} || {bold --database}	database name	{dim (Default: wordpress)}
{bold -u} || {bold --user}		user name	{dim (Default: wordpress)}
{bold -m} || {bold --dump}		path to dump	{dim (Default: dumps/local_dump.sql.gz)}
{bold -p} || {bold --password}	password	{dim (Default: wordpress)}

{cyan.dim Examples}
{bold nds db open}
{dim Opens the dabases in the SQL Pro GUI if installed}

{bold nds db dump -d foo --user bar}
{dim Dumps a db called "foo" using a user account "bar" and
password "wordpress" to dumps/local_dump.sql.gz}

{bold nds db import}
{dim Replaces local DB called "wordpress" with dump at
dumps/local_dump.sql.gz}

{bold.cyan NB!}
{cyan You must have a running Docker service called "DB" in your 
local project to use these commands.}
`
}

const Db = ({input, flags, showHelp}) => {
	const [errorMsg, setErrorMsg] = useState(false);

	useEffect(() => {
		// // make sure there's a Dockerfile
		// if(projectType && !existsSync('docker-compose.yml')){
		// 	setErrorMsg('No docker-compose.yml present in the current directory, so I\'m gonna bail.')
		// }
		
		if(input.length < 2){
			showHelp()
		}
		
		const user = flags.u || flags.user || 'wordpress' 
		const pass = flags.p || flags.password || 'wordpress' 
		const db = flags.d || flags.database || 'wordpress' 
		const dump = flags.m || flags.dump || 'dumps/local_dump.sql.gz' 

		let dbCmd
		switch (input[1]) {
			case 'open':
				dbCmd = `${__dirname}/db-open.sh`
				break;
			
			case 'dump':
				dbCmd = `docker-compose exec -T db /usr/bin/mysqldump -u ${user} --password=${pass} ${db} > dumps/local_dump.sql && gzip -f dumps/local_dump.sql`
				break;

			case 'import':
				// TODO: Make the path and dump file dynamic
				dbCmd = `pv ${dump} | zcat | docker-compose exec -T db /usr/bin/mysql -f -u ${user} --password=${pass} ${db}`
				break;

			default:
				showHelp()
				break;
		}
		shellCmd(dbCmd)

	}, [])

	return (
		<>
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	);
};

export default Db
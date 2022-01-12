import shellCmd from '../../utils/shellCmd'

export default async () => {
	const commands = [
		`nds wp core install --url http://localhost:8080 --title AlephNought --admin_user superuser --admin_email ping@alephsf.com --admin_password=noughtagoodpassword`,
		`nds wp plugin activate wp-migrate-db-pro wp-migrate-db-pro-cli`,
	]
	const command = commands.join(' && ')
	shellCmd(command)
}

import { exec } from 'child_process'
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { auth } from 'google-auth-library';

const client = new SecretManagerServiceClient();
const secretName = 'projects/aleph-infra/secrets/migrate_db_pro_key/versions/latest';

const output = (process) => {
	process.stdout.on('data', function (data) {
		console.log(data.toString());
	});
	
	process.stderr.on('data', function (data) {
		console.log(data.toString());
	});
	
	process.on('exit', function (code) {
		console.log('child process exited with code ' + code.toString());
	});
}

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

export default async () => {
	const token = await getToken()

	const commands = [
		`nds wp core install --url http://localhost:8080 --title temp --admin_user temp --admin_email temp@example.com --admin_password=temp`,
		`nds wp plugin activate wp-migrate-db-pro wp-migrate-db-pro-cli`,
		`nds wp config set --anchor='/**' WPMDB_LICENCE ${token}`
	]
	const command = commands.join(' && ')
	
	const init = exec(command, { stdio: 'inherit' })
	output(init)
}

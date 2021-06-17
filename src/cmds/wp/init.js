import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { auth } from 'google-auth-library';
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

export default async () => {
	const token = await getToken()

	const commands = [
		`nds wp core install --url http://localhost:8080 --title AlephNought --admin_user superuser --admin_email ping@alephsf.com --admin_password=noughtagoodpassword`,
		`nds wp plugin activate wp-migrate-db-pro wp-migrate-db-pro-cli`,
		// `nds wp config set --anchor='/**' WPMDB_LICENCE ${token}`
	]
	const command = commands.join(' && ')
	shellCmd(command)
}

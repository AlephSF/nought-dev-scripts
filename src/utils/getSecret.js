import { SecretManagerServiceClient } from '@google-cloud/secret-manager'

export default async (secretName) => {
	const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: `projects/aleph-infra/secrets/${secretName}/versions/latest`,
  })

  // Extract the payload as a string.
  const payload = version.payload.data.toString()
	return payload
}

# Aleph Nought Dev Scripts
If you are using any of Aleph's local development frameworks, this package is for you. It
makes a command `nds` available at the command line through Yarn scripts, which then gives
you access to a multitude of commands that you can run on your project to do lots of important
tasks. 

Install with `yarn add --dev @aleph/nought-dev-scripts` and then add the following line inside the
`scripts` object in your `package.json` file:
```
"nds": "nds"
```

## Prerequisites
There are specific dependencies for many commands, **TODO** these will be documented near the end of this doc. 

## Commands 
All commands below must be prefaced with `yarn nds`. most commands have a prefix depending on the
specific context that you are running the command. For example, WordPress dev environments will use `wp`, stuff to manipulate databases will be `db`, etc. 

```sh
release # Pushes new semantic version to Github, creating a release
version # Creates a new semantic version from master branch

# WordPress Environment Commands
wp build # Builds a Docker image from your local Dockerfile
wp cli -c "<WP CLI Command>" # Run any WP CLI command in your running container
wp dev # Builds and then runs your container as specified in docker-compose.yml
wp shell # Opens a bash shell inside your running container
wp start # Starts the Docker image as specified in docker-compose.yml
wp stop # Stops your Docker compose stack
wp theme-build <theme-dir> (--production) (--watch) # Pulls deps and builds your theme 

# Local Database Commands
local-db dump # Dumps your running MySQL database to /dumps/local_dump.sql.gz
local-db find-replace <source-url> # Replaces specified source URL in your local DB
local-db open # Opens your running MySQL DB in Sequel Pro
local-db restore # Restores your local DB from /dumps/local_dump.sql.gz

# Remote Database Commands
remote-db dump # Runs a dump of a prod database to a GCS Bucket
remote-db find-replace <env> <find> <replace> # Syncs latest dump from prod in GCS bucket to an env
remote-db pull # Syncs latest dump from prod in GCS bucket to an env

# Kubernetes Cluster Commands
k8s logs # Tails the logs for your current project in the env specified
k8s shell # Shell into a container in your current project in the env specified
```

## Some Helpful Examples

### Sync the WordPress production DB at https://example.com with your local environment at http://localhost:8080
```sh
# Run the latest dump to a bucket, then wait a bit
yarn nds remote-db dump

# When ready, pull the dump to your local machine (local_dump.sql.gz)
yarn nds remote-db pull

# Import to your local DB (Docker containers must be running)
yarn nds local-db restore

# Find-replace the URL (defaults to replace with http://localhost:8080)
yarn nds local-db find-replace https://example.com 
```

### Sync the WordPress production DB at https://example.com with the edge DB at http://edge.example.com
```sh
# Run the latest dump to a bucket, then wait a bit
yarn nds remote-db dump

# When ready, pull the dump to your local machine and then import to the edge DB
nds remote-db pull edge

# Find-replace the URL
yarn nds remote-db find-replace edge https://example.com https://edge.example.com
```


## Important Prerequisites
To use these commands, you will need to get a few things set up on your development machine:

- [Docker for Mac](https://hub.docker.com/editions/community/docker-ce-desktop-mac/) should be installed locally
- The latest [complete build of Sequel Pro](https://sequelpro.com/test-builds)
- The `gcloud` [command line client](https://cloud.google.com/sdk/docs/quickstart-macos), and a Google Account with GCP access to the project(s) you're using 
- The ability to run `kubectl` commands (This probably came with Docker for Mac, but you can install separately)

Once you have this software installed, you'll need to set up your Google Credentials. Assuming you've 
been granted access to a project, this is usually as easy as running `gcloud init` or and setting some
sensible defaults, like project and zone. 

If you have one or more Kubernetes clusters in GKE that you'd like to use these tools with, you'll 
need to use `gcloud container clusters get-credentials ...` to make the cluster context available on your
local machine. 

Finally, if you're working on a WordPress project locally, you'll want to make sure that some project-specific
information is available in a `package.json` `config` block to run certain commands, like this:

```json
  "config": {
    "dbBucketName": "name-of-sql-dump-bucket",
    "dbProdInstanceName": "cloud-sql-instance-for-prod-dbs",
    "dbSandboxInstanceName": "cloud-sql-instance-for-dev-dbs",
    "gcpProjectName": "your-gcp-project-name"
  },
```

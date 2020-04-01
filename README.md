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
local-db open # Opens your running MySQL DB in Sequel Pro
local-db restore # Restores your local DB from /dumps/local_dump.sql.gz

# Remote Database Commands
remote-db dump # Runs a dump of a prod database to a GCS Bucket
remote-db sync # Syncs latest dump from prod in GCS bucket to an env
```
import React from 'react'
import { render } from 'ink'
import meow from 'meow'
import Build from './Build'
import { exec } from 'child_process'
import fs from 'fs'
import path from 'path'

// good candidate for a util
const getDirectories = srcPath => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory())
const projectName = path.basename(path.resolve()) 
// get the theme directory (only works if there's a single dir in themes.. TODO: fix this)
const themeDirs = getDirectories('themes')

export default {
	cli: meow(`
			Usage
				$ nds build

			Description
				Builds your project for production, locally.
	`),
	action: () => {
		const build = exec(`docker build --build-arg PHP_ENV=dev --build-arg THEME_SLUG=${themeDirs[0]} -t ${projectName} .`, { stdio: 'inherit' })

		build.stdout.on('data', function (data) {
			console.log(data.toString());
		});
		
		build.stderr.on('data', function (data) {
			console.log(data.toString());
		});
		
		build.on('exit', function (code) {
			console.log('child process exited with code ' + code.toString());
		});
	}
	// action: () => render(<Build />)
}

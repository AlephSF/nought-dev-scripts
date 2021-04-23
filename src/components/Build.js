import React, { useState, useEffect } from 'react'
import fs, { readdirSync } from 'fs'
import path from 'path'
import childProcess from 'child_process'
import { Static, Box, Text, Newline } from 'ink'
import Gradient from 'ink-gradient'

// good candidate for a util
const getDirectories = srcPath => fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory())
			

const projectName = path.basename(path.resolve()) 

const Build = () => {
	const [projectType, setProjectType] = useState('')
	const [message, setMessage] = useState('')
	const [output, setOutput] = useState('');

	useEffect(() => {
		// look for telltale files that will determine what kind of build to run. 
		try {
			if (fs.existsSync('Dockerfile') && fs.existsSync('themes')) {
				setProjectType('WordPress')
			}
			setMessage(`Building your ${projectType} project for production...`)
		} catch(err) {
			console.error(err)
		}
	}, [projectType])

	useEffect(() => {
		if(projectType === 'WordPress'){

			// get the theme directory (only works if there's a single dir in themes.. TODO: fix this)
			const themeDirs = getDirectories('themes')
			if(themeDirs.length > 1) {
				console.log('Whoops, you have more than one theme folder... this will be fixed someday...')
				return
			}

			const subProcess = childProcess.spawn('docker', ['build', '--build-arg', 'PHP_ENV=dev', '--build-arg', `THEME_SLUG=${themeDirs[0]}`, '-t', projectName, '.'])

			subProcess.stdout.on('data', newOutput => {
				const lines = newOutput.toString('utf8').split('\n')
				setOutput(lines.join('\n'))
			})
			subProcess.stderr.on('data', err => {
				const lines = err.toString('utf8').split('\n')
				setOutput(lines.join('\n'))
			})
				
		}
	}, [setOutput, projectType]);

	return (
		<>
			<Box paddingY={2}>
				<Box borderStyle="classic" borderColor="#bbb" padding={1}>
					<Gradient name="fruit">
						{message}
					</Gradient>
				</Box>
			</Box>
			<Box>
				<Text color="blue">{output}</Text>
			</Box>
		</>
	);
};

export default Build
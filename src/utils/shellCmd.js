// Run shell commands from NodeJS
import { exec, spawn } from 'child_process'

// passthrough command, like running straight in a terminal
export default (cmd, envVars = {}, shell = false) => {
	console.log(cmd)
	spawn('sh', ['-c', cmd], {
		stdio: 'inherit',
		shell,
		env: {...process.env, ...envVars}
	})
}
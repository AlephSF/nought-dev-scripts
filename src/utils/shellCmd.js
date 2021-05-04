// Run shell commands from NodeJS
import { exec, spawn } from 'child_process'

// passthrough command, like running straight in a terminal
export default (cmd, envVars = {}) => {
	spawn('sh', ['-c', cmd], { stdio: 'inherit', env: {...process.env, ...envVars}})
}


import fs from 'fs'
import path from 'path'

export default (srcPath) => {
	let dir = false
	try {
		dir = fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory())
	} catch (error) {
		console.log({error})
	}
	return dir
}

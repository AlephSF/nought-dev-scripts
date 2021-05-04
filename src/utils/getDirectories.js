import fs from 'fs'

export default (srcPath) => {
	let dir = false
	try {
		dir = fs.readdirSync(srcPath).filter(file => fs.statSync(path.join(srcPath, file)).isDirectory())
	} catch (error) {
		// error?
	}
	return dir
}

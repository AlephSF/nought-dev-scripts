import fs, { readdirSync } from 'fs'

const configFilePath = `${process.cwd()}/.ndsconfig.json`

const getConfig = (key) => {
	let config = false
	try {
		if (fs.existsSync(configFilePath)) {
			config = require(configFilePath)
		} 
	} catch(err) {
		console.error(err)
	}
	return config && !key ? true : config && config[key] ? config[key] : false
}

export const createConfig = (configs) => {
	if(getConfig() === false){
		// no config yet... let's create one!
		if(!configs){
			console.log('No configs specified, config file NOT created!', configFilePath)
			return false
		}
		try {
			fs.writeFileSync(configFilePath, JSON.stringify(configs, null, 4))
			console.log('Config file created!', configs)
		} catch (err) {
			console.error(err)
		}
	} else {
		console.log('Config file exists! Use "updateConfig" instead.')
	}
}

export const setConfig = (configs) => {
	if(getConfig() === false){
		createConfig(configs)
		console.log('Config file created!')
	} else {
		const oldConfig = require(configFilePath)
		const newConfig = {...oldConfig, ...configs}
		fs.writeFileSync(configFilePath, JSON.stringify(newConfig))
		console.log('Config file updated!')
	}
}

export default getConfig
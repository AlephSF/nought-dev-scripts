import shellCmd from '../../utils/shellCmd'
import { snakeCase } from 'snake-case'
import kebabCaseKeys from 'kebabcase-keys'

// Here's a perfect storm of hackery. Meow forces all flags to come through in camelCase
// and won't do it any other way (see https://github.com/sindresorhus/meow/issues/106). 
// and so we want to use `kebabCaseKeys` to convert the flags back to i.e. --my-cli-flag 
// instead of --myCliFlag. The problem is that there are a few random flags in the WP 
// CLI Ecosystem that need to be SNAKE case, for fuck's sake! We handle this now by placing
// those arguments in an array below and catching them before they break the world. 

const snakeCaseTheseSillyKeys =[
	// list them in kebab case because we're defaulting to that first in the for loop below.
	'admin-user',
	'admin-password',
	'admin-email',
	'post-type'
]

export default ({input, flags}) => {
	const cliCmd = input.slice(1).join(' ')
	const cliFlags = ['--allow-root'] // need this shazz to run in the Docker process
	if (flags && Object.keys(flags).length !== 0 && flags.constructor === Object) {
		for (let [key, value] of Object.entries(kebabCaseKeys(flags))) {
			if(snakeCaseTheseSillyKeys.includes(key)){
				key = snakeCase(key)
			}
			const prefix = key.length > 1 ? '--' : '-'
			const val = value === true ? '' : `=${value}`
			const flag = `${prefix}${key}${val}`
			cliFlags.push(flag)
		}
	}
	const flagStr = cliFlags.join(' ')

	shellCmd(`docker compose exec -T wordpress wp ${cliCmd} ${flagStr}`)
}
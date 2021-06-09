import React, { useState, useEffect } from 'react'
import chalk from 'chalk'
import ErrorMsg from '../error'
import shellCmd from '../../utils/shellCmd'

export const lintInfo = {
	name: 'lint',
	desc: 'Lints your project using local configs.',
	help: chalk`
{cyan.dim Usage}
{bold nds lint [css|js|php]}

{cyan.dim Flags}
{bold -f} || {bold --fix}	Automatically fix errors if possible	{dim (Default: false)}

{cyan.dim Examples}
{bold lint php}
{dim Runs PHP Codesniffer on your project}

{bold lint php -f}
{dim Runs PHP Codebeautifier on your project}
`
}

const Lint = ({input, flags, showHelp}) => {
	useEffect(() => {
		if(!input[1]){
			showHelp()
		} else {
			let cmd
			switch (input[1]) {
				case 'php':
					cmd = flags.fix ? './vendor/bin/phpcbf' : './vendor/bin/phpcs'
					break;
			
				default:
					showHelp()
					break;
			}
			shellCmd(cmd)
		}
	}, []);

	return (
		<>
			{/* {errorMsg && <ErrorMsg msg={errorMsg} />} */}
		</>
	)
};

export default Lint

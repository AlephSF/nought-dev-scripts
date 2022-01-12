import React, { useState, useEffect } from 'react'
import chalk from 'chalk'

import ErrorMsg from '../error'

import shellCmd from '../../utils/shellCmd'

export const devProxyInfo = {
	name: 'devproxy',
	desc: 'Start an Ngrok proxy with the port of your choosing.',
	help: chalk`
{cyan.dim Usage}
{bold nds devproxy	[start|stop]	<port|8080>}
`
}

const DevProxy = () => {
	const [errorMsg, setErrorMsg] = useState(false);

	useEffect(() => {
		shellCmd(`${__dirname }/ngrok http 8080`)

		// if(somethingsWrong === true){
		// 	setErrorMsg("Something is wrong!")
		// }

	}, []);

	return (
		<>
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	)
};

export default DevProxy

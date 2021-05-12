import React, { useState, useEffect } from 'react'
import chalk from 'chalk'

import Ask from '../config/Ask'
import ErrorMsg from '../error'

import getConfig, { setConfig } from '../../utils/config'
import shellCmd from '../../utils/shellCmd'

export const blankInfo = {
	name: 'blank',
	desc: 'Blank command does this stuff',
	help: chalk`
{cyan.dim Usage}
{bold nds blank	[required]	<optional>}

{cyan.dim Flags}
{bold -x} || {bold --myflag}	My flag does this	{dim (Default: true)}

{cyan.dim Examples}
{bold blank foo}
{dim Does foo with bar}

{bold blank baz --aflag=false}
{dim Does baz but without running myflag}
`
}

const Blank = () => {
	const [projectType, setProjectType] = useState(getConfig('projectType'))
	const [errorMsg, setErrorMsg] = useState(false);

	useEffect(() => {
		if(projectType && !getConfig('projectType')){
			setConfig({projectType})
		}

		switch (projectType) {
			case 'noughtWp':
				const cmdToRun = 'ls -al'
				break;
		
			default:
				break;
		}
		// run it!
		if(projectType && projectType === 'noughtWp'){
			shellCmd(cmdToRun)
		}

		if(somethingsWrong === true){
			setErrorMsg("Something is wrong!")
		}

	}, [projectType]);

	return (
		<>
			{projectType ? null : <Ask configKey='projectType' setValue={setProjectType} />}
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	)
};

export default Blank

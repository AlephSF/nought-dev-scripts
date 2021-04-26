import React, { useState, useEffect } from 'react'
import { exec } from 'child_process'
import { Static, Box, Text, Newline } from 'ink'
import Gradient from 'ink-gradient'
import getConfig, { setConfig } from '../../utils/config'
import { UncontrolledTextInput } from 'ink-text-input'
import output from '../../utils/output'

const Sync = () => {
	// const [configExists, setConfigExists] = useState(false)
	const [migrateDbUrl, setMigrateDbUrl] = useState(getConfig('migrateDbUrl'))

	useEffect(() => {
		if(migrateDbUrl){
			const pull = exec(`nds wp migratedb pull ${migrateDbUrl}`, { stdio: 'inherit' })
			output(pull)
		}
	}, [migrateDbUrl])


	const handleSubmit = (query) => {
		setConfig({migrateDbUrl: query})
		setMigrateDbUrl(query)
	}

	return (
		<>
			{/* <Box paddingY={2}>
				<Box borderStyle="classic" borderColor="#bbb" padding={1}>
					<Gradient name="fruit">
						HOWDY
					</Gradient>
				</Box>
			</Box> */}

			{!migrateDbUrl && <Box paddingBottom="2">
				<Text color="#eb6e95">
					Please enter the URL from the Migrate DB settings in the env you'd like to pull from:
				</Text>
			</Box>}
			{!migrateDbUrl && <Box>
				<UncontrolledTextInput onSubmit={handleSubmit} />
			</Box>}
		</>
	);
};

export default Sync
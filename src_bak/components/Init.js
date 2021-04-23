import React, { useState, useEffect } from 'react'
import { Box, Text, Newline } from 'ink'
import Gradient from 'ink-gradient'
import { UncontrolledTextInput } from 'ink-text-input'
import SelectInput from 'ink-select-input';

const types = [
	{
		label: 'WordPress',
		value: 'wp'
	},
	{
		label: 'NextJS',
		value: 'next'
	}
];

const Init = () => {
	const [configExists, setConfigExists] = useState(false);
  const [projectName, setProjectName] = useState();
  const [projectType, setProjectType] = useState();
	const [wpTheme, setWpTheme] = useState();

	return (
		<>
			<Box paddingY={2}>
				<Box borderStyle="classic" borderColor="#bbb" padding={1}>
					<Gradient name="fruit">
						Let's initialize NDS in this project...
					</Gradient>
				</Box>
			</Box>
			<>
				<Box>
					<Text color="#eb6e95">
						What is this project's name?
					</Text>
				</Box>
				<Box paddingBottom={2}>
					<Text color="#eb6e95" dimColor>
						(This is usually the same as the Github Repo)
					</Text>
				</Box>
				<Box paddingBottom={2}>
					<UncontrolledTextInput onSubmit={setProjectName} focus={!projectName} />
				</Box>
			</>
			<>
				<Box>
					<Text color="#eb6e95">
						What Type of project is this?
					</Text>
				</Box>
				<Box paddingBottom={2}>
					<SelectInput items={types} onSelect={setProjectType} />
				</Box>
			</>
		</>
	);
};

export default Init
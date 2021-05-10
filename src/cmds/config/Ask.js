import React, { useState } from 'react'
import { Box, Text, Newline } from 'ink'
import Gradient from 'ink-gradient'
import { UncontrolledTextInput } from 'ink-text-input'
import SelectInput from 'ink-select-input'

const forms = {
	projectType: {
		question: 'What type of project is this?',
		inputType: 'select',
		items: [
			{
				label: 'WordPress (Nought)',
				value: 'noughtWp'
			},
			{
				label: 'WordPress (VIP Hosted)',
				value: 'wpVip'
			},
			{
				label: 'NextJS',
				value: 'next'
			},
			{
				label: 'Other',
				value: 'other'
			}
		]
	},
	migrateDbUrl: {
		question: 'Please enter the URL from the Migrate DB settings in the env you\'d like to pull from:',
		inputType: 'text',
	}
}

const Ask = ({configKey, setValue}) => {
	const input = forms[configKey]
	
	const handleInput = (query) => {
		setValue(query)
	};

	const handleSelect = (item) => {
		setValue(item.value)
	};
	return (
		<>
			<Box padding="2" width="70%">
				<Text color="#eb6e95">
					{input.question}
				</Text>
			</Box>
			{input.inputType === 'text' && <UncontrolledTextInput onSubmit={handleInput} />}
			{input.inputType === 'select' && <SelectInput items={input.items} onSelect={handleSelect} />}
		</>
	);
};

export default Ask


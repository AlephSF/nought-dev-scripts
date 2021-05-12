import React, { useState, useEffect } from 'react' // real hooks!
import { Box, Text, Newline } from 'ink' // components from Ink for formatting
import chalk from 'chalk' // for colors
import TextInput from 'ink-text-input' // real input form field
import Gradient from 'ink-gradient'
import SelectInput from 'ink-select-input' // a select box!
import poesyQuips from './poesyQuips' // we'll create this in a second
import ErrorMsg from '../error'

export const helloInfo = { // export it, we'll use it elsewhere
	name: 'hello', // the actual command
	desc: 'Maybe say hello to a dead poet, why not?', // a description for help purposes
	help: chalk`
{cyan.dim Usage}
{bold nds hello <dead poet last name>}

{cyan.dim Flags}
{bold -y} || {bold --yes}	Don't prompt for an answer

{cyan.dim Supoorted Dead Poets}
{bold bishop} (Elizabeth)
{bold borges} (Jorge Luis)
{bold plath}  (Sylvia)
{bold poe}  (Edgar Allen)
{bold shakespeare}  (Bill)
{bold yeats}  (William Butler)
{bold wcw}  (WCW)

` // the proceeding literal is formatted with Chalk, really looks nice. 
}

// This maps our select box options to the poets in poesyQuips.js
// Lots of prettier ways to do this, I'm sure. 
const deadPoets = [
	{
		label: 'Elizabeth Bishop',
		value: 'bishop'
	},
	{
		label: 'Jorge Luis Borges',
		value: 'borges'
	},
	{
		label: 'Sylvia Plath',
		value: 'plath'
	},
	{
		label: 'Edgar Allen Poe',
		value: 'poe'
	},
	{
		label: 'Bill Shakespeare',
		value: 'shakespeare'
	},
	{
		label: 'W.C.W.',
		value: 'wcw'
	},
]

const Hello = ({input, flags}) => { // as promised, input and flags as props!
	const [sayHello, setSayHello] = useState(flags.yes ? 'y' : false) // a boolean mapping to our '-y' flag
	const [deadPoet, setDeadPoet] = useState(input[1]) // for whom the bell hath tolled
  const [deadPoetSay, setDeadPoetSay] = useState() // an empty vessel
	const [errorMsg, setErrorMsg] = useState(false); // used to push into an error component

  useEffect(() => { // only run	this when specific things change, just like in real React
    // All our commands will have conditionals, they should probably run here.
    // Switches are nice for subcommands, but here we can check against an object.
    if(sayHello === 'y' && deadPoet && poesyQuips.hasOwnProperty(deadPoet)){
      setDeadPoetSay(poesyQuips[deadPoet])
    }

		// if the user somehow hits something other than y or n, taunt them with an error
		if(sayHello && sayHello !== 'y' && sayHello !== 'n'){
			setErrorMsg('All you had to do was hit "y" or "n". What have you done?!')
		}

	}, [deadPoet, sayHello]) // just like real React, only run when these two things change

	return (
		<>
			{/* First, we ask which poet with a select input, if none has yet been chosen */}
			{!deadPoet && <>
			<Box paddingY={2}>
				<Text>
					Which dead poet would you like to say "hello" to?
				</Text>
			</Box>
				<SelectInput items={deadPoets} onSelect={(poet) => setDeadPoet(poet.value)} />
			</>}

			{/* Assuming that is set, we can now confirm with a simple input that tracks our every keystroke */}
			{deadPoet && !sayHello && <>
				<Box paddingY={2}>
					<Text>
						Are you absolutely sure you'd like to say hello to a dead poet? Dead?! (y/n)
					</Text>
				</Box>
				<TextInput value={''} onChange={setSayHello} />
			</>}

			{/* Made it! We can now show what the poet says from the grave. */}
			{sayHello === 'y' && deadPoetSay && <Box borderStyle='classic' borderColor='magentaBright' justifyContent='center' marginY='1' padding='1' width='50%'>
					<Gradient name='mind'>
						{deadPoetSay}
					</Gradient>
				</Box>}

			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	)
}

export default Hello
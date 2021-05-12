# The Aleph (N)ought (D)ev (S)cripts
If you are using any of Aleph's local development frameworks, this package is for you. It
makes the `nds` command available globally in your terminal. which then gives you access 
to a multitude of shortcuts that you can run on your project to do lots of important
tasks without looking up long, laborious strings and flags. 

Install globally with `npm i -g @aleph/nought-dev-scripts` and away you'll go! Verify
it's working with a simple `nds` in your terminal. This should give you a colorful overview
of the commands. 

## Prerequisites
This tool is a shortcut that mainly leverages other tools. You will need to install those
other tools for this to work. Some commands will work fine without all the tools, but
you should strive to install all of these just to make sure:
- [Docker for Mac](https://docs.docker.com/docker-for-mac/install/)
- [NodeJS](https://nodejs.org/en/download/) & [NVM](https://github.com/nvm-sh/nvm#install--update-script)
- [`pv`](https://formulae.brew.sh/formula/pv) (pipe viewer) for progress bars in terminal
- [Sequel Pro](https://sequelpro.com/test-builds) for viewing large local SQL Databases (Yes, you should
  download the 1+ year old test build. Crazy.) 
- A Google Cloud Project Service account with permission to access stuff

## Project Structure at a Glance
The command `nds` is essentially a namespace that gates subcommands, kind of like a router. We use
the fun project [Meow](https://github.com/sindresorhus/meow) to parse this into commands (inputs) and flags,
so like if you go `nds do something --fun` Meow runs a callback including `input` and `flags` like:
```js
{
  input: ['do', 'something'],
  flags: {
    fun: true
  }
}
```
> **Yeah, it's JS!** To make it easier for us to work on this, we're using JavaScript to do all of this stuff. 
  isn't it grand?

Now, at this point we could just run the callback any way we want, but that's not that much fun for us. Instead
we use the totally bonkers and awesome [Ink](https://github.com/vadimdemedes/ink) to pass the arguments to
React components which render in the terminal. This allows us to use all the familiar tools like hooks, forms
and component states, and to practice our basic React skills while making it easier to work at Aleph. Bitchin!

Ink does a very specific thing and is obviously limited to rendering "components" using what's available in
a terminal, so you're not gonna be building web UIs here. We can of course build little boxes and colored text
and rainbows. [Check out the docs](https://github.com/vadimdemedes/ink).

The real fun part is the ability to build interactive CLI stuff that looks nice and is easy to use. The power
of this paradigm becomes readily apparent when we are using actual react form elements to do stuff, and hooks
like `useEffect` and `useState` to determine what to do next or what commands to run. 

So specifically, here's how it all breaks down:
1. Any `nds` command is first run through the bootstrap script at `src/index.js`, where it is parsed by Meow.
1. The specific functionality of any given subcommand is entirely self-contained as a React component in a
  directory of the same name within `cmds`.
1. The `input` and `flags` from the command are passed through as props, where we can choose to do many, 
  many things. 
1. The end result of most commands is to run a command in the terminal for you as a node "Child Process" which
  we'll get into later.


## Before Diving Too Deep, consider this...
- This project could generously be called a "beta", so there's a lot that isn't quite finished. We need
  your help to make it amazing. 
- There is some weirdness that you'll have to get used to when trying to actually format things in the
  terminal. Don't worry about it too much, it's a fucking terminal. :)
- This is a public project in our NPM registry, so let's be very careful not to include anything secret
  or otherwise unready for public consumption. 


## How to Contribute
If you'd like to contribute by creating or modifying commands, that's awesome. You really should! Steps
to get started:
1. Pull down this repo from Github and make a branch for your changes. 
1. If you already installed `nds` globally, remove it with `npm uninstall -g @aleph/nought-dev-scripts`.
1. From the project root that you just cloned, run `yarn` and then `npm link`

This will alias `npm` on your command line with whatever is in your local project directory. Note
that after making any changes, you need to run `yarn compile` for those changes to appear in your 
command line. 

## Hello Poet, Maybe
Let's build the sample `nds hello` command, which has a few important aspects that will
help us learn a bit about this wacky setup. 

First, decide what you'd like this command to do. In our case, we want the following:
1. When the user types `nds hello` we'd like it to respond by asking us which famous dead
  poet we'd like to say hi to.
1. It should take an optional string specifying the poet ahead of time, so like `nds hello yeats` 
  should skip the question, assuming saying hello to Yeats is supported.
1. By default, the command should confirm if we really want to do this before proceeding. 
1. We should have a flag that will automatically surpass the prompt and just say hello. 

### First, create the component
Our naming conventions here are to create a directory with the same name (all lowercase) as the 
command within the `src/cmds` directory with at least an `index.js` inside it, so we start by creating
`src/cmds/hello/index.js` with some important dependencies:
```js
import React, { useState, useEffect } from 'react' // real hooks!
import { Box, Text, Newline } from 'ink' // components from Ink for formatting
import chalk from 'chalk' // for colors
import { UncontrolledTextInput } from 'ink-text-input' // real input form field
import SelectInput from 'ink-select-input' // a select box!
import poesyQuips from './poesyQuips' // we'll create this in a second
```

Next we want an info object (by convention called `helloInfo`) that stores all the vital info
including help text about our command:
```js
export const helloInfo = { // export it, we'll use it elsewhere
	name: 'hello', // the actual command
	desc: 'Maybe say hello to a dead poet, why not?', // a description for help purposes
	help: chalk`
{cyan.dim Usage}
{bold nds hello <dead poet last name>}

{cyan.dim Flags}
{bold -y} || {bold --yes}	Don't prompt for an answer}

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
```
We should follow some basic guidelines when formatting our strings. The excellent [Chalk](https://github.com/chalk/chalk) 
project has good docs on how to use the string literals with brackets to do nice 
things. Right now, we like our headings to be `dim.cyan` and any actual command info
to be `bold`, but do what you feel.'

Next, you want to create the actual component that your terminal will render when the 
command is run. It looks like this:

```jsx
const Hello = ({input, flags}) => { // as promised, input and flags as props!
	const [sayHello, setSayHello] = useState(flags.yes) // a boolean mapping to our '-y' flag
	const [deadPoet, setDeadPoet] = useState(input[0]) // for whom the bell hath tolled
  const [deadPoetSay, setDeadPoetSay] = useState('') // an empty vessel

  useEffect(() => { // only run this when specific things change, just like in real React
    
    // All our commands will have conditionals, they should probably run here.
    // Switches are nice for subcommands, but here we can check against an object.
    if(sayHello && deadPoet && poesyQuips.hasOwnProperty(deadPoet)){
      setDeadPoetSay(poesyQuips[deadPoet])
    }

	}, [deadPoet])

	return (
		<>
			{!errorMsg && !projectType && <Ask configKey='projectType' setValue={setProjectType} />}
			{!errorMsg && projectType && input[1] === 'sync' && !migrateDbUrl && <Ask configKey='migrateDbUrl' setValue={setMigrateDbUrl} />}
			{errorMsg && <ErrorMsg msg={errorMsg} />}
		</>
	);
};

export default Hello
```
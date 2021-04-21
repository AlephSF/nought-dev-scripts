#!/usr/bin/env node
import React, { useEffect, useState } from 'react'
import { render, Text, Box, useStdout } from 'ink'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'
import yargs from 'yargs'

const OHi = () => {
	useEffect(() => {
		return () => {
			yargs.commandDir('cmds').demandCommand().help().argv
		};
	}, []);


	return (
		<Box paddingBottom="2">
			<Gradient name="pastel">
				<BigText font='3d' text="N D S"/>
				<Text>
					The Aleph (N)ought (D)ev (S)cripts
				</Text>
			</Gradient>
		</Box>
	);
};
render(<OHi />)

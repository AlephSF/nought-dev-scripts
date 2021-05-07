import React from 'react'
import { Box, Text } from 'ink'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'

const Nds = ({helpText}) => {
	return (
		<>
			<Box justifyContent="center" width="70%">
				<Gradient name="pastel">
					<BigText font='3d' text="N D S"/>
				</Gradient>
			</Box>
			<Box paddingBottom="2" justifyContent="center" width="70%">
				<Gradient name="pastel">
					The Aleph (N)ought (D)ev (S)cripts
				</Gradient>
			</Box>
			<Box paddingBottom="2" width="70%">
				<Text>{helpText}</Text>
			</Box>
		</>
	);
};

export default Nds
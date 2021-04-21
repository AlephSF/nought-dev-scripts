import React from 'react'
import { Text, Box } from 'ink'
import Gradient from 'ink-gradient'
import BigText from 'ink-big-text'

const Hi = () => {
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
		</>
	);
};

export default Hi
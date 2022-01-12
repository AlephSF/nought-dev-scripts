import React from 'react'
import { Box, Text } from 'ink'
import BigText from 'ink-big-text'
import Gradient from 'ink-gradient'

const ErrorMsg = ({msg}) => {
	return <>
		<Box borderStyle="classic" borderColor="redBright" flexDirection="column" padding="1" width="50%" paddingBottom="2">
			<Box justifyContent="center" marginBottom="1">
				<Gradient name="morning">
					<BigText font='chrome' text="CURSES!"/>
				</Gradient>
			</Box>
			<Box justifyContent="center">
				<Text color="redBright">
					{msg}
				</Text>
			</Box>
		</Box>
	</>
}

export default ErrorMsg


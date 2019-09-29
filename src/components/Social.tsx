import { Box, Image } from 'grommet'
import React from 'react'

const github: string = require('../static/pictograms/github.svg')
const linkedin: string = require('../static/pictograms/linkedin.svg')
const mail: string = require('../static/pictograms/mail.svg')

const Social: React.FC = () => {
    return (
        <Box
            direction="row"
            height="16px"
            gap="small"
            margin={{ vertical: '0px' }}
        >
            <Box>
                <Image src={mail} fit="contain" />
            </Box>
            <Box>
                <Image src={github} fit="contain" />
            </Box>

            <Box>
                <Image src={linkedin} fit="contain" />
            </Box>
        </Box>
    )
}

export default Social

import { Heading, StackDivider, VStack, Tooltip } from '@chakra-ui/react';
import React from 'react';
import ConversationAreasList from './ConversationAreasList';
import PlayersList from './PlayersList';
import useCoveyAppState from '../../hooks/useCoveyAppState';

export default function SocialSidebar(): JSX.Element {

  const {currentTownID, currentTownFriendlyName} = useCoveyAppState();
    return (
      <VStack align="left"
        spacing={2}
        border='2px'
        padding={2}
        marginLeft={2}
        borderColor='gray.500'
        height='100%'
        divider={<StackDivider borderColor='gray.200' />}
        borderRadius='4px'>
          <Heading fontSize='xl' as='h1'>Players In This Town</Heading>
          <Tooltip label={`Town ID: ${currentTownID}`} aria-label='A tooltip'>
            <Heading fontSize='l' as='h2'>Current town: {currentTownFriendlyName}</Heading>
          </Tooltip>
         
        <PlayersList />
        <ConversationAreasList />
      </VStack>
    );
  }

import { Box, Heading, UnorderedList, ListItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import ConversationArea from '../../classes/ConversationArea';
import  * as util  from '../../classes/ConversationArea';
import PlayerName from './PlayerName';
import useConversationAreas from '../../hooks/useConversationAreas';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import Player from '../../classes/Player';

// the ActiveConversationArea component recieves a ConversationArea
type ActiveConversationAreaProps = {
  conversation: ConversationArea
}

/**
 * Lists the players currently in this active (non-empty) conversation area,
 * along with the conversation's label and topic
 * 
 * Players in the list are unordered, appearing in whichever order they appear in the 
 * conversation's occupants list
 * 
 * A subscription to occupancy updates updates the current occupants, and is removed on unmount
 */
export function ActiveConversationArea({conversation} : ActiveConversationAreaProps): JSX.Element {
  const players: Player[] = usePlayersInTown();
  const [currOccupants, setCurrOccupants] = useState<string[]>(conversation.occupants);

  function playerByID(id: string) : Player | undefined {
    return players.find(player => player.id === id);
  }

  // Subscribe to onOccupantsChange events for this conversation
  useEffect(() => {
    const occsChangedListener = {
      onOccupantsChange: (newOcc: string[]) => {
        setCurrOccupants(newOcc);
      },
    };

    conversation.addListener(occsChangedListener);
    occsChangedListener.onOccupantsChange(conversation.occupants);
    
    // Unregister listener on unmount
    return () => {
      conversation.removeListener(occsChangedListener);
    };
  }, [conversation, conversation.occupants]);

  return (
  <Box> 
    <Heading fontSize='l' as='h3'>{conversation.label}: {conversation.topic}</Heading>
    <UnorderedList>
      {currOccupants.map((occupant) => {
        const player = playerByID(occupant);
        return player ?
          <ListItem key={occupant}>
            <PlayerName key={player.id} player={player} />
          </ListItem>
          : '';
      }
      )}
    </UnorderedList>
  </Box>);
}

/**
 * Displays a list of "active" conversation areas, along with their occupants 
 * 
 * A conversation area is "active" if its topic is not set to the constant NO_TOPIC_STRING that is exported from the ConverationArea file
 * 
 * If there are no active conversation areas, it displays the text "No active conversation areas"
 * 
 * If there are active areas, it sorts them by label ascending, using a numeric sort with base sensitivity
 * 
 * Each conversation area is represented as a Box:
 *  With a heading (H3) `{conversationAreaLabel}: {conversationAreaTopic}`,
 *  and an unordered list of occupants.
 * 
 * Occupants are *unsorted*, appearing in the order 
 *  that they appear in the area's occupantsByID array. Each occupant is rendered by a PlayerName component,
 *  nested within a ListItem.
 * 
 * Each conversation area component must subscribe to occupant updates by registering an `onOccupantsChange` listener on 
 *  its corresponding conversation area object.
 * It must register this listener when it is mounted, and remove it when it unmounts.
 * 
 * See relevant hooks: useConversationAreas, usePlayersInTown.
 */
export default function ConversationAreasList(): JSX.Element {

  const conversations = useConversationAreas();

  const getActiveConversations = (allConversations: ConversationArea[]) => 
    allConversations.filter(c => c.topic !== util.NO_TOPIC_STRING);

  const alphanumByLabel = (c1: ConversationArea, c2: ConversationArea) => 
    c1.label.localeCompare(c2.label, 'en', { numeric: true });

  return (
  <Box> 
    <Heading fontSize='l' as='h2'>Active Conv Areas</Heading>
    {!getActiveConversations(conversations).length ?
      <Heading fontSize='l' as='p'>No active conversation areas</Heading> 
      : 
      <UnorderedList> 
      {[...getActiveConversations(conversations)].sort(alphanumByLabel).map((c)=>
        <ListItem key={c.label}>
          <ActiveConversationArea conversation={c}/>
        </ListItem>  
      )} 
      </UnorderedList>
    }
  </Box>);
}


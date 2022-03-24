import { Box, Heading, UnorderedList, ListItem } from '@chakra-ui/react';
import React, {
  useEffect,
  useState
} from 'react';
import ConversationArea , { ConversationAreaListener } from '../../classes/ConversationArea';
import  * as blah  from '../../classes/ConversationArea';
// import { ConversationAreaListener } from '../../classes/ConversationArea';
import PlayerName from './PlayerName';
import useConversationAreas from '../../hooks/useConversationAreas';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import Player from '../../classes/Player';

type ActiveConversationAreaProps = {
  conv: ConversationArea
}

// TODO
export function ActiveConversationArea({conv} : ActiveConversationAreaProps): JSX.Element {
  const players: Player[] = usePlayersInTown();

  const [occ, setOcc] = useState<string[]>(conv.occupants);

  function playerByID(id: string) : Player | undefined {
    return players.find(p => p.id === id);
  }

  // An useEffect hook, 
  // which subscribes to occupancy updates by registering an onOccupantsChange listener 
  // on the component’s corresponding conversation area object:

  // The listener must be registered exaclty once (when the component is mounted), 
  // and unregistered exactly once (when the component is unmounted)

  // The listener must update the rendered list of occupants in the conversation area when it receives updates
  useEffect(() => {
    // define the listener
    const occsChangedListener = {
      onOccupantsChange: (newOcc: string[]) => {
        // conv.occupants = newOcc;
        setOcc(newOcc);
      },
    };

    // add the listener to the ca object
    conv.addListener(occsChangedListener);

    // call it with the new occupants
    occsChangedListener.onOccupantsChange(conv.occupants);
    
    // remove the listener on unmount
    return () => {
      conv.removeListener(occsChangedListener);
    };
  }, [conv, conv.occupants]);

  return (
  <Box> 
    <Heading fontSize='l' as='h3'>{conv.label}: {conv.topic}</Heading>
    <UnorderedList>
    {occ.map((o) => {
      const playa = playerByID(o);

      return playa ?
        <ListItem key={o}>
          <PlayerName key={playa.id} player={playa} />
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

  const cas = useConversationAreas();

  function activeCAs(loCAs: ConversationArea[]) : ConversationArea[] {
    return loCAs.filter(ca => ca.topic !== blah.NO_TOPIC_STRING);
  }

  const sortAlphaNum = (a: ConversationArea, b: ConversationArea) => a.label.localeCompare(b.label, 'en', { numeric: true })

  return (
  <Box> 
    <Heading fontSize='l' as='h2'>Active Conv Areas</Heading>

    {!activeCAs(cas).length ?
      <Heading fontSize='l' as='p'>No active conversation areas</Heading> 
      : <UnorderedList> {[...activeCAs(cas)].sort(sortAlphaNum).map((ca)=>
        <ListItem key={ca.label}> <ActiveConversationArea conv={ca}/> </ListItem>  
      )} </UnorderedList>
      }
  </Box>);
}


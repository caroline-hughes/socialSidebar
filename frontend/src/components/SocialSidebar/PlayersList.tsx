import React from 'react';
import { ListItem, OrderedList } from '@chakra-ui/react';
import PlayerName from './PlayerName';
import usePlayersInTown from '../../hooks/usePlayersInTown';
import Player from '../../classes/Player';
/**
 * Lists the current players in the town, along with the current town's name and ID
 * 
 * Town name is shown in an H2 heading with a ToolTip that shows the label `Town ID: ${theCurrentTownID}`
 * 
 * Players are listed in an OrderedList below that heading, sorted alphabetically by userName (using a numeric sort with base precision)
 * 
 * Each player is rendered in a list item, rendered as a <PlayerName> component
 * 
 * See `usePlayersInTown` and `useCoveyAppState` hooks to find the relevant state.
 * 
 */

 export default function PlayerList(): JSX.Element {

  const players = usePlayersInTown();
  
  const sortAlphaNum = (a: Player, b: Player) => a.userName.localeCompare(b.userName, 'en', { numeric: true })

  return <OrderedList>
    {[...players].sort(sortAlphaNum).map((p)=>
      <ListItem key={p.id}><PlayerName key={p.id} player={p} /></ListItem>  
    )}
  </OrderedList>
}
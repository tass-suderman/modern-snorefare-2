import type { Player } from '@/models/Player'

interface RightPaneProps {
  players: Player[]
}

function getMaxPlayers(playerCount: number): number {
  const next = playerCount + 1
  // Snap up to nearest even number
  const snapped = next % 2 === 0 ? next : next + 1
  return Math.max(12, snapped)
}

export default function RightPane({ players }: RightPaneProps) {
  const maxPlayers = getMaxPlayers(players.length)

  return (
    <aside className="right-pane">
      <div className="right-pane-players">
        {players.map((player) => (
          <div key={player.id} className="player-entry">
            {player.name}
          </div>
        ))}
      </div>
      <div className="right-pane-footer">
        {players.length}/{maxPlayers} PLAYERS
      </div>
    </aside>
  )
}

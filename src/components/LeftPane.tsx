import { useState } from 'react'

interface MenuItem {
  name: string
  description: string
}

const MENU_ITEMS: MenuItem[] = [
  { name: 'CREATE A CLASS', description: 'Create your own custom classes.' },
  { name: 'CALLSIGN & KILLSTREAKS', description: 'Create your own custom classes.' },
  { name: 'BARRACKS', description: 'Create your own custom classes.' },
  { name: 'HORIZONTALRULE', description: '' },
  { name: 'INVITE', description: 'Create your own custom classes.' },
  { name: 'VOTE TO SKIP', description: 'Create your own custom classes.' },
]

// Placeholder map image as a data URI gradient (dark green / gray tones like Overgrown)
const PLACEHOLDER_MAP =
  'data:image/svg+xml,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2d4a1e"/>
          <stop offset="40%" stop-color="#4a5a30"/>
          <stop offset="70%" stop-color="#6b7c50"/>
          <stop offset="100%" stop-color="#3a3a2a"/>
        </linearGradient>
      </defs>
      <rect width="400" height="200" fill="url(#g)"/>
      <rect x="60" y="40" width="80" height="60" rx="4" fill="#5a4a30" opacity="0.7"/>
      <rect x="180" y="60" width="100" height="80" rx="4" fill="#5a4a30" opacity="0.6"/>
      <rect x="300" y="30" width="60" height="90" rx="4" fill="#5a4a30" opacity="0.5"/>
      <rect x="20" y="120" width="120" height="50" rx="4" fill="#4a3a20" opacity="0.7"/>
    </svg>`,
  )

export default function LeftPane() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  // Filter out horizontal rules for description lookup
  const selectableItems = MENU_ITEMS.filter((item) => item.name !== 'HORIZONTALRULE')
  const selectedItem = selectableItems[selectedIndex] ?? selectableItems[0]

  // Track actual index among selectables
  let selectableCounter = -1

  return (
    <aside className="left-pane">
      {/* Title */}
      <h1 className="left-pane-title">TEAM DEATHMATCH</h1>

      {/* Menu list */}
      <nav className="left-pane-menu">
        {MENU_ITEMS.map((item, idx) => {
          if (item.name === 'HORIZONTALRULE') {
            return <hr key={idx} className="left-pane-rule" />
          }
          selectableCounter++
          const thisSelectableIndex = selectableCounter
          const isSelected = selectedIndex === thisSelectableIndex
          return (
            <button
              key={idx}
              className={`left-pane-menu-item${isSelected ? ' selected' : ''}`}
              onClick={() => setSelectedIndex(thisSelectableIndex)}
            >
              {item.name}
            </button>
          )
        })}
      </nav>

      {/* Item description */}
      <p className="left-pane-description">{selectedItem.description}</p>

      {/* Map section */}
      <div className="left-pane-map">
        <img
          src={PLACEHOLDER_MAP}
          alt="Map: Overgrown"
          className="left-pane-map-img"
        />
        <span className="left-pane-map-label left-pane-map-label--top">
          Overgrown
        </span>
        <span className="left-pane-map-label left-pane-map-label--bottom">
          Team Deathmatch
        </span>
      </div>

      {/* Controller buttons */}
      <div className="left-pane-buttons">
        <span className="controller-btn">
          <span className="glyph glyph-y">Y</span>
          GAME SUMMARY
        </span>
        <span className="controller-btn">
          <span className="glyph glyph-b">B</span>
          BACK
        </span>
      </div>
    </aside>
  )
}

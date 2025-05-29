# Action Movie World for Foundry VTT

A comprehensive Foundry Virtual Tabletop system for playing Action Movie World, the roleplaying game about actors playing action heroes in over-the-top movies.

## About Action Movie World

Action Movie World is a roleplaying game powered by the Apocalypse World engine where players take on the roles of actors in an action movie career. Each "movie" is a self-contained adventure in a different genre - from barbarian epics to cop thrillers to ninja films.

Key features of the game:
- **Actor Playbooks**: Seven different actor archetypes (Musclehead, Gunfighter, Pugilist, Smartass, Smooth Operator, Thespian, Yeller)
- **Script System**: Different movie genres with their own moves, gear, and villains
- **Star Power**: Track your rising (or falling) Hollywood career
- **Lead/Supporting Roles**: Rotating protagonist duties with plot immunity
- **Camaraderie**: Measure the bonds between your characters

## System Features

### Character Management
- **Actor Sheets**: Track your career-spanning actor with experience, star power, and playbook moves
- **Character Sheets**: Individual character sheets for each movie role
- **Dual Character System**: Switch between Actor (career) and Character (current movie) perspectives
- **Playbook Integration**: All seven actor playbooks with their unique moves and abilities

### Game Mechanics
- **2d6 + Stat Rolling**: Core Apocalypse World mechanics with custom success/failure results
- **Highlighted Stats**: Director-chosen stats that generate Star Power ticks on 10+ rolls
- **Harm System**: 5-level harm track with special rules for Lead characters
- **Experience & Advancement**: XP tracking with 5-point advancement cycles
- **Hold System**: Track holds from moves like Vengeance and Camaraderie

### Script Support
- **11 Movie Scripts**: Barbarian, Cop, Fighting Tournament, Ninja, Sci-Fi, War, Comic Book, Disaster, Family Friendly, Trucker, and Vigilante movies
- **Script Moves**: Temporary moves that define each movie genre
- **Gear Systems**: Genre-appropriate weapons, armor, and equipment
- **Relationship Web**: Track character relationships within each movie

### Enhanced Foundry Integration
- **Interactive Rolling**: Click-to-roll stats, moves, and gear from character sheets
- **Chat Integration**: Rich chat messages with roll results and move descriptions
- **Macro Support**: Drag moves and gear to the hotbar for quick access
- **Item Management**: Comprehensive move, gear, and script item types

## Installation

### From Manifest URL
1. Open Foundry VTT and go to the Game Systems tab
2. Click "Install System"
3. Paste this manifest URL: `[Your manifest URL here]`
4. Click "Install"

### Manual Installation
1. Download the system files
2. Extract to `[Foundry Data]/systems/action-movie-world/`
3. Restart Foundry VTT
4. Create a new world using the "Action Movie World" system

## Getting Started

### Setting Up Your First Movie

1. **Create Actors**: Each player creates an Actor representing their Hollywood career
2. **Choose Playbooks**: Select from Musclehead, Gunfighter, Pugilist, Smartass, Smooth Operator, Thespian, or Yeller
3. **Assign Stats**: Distribute stats according to your chosen playbook
4. **Pick a Script**: Choose what type of movie you're making (Cop, Ninja, Barbarian, etc.)
5. **Create Characters**: Make Character sheets for each actor's role in this specific movie
6. **Set Relationships**: Establish connections between characters using the script's relationship table
7. **Choose Script Moves**: Each player picks one temporary move from the script
8. **Select Gear**: Pick appropriate equipment for the movie genre

### Core Gameplay Loop

1. **Scene Setting**: The Director frames scenes and asks "What do you do?"
2. **Move Triggers**: When a player's action triggers a move, they roll 2d6 + relevant stat
3. **Results**: 10+ = full success, 7-9 = partial success with complications, 6- = miss with consequences
4. **Star Power**: Track ticks on highlighted stats when rolling 10+
5. **Camaraderie**: Group friendship stat that changes based on character interactions
6. **Advancement**: Gain XP from various sources, spend at 5 XP for improvements

## Character Creation

### Actor Creation
1. Choose an Actor Playbook
2. Select stat array from playbook options
3. Pick 2 moves from your playbook
4. Name your actor and describe their Hollywood persona
5. Set starting experience and star power

### Character Creation (for each movie)
1. Create a Character sheet linked to your Actor
2. Copy stats from your Actor sheet
3. Name your character for this movie
4. Establish relationship with another character
5. Choose one Script move
6. Select appropriate gear
7. Set highlighted stats (Director chooses one, playbook provides the other)

## System Differences from Standard Apocalypse World

- **No Harm for Actors**: Actor sheets track career progression, not physical state
- **Plot Immunity**: Lead characters cannot die, supporting characters have more choices about death
- **Temporary Moves**: Script moves are temporary unless made permanent with XP
- **Star Power System**: Replaces traditional advancement with Hollywood career tracking
- **Camaraderie**: Group-wide stat that affects everyone
- **Dual Sheet System**: Actors and Characters are separate but linked

## Tips for Directors

- **Embrace the Cheese**: Action movies are inherently over-the-top and ridiculous
- **Keep It Moving**: Use aggressive scene framing, skip boring parts
- **Make Failure Interesting**: Even misses should be cinematic and fun
- **Rotate the Spotlight**: Ensure everyone gets their moment to be awesome
- **Use the Imaginary Viewing Audience**: Think about what would look cool on screen

## Troubleshooting

### Common Issues
- **Can't roll moves**: Ensure the move has a valid stat assigned
- **Missing ticks**: Check that stats are properly set as highlighted
- **Import problems**: Verify all template files are in the correct directories

### Support
- Check the [Issues page](https://github.com/yourusername/action-movie-world-foundry/issues) for known problems
- Post new issues with detailed descriptions and error messages
- Include your Foundry version and system version when reporting bugs

## Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## Credits

- **Original Game**: Action Movie World by Ian Williams
- **Engine**: Based on Apocalypse World by Vincent Baker
- **Foundry System**: Created for Foundry Virtual Tabletop
- **Art Assets**: Various sources as credited in individual files

## License

This system is distributed under the same license as the original Action Movie World game. Please respect the original creators' rights and licensing terms.

## Changelog

### Version 1.0.0
- Initial release
- Full support for all 7 Actor playbooks
- 11 movie scripts implemented
- Complete move, gear, and advancement systems
- Rich chat integration
- Drag-and-drop macro support
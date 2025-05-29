/**
 * Setup script to create compendiums with playbook moves and basic moves
 * Run this once to populate the compendiums
 */

export class AMWCompendiumSetup {
  
  static async setupCompendiums() {
    console.log("AMW | Setting up compendiums...");
    
    await this.createBasicMoves();
    await this.createPlaybookMoves();
    await this.createPlaybookActors();
    await this.createGearCompendium();
    await this.createScriptMoves();
    
    console.log("AMW | Compendium setup complete!");
  }

  static async createBasicMoves() {
    const packName = "action-movie-world.basic-moves";
    let pack = game.packs.get(packName);
    
    if (!pack) {
      pack = await CompendiumCollection.createCompendium({
        type: "Item",
        label: "Basic Moves",
        name: "basic-moves",
        package: "action-movie-world"
      });
    }

    const basicMoves = [
      {
        name: "Violence",
        type: "move",
        system: {
          moveType: "basic",
          stat: "muscles", // or agility for ranged
          description: "When you try to hurt or kill someone, roll +Muscles for close combat or +Agility for ranged combat.",
          hit: "Choose three: • Inflict terrible harm (+1 harm) • The target drops something • The target is knocked down • You make a mess (-messy) • Something explodes (-loud) • You hit a whole bunch of people (-area) • You can escape or close in",
          partial: "Choose one: • You inflict harm but you take some, too • You inflict harm but are driven back • You inflict harm but a friend is hurt badly in the fight",
          miss: "The Director makes a move against you."
        }
      },
      {
        name: "Getting What You Want",
        type: "move",
        system: {
          moveType: "basic",
          stat: "magnetism",
          description: "When you seduce or manipulate someone to get something, roll +Magnetism.",
          hit: "You get what you want with no strings attached. It might even be better than you expected. If used against a PC, they can refuse but take -1 forward until they give in.",
          partial: "Get what you want but it comes with an added cost. A PC can outright refuse.",
          miss: "You've managed to infuriate someone. The Director may make an appropriate move against you."
        }
      },
      {
        name: "Emote",
        type: "move",
        system: {
          moveType: "basic",
          stat: "drama",
          description: "When you display emotion in a melodramatic fashion, pick an emotion and roll +Drama.",
          hit: "As 7-9, plus you take +1 forward when acting on your emotions.",
          partial: "Choose a PC or NPC to witness your emotional display. They feel the same emotion as you. If a PC acts on the emotion, they take +1 forward.",
          miss: "The rawness of your emotions has exhausted you. Take -1 forward."
        }
      },
      {
        name: "Love Scene",
        type: "move",
        system: {
          moveType: "basic",
          stat: "magnetism",
          description: "When you have sex with someone, PC or NPC, roll +Magnetism.",
          hit: "Choose two from the list below.",
          partial: "Choose one from the list below.",
          miss: "The Director may use your lover to complicate your life in the near future.",
          tags: "Choose from: +1 when you protect/help your lover for the rest of the film; Your head is clear for days (+1 for the scene); Their head is clear for days (+1 for the scene); Your lover will die during the movie (gain Vengeance move); Your lover will show up during danger to provide aid"
        }
      },
      {
        name: "Killer One Liner",
        type: "move",
        system: {
          moveType: "basic",
          stat: "swagger",
          description: "When you deliver an awesome one liner or catchphrase, roll +Swagger.",
          hit: "Your line is hilarious, well-timed, and cutting. Choose one: • Take +1 forward to your next roll • Your buddies are impressed (+1 Camaraderie)",
          partial: "As above, but also pick one: • Someone is enraged and immediately attacks you • Someone you care about is hurt • The comment slows an action scene down",
          miss: "The line falls flat. Take -1 forward as you're rattled by how lame your line was."
        }
      },
      {
        name: "Stunts",
        type: "move",
        system: {
          moveType: "basic",
          stat: "agility", // or muscles
          description: "When you perform a badass stunt, roll +Agility or +Muscles depending on the type of stunt.",
          hit: "You do the cool stunt and feel like a total badass. Take +1 forward. You may pass this +1 forward to another PC if you work them into the stunt.",
          partial: "The stunt is successful. Take +1 forward. However, you've left yourself in a precarious position; choose one from the miss list.",
          miss: "Choose one: • You fall • You lose something • You leave something behind • You hurt yourself (1 harm) • Tell the Director to make a move against you"
        }
      },
      {
        name: "Read a Situation",
        type: "move",
        system: {
          moveType: "basic",
          stat: "swagger",
          description: "When you read a charged situation, roll +Swagger.",
          hit: "Ask 3 questions from the list.",
          partial: "Ask 1 question from the list.",
          miss: "The Director makes a move against you.",
          tags: "Questions: Where's my best escape route/way in/way past?; Which enemy is most vulnerable to me?; Which enemy is the biggest threat?; What should I be on the lookout for?; What's my enemy's true position?; Who's in control here?"
        }
      },
      {
        name: "Read a Person",
        type: "move",
        system: {
          moveType: "basic",
          stat: "drama",
          description: "When you read a person in a charged interaction, roll +Drama.",
          hit: "Hold 3. While interacting with them, spend hold 1-for-1 to ask questions.",
          partial: "Hold 1. While interacting with them, spend hold 1-for-1 to ask questions.",
          miss: "The Director makes a move against you.",
          tags: "Questions: Is your character telling the truth?; What's your character really feeling?; What does your character intend to do?; What does your character wish I'd do?; How could I get your character to ___?"
        }
      },
      {
        name: "Vengeance",
        type: "move",
        system: {
          moveType: "basic",
          stat: "",
          customRoll: true,
          description: "When a PC dies, their compatriots may make a Vengeance move. This may only be used once per character per movie.",
          hit: "You gain a special hold. Spend this hold to get an automatic 10+ on a Combat or Stunt move provided it's done in direct pursuit of avenging your comrade's death.",
          partial: "",
          miss: "",
          tags: "No roll required - automatically gives hold"
        }
      },
      {
        name: "Camaraderie",
        type: "move",
        system: {
          moveType: "basic",
          stat: "camaraderie",
          customRoll: true,
          description: "When you attempt to draw on the strength of your fellowship to accomplish great feats, roll 2d6+Camaraderie. Each player may only roll this once per movie. Camaraderie decreases by 1 after any attempt.",
          hit: "Pick two from the list.",
          partial: "Pick one from the list.",
          miss: "Pick one from the miss list.",
          tags: "Success options: Heal one level of harm; Find an awesome new weapon; Do extra harm to the Villain; Get inspired (hold 1 for automatic 10+); Gain insight (all PCs get 1 XP, Camaraderie -3). Miss options: Lower Camaraderie by -1; Auto-fail next primary stat roll; GM move against compatriot; Fight breaks out between PCs"
        }
      }
    ];

    for (let moveData of basicMoves) {
      const existing = pack.index.find(i => i.name === moveData.name);
      if (!existing) {
        await Item.create(moveData, { pack: pack.collection });
      }
    }
  }

  static async createGearCompendium() {
    const packName = "action-movie-world.gear";
    let pack = game.packs.get(packName);
    
    if (!pack) {
      pack = await CompendiumCollection.createCompendium({
        type: "Item",
        label: "Gear & Equipment",
        name: "gear",
        package: "action-movie-world"
      });
    }

    const gearItems = [
      // Weapons
      {
        name: "Pistol",
        type: "gear",
        system: {
          gearType: "weapon",
          harm: 2,
          range: "close",
          qualities: "loud",
          description: "Standard sidearm. Reliable and concealable."
        }
      },
      {
        name: "Assault Rifle", 
        type: "gear",
        system: {
          gearType: "weapon",
          harm: 3,
          range: "close/far",
          qualities: "autofire, loud",
          description: "Military-grade automatic weapon."
        }
      },
      {
        name: "Shotgun",
        type: "gear", 
        system: {
          gearType: "weapon",
          harm: 3,
          range: "close",
          qualities: "reload, messy",
          description: "Close-range powerhouse."
        }
      },
      {
        name: "Sniper Rifle",
        type: "gear",
        system: {
          gearType: "weapon", 
          harm: 3,
          range: "far",
          qualities: "deadly, reload",
          description: "Long-range precision weapon."
        }
      },
      {
        name: "Sword",
        type: "gear",
        system: {
          gearType: "weapon",
          harm: 2, 
          range: "hand",
          qualities: "deadly",
          description: "Classic blade weapon."
        }
      },
      {
        name: "Katana",
        type: "gear",
        system: {
          gearType: "weapon",
          harm: 2,
          range: "hand", 
          qualities: "deadly",
          description: "Legendary Japanese sword."
        }
      },
      {
        name: "Throwing Knife",
        type: "gear",
        system: {
          gearType: "weapon",
          harm: 1,
          range: "close",
          qualities: "refill",
          description: "Balanced blade for throwing."
        }
      },
      {
        name: "Rocket Launcher",
        type: "gear",
        system: {
          gearType: "weapon",
          harm: 4,
          range: "far",
          qualities: "area, messy, refill",
          description: "Explosive ordnance for maximum destruction."
        }
      },

      // Armor
      {
        name: "Bulletproof Vest",
        type: "gear",
        system: {
          gearType: "armor",
          armor: 2,
          description: "Standard body armor worn by law enforcement."
        }
      },
      {
        name: "Leather Jacket",
        type: "gear", 
        system: {
          gearType: "armor",
          armor: 1,
          description: "Stylish protection for the cool action hero."
        }
      },
      {
        name: "Riot Gear",
        type: "gear",
        system: {
          gearType: "armor",
          armor: 2,
          qualities: "unwieldy",
          description: "Full tactical protection."
        }
      },

      // Equipment
      {
        name: "Grappling Hook",
        type: "gear",
        system: {
          gearType: "equipment",
          description: "Essential for rooftop escapes and dramatic entrances."
        }
      },
      {
        name: "Smoke Grenades",
        type: "gear",
        system: {
          gearType: "equipment", 
          qualities: "area, refill",
          description: "Create concealment and dramatic effect."
        }
      },
      {
        name: "Motorcycle",
        type: "gear",
        system: {
          gearType: "vehicle",
          description: "Fast and maneuverable. Perfect for chase scenes."
        }
      },
      {
        name: "Sports Car",
        type: "gear",
        system: {
          gearType: "vehicle",
          description: "Sleek and fast. Attracts attention."
        }
      },
      {
        name: "Helicopter",
        type: "gear",
        system: {
          gearType: "vehicle",
          description: "Aerial superiority and dramatic arrivals."
        }
      }
    ];

    for (let gearData of gearItems) {
      const existing = pack.index.find(i => i.name === gearData.name);
      if (!existing) {
        await Item.create(gearData, { pack: pack.collection });
      }
    }
  }

  static async createScriptMoves() {
    const packName = "action-movie-world.script-moves";
    let pack = game.packs.get(packName);
    
    if (!pack) {
      pack = await CompendiumCollection.createCompendium({
        type: "Item",
        label: "Script Moves",
        name: "script-moves", 
        package: "action-movie-world"
      });
    }

    const scriptMoves = [
      // Barbarian Script Moves
      {
        name: "Mighty Thews",
        type: "move",
        system: {
          moveType: "script",
          scriptType: "barbarian",
          temporary: true,
          stat: "",
          customRoll: true,
          description: "You're even more muscley and violent than most characters in barbarian movies. All of your attacks have the -area and -messy qualities.",
          tags: "barbarian, combat-enhancement"
        }
      },
      {
        name: "Magic is Scary",
        type: "move",
        system: {
          moveType: "script",
          scriptType: "barbarian", 
          temporary: true,
          stat: "swagger",
          description: "Wizardry is to be mistrusted at all times. When you are in combat with a wizard, warlock, witch, or other practitioner of the dark arts, roll +Swagger.",
          hit: "You are filled with loathing for the evil before you. All attacks against the source of your ire gain the -deadly quality.",
          partial: "Your fear leaves you open to magical attack, even as it drives you forward. You do +1 harm against magic using foes, but they do +1 harm to you as well.",
          miss: "Your fear has gotten the better of you. Pick one: You retreat quickly; Take -1 for the scene.",
          tags: "barbarian, anti-magic"
        }
      },
      
      // Ninja Script Moves
      {
        name: "Puff of Smoke",
        type: "move",
        system: {
          moveType: "script",
          scriptType: "ninja",
          temporary: true,
          stat: "swagger", 
          description: "You can disappear into thin air with the aid of a smoke bomb or other ninja device. When you want to disappear, roll +Swagger.",
          hit: "You disappear. When you come back, you have the element of surprise. Gain a +1 for the scene to all rolls when you decide to return.",
          partial: "You manage to get away, but you are seen at the last second. Get away but choose one: Take one level of harm; You cannot use the Puff of Smoke move again in this movie.",
          miss: "Your smoke is too thin, the wind too strong, etc. for your disappearance to work. You look pretty silly and the Director makes a move against you.",
          tags: "ninja, stealth"
        }
      },
      {
        name: "Dim Mak",
        type: "move",
        system: {
          moveType: "script", 
          scriptType: "ninja",
          temporary: true,
          stat: "drama",
          description: "By focusing your chi, you can kill with a touch. When you meditate on killing with the power of chi, roll +Drama.",
          hit: "You have the -deadly quality when attacking with your bare hands. This lasts for the rest of the scene.",
          partial: "As above but you take one level of harm as your chi is turned inward for dark purposes. As well, for the rest of the movie you gain one small but extremely noticeable deformity.",
          miss: "Your meditation on dark chi goes horribly wrong. Take two levels of harm. You gain one serious, overt deformity for the rest of the movie.",
          tags: "ninja, deadly, chi"
        }
      },

      // Cop Script Moves
      {
        name: "A Cop Who Doesn't Play By The Rules",
        type: "move",
        system: {
          moveType: "script",
          scriptType: "cop",
          temporary: true,
          stat: "drama",
          description: "You don't play by 'their' rules, whoever 'they' are. When you buck authority, roll +Drama.",
          hit: "Choose one: You inspire someone to follow your lead; The authority backs down; An enemy is distracted by you.",
          partial: "Choose one from above but you are forced to do something dangerous to remain on the force.",
          miss: "Someone in a position of authority is dedicated to making you pay.",
          tags: "cop, anti-authority"
        }
      },
      {
        name: "High Speed Chase",
        type: "move",
        system: {
          moveType: "script",
          scriptType: "cop",
          temporary: true,
          stat: "swagger",
          description: "Nobody's better than you in a chase. When you're behind the wheel, roll +Swagger.",
          hit: "Choose both: You get where you want really fast; You're safe.",
          partial: "Choose one: You get where you want really fast; You're safe.",
          miss: "You're not as good as you thought you were. You crash.",
          tags: "cop, vehicle, chase"
        }
      }
    ];

    for (let moveData of scriptMoves) {
      const existing = pack.index.find(i => i.name === moveData.name);
      if (!existing) {
        await Item.create(moveData, { pack: pack.collection });
      }
    }
  }

  static async createPlaybookMoves() {
    const packName = "action-movie-world.playbook-moves";
    let pack = game.packs.get(packName);
    
    if (!pack) {
      pack = await CompendiumCollection.createCompendium({
        type: "Item",
        label: "Playbook Moves",
        name: "playbook-moves",
        package: "action-movie-world"
      });
    }

    const playbookMoves = [
      // Musclehead Moves
      {
        name: "The Greatest Feeling You Can Get in a Gym is the Pump",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Add +1 to Muscles (max +3).",
          tags: "musclehead, stat-boost"
        }
      },
      {
        name: "Animal Magnetism",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "muscles",
          description: "When you attempt to seduce or manipulate someone, roll +Muscles instead of +Magnetism.",
          tags: "musclehead, substitution"
        }
      },
      {
        name: "Brutal Force",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Whenever you inflict harm, you have the option of inflicting +1 harm.",
          tags: "musclehead, combat"
        }
      },
      {
        name: "A Machine Made of Meat",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "muscles",
          description: "Getting hit only makes you angry. When you are hit in combat, whether harm is inflicted or not, roll +Muscles.",
          hit: "Hold 2.",
          partial: "Hold 1.",
          miss: "Take 1 harm from your rage.",
          tags: "musclehead, defensive, hold. Spend hold for: Immediately inflict 1 harm as counterattack; +1 harm on next attack; Close gap with enemy; Perform feat of human strength; +1 Muscles for scene"
        }
      },
      {
        name: "Get to the Chopper!",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Add +1 Camaraderie if you save one of the other Actors from harm.",
          tags: "musclehead, camaraderie"
        }
      },
      {
        name: "BFG",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Roll +Muscles instead of +Agility when shooting guns. You can also use weapons with the -two-handed quality in one hand.",
          tags: "musclehead, substitution, gear"
        }
      },

      // Gunfighter Moves
      {
        name: "Yes. I am God. You're one. A god can be human",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Add +1 to Agility (max +3).",
          tags: "gunfighter, stat-boost"
        }
      },
      {
        name: "Time to Reload",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "drama",
          description: "At any time during ranged combat, you can declare you're out of ammo. Reload your gun and roll +Drama.",
          hit: "Choose one option with no drawback.",
          partial: "Choose one option but take 1 harm from leaving yourself open.",
          miss: "You're stuck where you are; the Director makes a move.",
          tags: "gunfighter, dramatic. Options: Escape danger scot free; Rely on buddies for covering fire; Advance romantic interest; Gain extra tick of star power; Awesome shot makes something explode"
        }
      },
      {
        name: "Gun Ballet",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "All ranged weapons you use, no matter the type, count as having the -area special ability.",
          tags: "gunfighter, gear-modification"
        }
      },
      {
        name: "Instincts of the Predator",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Roll +Agility instead of +Swagger to read a situation.",
          tags: "gunfighter, substitution"
        }
      },
      {
        name: "This Is My Gun",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Any time a ranged weapon is in your hand, combat or not, you receive a +1 to all Stunt moves.",
          tags: "gunfighter, conditional-bonus"
        }
      },

      // Pugilist Moves
      {
        name: "Go for the gut. He's soft there.",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Add +1 to Agility (max +3).",
          tags: "pugilist, stat-boost"
        }
      },
      {
        name: "Duck and Weave",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "agility",
          description: "You're tough to get a bead on from range. When you take harm from a ranged attack, roll +Agility.",
          hit: "You avoid the damage.",
          partial: "You've ducked the worst of it but still got winged. Choose one: Duck into bad position but take 1 less harm; Too far from fellows but take 1 less harm.",
          miss: "Take the harm as normal.",
          tags: "pugilist, defensive"
        }
      },
      {
        name: "Sting Like a Bee",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "You may roll +Agility instead of +Muscles in melee.",
          tags: "pugilist, substitution"
        }
      },
      {
        name: "Training Montage",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "drama",
          oncePerSession: true,
          description: "By training hard or performing a kata, you can enhance your hand-to-hand combat capabilities. Once per session, roll +Drama.",
          hit: "Hold 2.",
          partial: "Hold 1.",
          miss: "The Director chooses: You're late for something important; You neglect a relationship; Someone/something is taken while you were occupied.",
          tags: "pugilist, training, hold. Spend hold for: +1 on Violence roll; +1 harm on Violence hit; -1 harm inflicted on you; Increase Star Power by 1 (limit once per movie)"
        }
      },
      {
        name: "Fists of Stone",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Inflict +1 harm when striking with your bare hands.",
          tags: "pugilist, combat"
        }
      },

      // Add more playbook moves for other archetypes...
      // (I'll include a few more key ones)

      // Smartass Moves
      {
        name: "Yippie ki yay, motherfucker!",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "Add +1 to Swagger (max +3).",
          tags: "smartass, stat-boost"
        }
      },
      {
        name: "Better Living Through Wisecracks",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "",
          customRoll: true,
          description: "You may roll +Swagger when performing a Stunt move.",
          tags: "smartass, substitution"
        }
      },
      {
        name: "Smiling Through the Pain",
        type: "move",
        system: {
          moveType: "playbook",
          stat: "swagger",
          description: "Physical punishment only makes you look cooler. When you take harm, dig deep into that core of resolve and roll +Swagger.",
          hit: "Hold 2.",
          partial: "Hold 1.",
          miss: "The pain gets to you. Take -1 forward.",
          tags: "smartass, defensive, hold. Spend hold for: Auto-10+ on Killer One-Liner; Substitute Swagger for another stat on next move; Add harm taken so far as bonus to next roll; Inspire fellows (+1 Camaraderie)"
        }
      }
    ];

    for (let moveData of playbookMoves) {
      const existing = pack.index.find(i => i.name === moveData.name);
      if (!existing) {
        await Item.create(moveData, { pack: pack.collection });
      }
    }
  }

  static async createPlaybookActors() {
    const packName = "action-movie-world.playbook-templates";
    let pack = game.packs.get(packName);
    
    if (!pack) {
      pack = await CompendiumCollection.createCompendium({
        type: "Actor",
        label: "Playbook Templates",
        name: "playbook-templates",
        package: "action-movie-world"
      });
    }

    const playbooks = [
      {
        name: "Musclehead Template",
        type: "character",
        system: {
          playbook: "musclehead",
          stats: {
            agility: { value: 0 },
            drama: { value: -1 },
            muscles: { value: 2 },
            magnetism: { value: -1 },
            swagger: { value: 2 }
          },
          highlighted: {
            primary: "muscles"
          }
        },
        items: [], // Will be populated with default moves
        flags: {
          "action-movie-world": {
            isTemplate: true,
            playbook: "musclehead"
          }
        }
      },
      {
        name: "Gunfighter Template", 
        type: "character",
        system: {
          playbook: "gunfighter",
          stats: {
            agility: { value: 2 },
            drama: { value: 1 },
            muscles: { value: -1 },
            magnetism: { value: 1 },
            swagger: { value: 0 }
          },
          highlighted: {
            primary: "agility"
          }
        },
        flags: {
          "action-movie-world": {
            isTemplate: true,
            playbook: "gunfighter"
          }
        }
      },
      {
        name: "Pugilist Template",
        type: "character", 
        system: {
          playbook: "pugilist",
          stats: {
            agility: { value: 2 },
            drama: { value: 1 },
            muscles: { value: 1 },
            magnetism: { value: 1 },
            swagger: { value: -1 }
          },
          highlighted: {
            primary: "agility"
          }
        },
        flags: {
          "action-movie-world": {
            isTemplate: true,
            playbook: "pugilist"
          }
        }
      },
      {
        name: "Smartass Template",
        type: "character",
        system: {
          playbook: "smartass", 
          stats: {
            agility: { value: 1 },
            drama: { value: -1 },
            muscles: { value: 1 },
            magnetism: { value: 0 },
            swagger: { value: 2 }
          },
          highlighted: {
            primary: "swagger"
          }
        },
        flags: {
          "action-movie-world": {
            isTemplate: true,
            playbook: "smartass"
          }
        }
      },
      {
        name: "Smooth Operator Template",
        type: "character",
        system: {
          playbook: "smooth-operator",
          stats: {
            agility: { value: 0 },
            drama: { value: 1 },
            muscles: { value: -1 },
            magnetism: { value: 2 },
            swagger: { value: 1 }
          },
          highlighted: {
            primary: "magnetism"
          }
        },
        flags: {
          "action-movie-world": {
            isTemplate: true,
            playbook: "smooth-operator"
          }
        }
      },
      {
        name: "Thespian Template",
        type: "character",
        system: {
          playbook: "thespian",
          stats: {
            agility: { value: -1 },
            drama: { value: 2 },
            muscles: { value: 0 },
            magnetism: { value: 1 },
            swagger: { value: 1 }
          },
          highlighted: {
            primary: "drama"
          }
        },
        flags: {
          "action-movie-world": {
            isTemplate: true,
            playbook: "thespian"
          }
        }
      },
      {
        name: "Yeller Template",
        type: "character",
        system: {
          playbook: "yeller",
          stats: {
            agility: { value: -1 },
            drama: { value: 1 },
            muscles: { value: 2 },
            magnetism: { value: 1 },
            swagger: { value: 0 }
          },
          highlighted: {
            primary: "muscles"
          }
        },
        flags: {
          "action-movie-world": {
            isTemplate: true,
            playbook: "yeller"
          }
        }
      }
    ];

    for (let actorData of playbooks) {
      const existing = pack.index.find(i => i.name === actorData.name);
      if (!existing) {
        await Actor.create(actorData, { pack: pack.collection });
      }
    }
  }
}
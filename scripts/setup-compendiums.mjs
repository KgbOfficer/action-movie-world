export class AMWCompendiumSetup {
  
  static async setupCompendiums() {
    console.log("AMW | Setting up compendiums...");
    
    try {
      await AMWCompendiumSetup.createPlaybookTemplatesCompendium();
      console.log("AMW | Compendium setup complete!");
    } catch (error) {
      console.error("AMW | Error during compendium setup:", error);
      ui.notifications.error("Failed to setup compendiums. Check console for details.");
    }
  }

  static async unlockCompendiums() {
    console.log("AMW | Unlock function called");
  }

  static async createPlaybookTemplatesCompendium() {
    console.log("AMW | Creating playbook templates compendium...");
    
    // Create or get the compendium
    const packName = "action-movie-world.playbook-templates";
    let pack = game.packs.get(packName);
    
    if (!pack) {
      try {
        pack = await CompendiumCollection.createCompendium({
          type: "Actor",
          label: "Playbook Templates",
          name: "playbook-templates",
          package: "action-movie-world"
        });
        console.log("AMW | Created new compendium:", pack.metadata.label);
      } catch (error) {
        console.error("AMW | Failed to create compendium:", error);
        return;
      }
    }

    // Unlock the compendium for editing
    if (pack.locked) {
      try {
        await pack.configure({ locked: false });
        console.log("AMW | Unlocked compendium");
      } catch (error) {
        console.error("AMW | Failed to unlock compendium:", error);
      }
    }

    // Clear existing entries first
    const existingEntries = pack.index.contents;
    for (let entry of existingEntries) {
      try {
        const doc = await pack.getDocument(entry._id);
        await doc.delete();
        console.log("Deleted existing template:", entry.name);
      } catch (error) {
        console.log("Could not delete:", entry.name);
      }
    }
    
    const templateConfigs = [
      {
        actorData: {
          name: "Musclehead Template",
          type: "character",
          img: "icons/skills/melee/unarmed-punch-fist.webp",
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
          flags: {
            "action-movie-world": {
              isTemplate: true,
              playbook: "musclehead"
            }
          }
        },
        moves: [
          {
            name: "The Greatest Feeling You Can Get in a Gym is the Pump",
            type: "move",
            img: "icons/skills/melee/unarmed-punch-fist.webp",
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
            img: "icons/magic/symbols/heart-glowing-red.webp",
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
            img: "icons/skills/melee/strike-sword-steel-yellow.webp",
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
            img: "icons/magic/defensive/armor-plate-steel.webp",
            system: {
              moveType: "playbook",
              stat: "muscles",
              description: "Getting hit only makes you angry. When you are hit in combat, whether harm is inflicted or not, roll +Muscles.",
              hit: "Hold 2.",
              partial: "Hold 1.",
              miss: "Take 1 harm from your rage.",
              tags: "musclehead, defensive, hold"
            }
          },
          {
            name: "Get to the Chopper!",
            type: "move",
            img: "icons/vehicles/air/helicopter-military.webp",
            system: {
              moveType: "playbook",
              stat: "",
              customRoll: true,
              description: "Add +1 Camaraderie if you save one of the other Actors from harm.",
              tags: "musclehead, camaraderie"
            }
          }
        ]
      },
      {
        actorData: {
          name: "Gunfighter Template",
          type: "character",
          img: "icons/weapons/guns/pistol-flintlock-metal.webp",
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
        moves: [
          {
            name: "Yes. I am God. You're one. A god can be human",
            type: "move",
            img: "icons/weapons/guns/pistol-flintlock-metal.webp",
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
            img: "icons/weapons/ammunition/bullets-cartridge-shell.webp",
            system: {
              moveType: "playbook",
              stat: "drama",
              description: "At any time during ranged combat, you can declare you're out of ammo. Reload your gun and roll +Drama.",
              hit: "Choose one option with no drawback.",
              partial: "Choose one option but take 1 harm from leaving yourself open.",
              miss: "You're stuck where you are; the Director makes a move.",
              tags: "gunfighter, dramatic"
            }
          },
          {
            name: "Gun Ballet",
            type: "move",
            img: "icons/skills/movement/figure-running.webp",
            system: {
              moveType: "playbook",
              stat: "",
              customRoll: true,
              description: "All ranged weapons you use count as having the area special ability.",
              tags: "gunfighter, gear-modification"
            }
          },
          {
            name: "Instincts of the Predator",
            type: "move",
            img: "icons/magic/perception/eye-ringed-green.webp",
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
            img: "icons/weapons/guns/gun-pistol-flintlock.webp",
            system: {
              moveType: "playbook",
              stat: "",
              customRoll: true,
              description: "Any time a ranged weapon is in your hand, you receive a +1 to all Stunt moves.",
              tags: "gunfighter, conditional-bonus"
            }
          }
        ]
      },
      {
        actorData: {
          name: "Pugilist Template",
          type: "character",
          img: "icons/skills/melee/unarmed-punch-cross.webp",
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
        moves: [
          {
            name: "Go for the gut. He's soft there.",
            type: "move",
            img: "icons/skills/melee/unarmed-punch-cross.webp",
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
            img: "icons/skills/movement/figure-running.webp",
            system: {
              moveType: "playbook",
              stat: "agility",
              description: "You're tough to get a bead on from range. When you take harm from a ranged attack, roll +Agility.",
              hit: "You avoid the damage.",
              partial: "You've ducked the worst of it but still got winged. Take 1 less harm but choose a consequence.",
              miss: "Take the harm as normal.",
              tags: "pugilist, defensive"
            }
          },
          {
            name: "Sting Like a Bee",
            type: "move",
            img: "icons/skills/melee/unarmed-punch-fist.webp",
            system: {
              moveType: "playbook",
              stat: "",
              customRoll: true,
              description: "You may roll +Agility instead of +Muscles in melee combat.",
              tags: "pugilist, substitution"
            }
          },
          {
            name: "Training Montage",
            type: "move",
            img: "icons/skills/trades/academics-study-reading.webp",
            system: {
              moveType: "playbook",
              stat: "drama",
              oncePerSession: true,
              description: "By training hard, you can enhance your combat capabilities. Once per session, roll +Drama.",
              hit: "Hold 2.",
              partial: "Hold 1.",
              miss: "Choose a consequence: You're late; You neglect a relationship; Something is taken.",
              tags: "pugilist, training, hold"
            }
          },
          {
            name: "Fists of Stone",
            type: "move",
            img: "icons/skills/melee/unarmed-punch-fist-white.webp",
            system: {
              moveType: "playbook",
              stat: "",
              customRoll: true,
              description: "Inflict +1 harm when striking with your bare hands.",
              tags: "pugilist, combat"
            }
          }
        ]
      },
      {
        actorData: {
          name: "Smartass Template",
          type: "character",
          img: "icons/skills/social/diplomacy-peace-alliance.webp",
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
        moves: [
          {
            name: "Yippie ki yay, motherfucker!",
            type: "move",
            img: "icons/skills/social/trading-justice-scale.webp",
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
            img: "icons/skills/social/diplomacy-peace-alliance.webp",
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
            img: "icons/skills/wounds/blood-drip-droplet-red.webp",
            system: {
              moveType: "playbook",
              stat: "swagger",
              description: "Physical punishment only makes you look cooler. When you take harm, roll +Swagger.",
              hit: "Hold 2.",
              partial: "Hold 1.",
              miss: "The pain gets to you. Take -1 forward.",
              tags: "smartass, defensive, hold"
            }
          }
        ]
      },
      {
        actorData: {
          name: "Smooth Operator Template",
          type: "character",
          img: "icons/skills/social/diplomacy-handshake.webp",
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
        moves: [
          {
            name: "Smooth Talker",
            type: "move",
            img: "icons/skills/social/diplomacy-handshake.webp",
            system: {
              moveType: "playbook",
              stat: "",
              customRoll: true,
              description: "Add +1 to Magnetism (max +3).",
              tags: "smooth-operator, stat-boost"
            }
          },
          {
            name: "Natural Charm",
            type: "move",
            img: "icons/magic/symbols/heart-glowing-red.webp",
            system: {
              moveType: "playbook",
              stat: "magnetism",
              description: "When you meet someone important for the first time, roll +Magnetism.",
              hit: "They think you're great. Take +1 forward when dealing with them.",
              partial: "They like you well enough. You have their attention.",
              miss: "You've somehow rubbed them the wrong way.",
              tags: "smooth-operator, social"
            }
          }
        ]
      },
      {
        actorData: {
          name: "Thespian Template",
          type: "character",
          img: "icons/skills/social/wave-halt-stop.webp",
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
        moves: [
          {
            name: "Method Acting",
            type: "move",
            img: "icons/skills/social/wave-halt-stop.webp",
            system: {
              moveType: "playbook",
              stat: "",
              customRoll: true,
              description: "Add +1 to Drama (max +3).",
              tags: "thespian, stat-boost"
            }
          },
          {
            name: "The Show Must Go On",
            type: "move",
            img: "icons/skills/social/diplomacy-peace-alliance.webp",
            system: {
              moveType: "playbook",
              stat: "drama",
              description: "When you act through pain, fear, or exhaustion, roll +Drama.",
              hit: "You deliver a powerful performance. Take +1 forward and inspire others.",
              partial: "You push through, but it costs you. Take +1 forward but also take 1 harm or -1 forward to your next roll.",
              miss: "The strain overwhelms you. Take -1 forward.",
              tags: "thespian, performance"
            }
          }
        ]
      },
      {
        actorData: {
          name: "Yeller Template",
          type: "character",
          img: "icons/skills/social/shout-exclaim-yellow.webp",
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
        },
        moves: [
          {
            name: "Loud and Proud",
            type: "move",
            img: "icons/skills/social/shout-exclaim-yellow.webp",
            system: {
              moveType: "playbook",
              stat: "",
              customRoll: true,
              description: "Add +1 to Muscles (max +3).",
              tags: "yeller, stat-boost"
            }
          },
          {
            name: "Intimidating Presence",
            type: "move",
            img: "icons/skills/social/intimidation.webp",
            system: {
              moveType: "playbook",
              stat: "muscles",
              description: "When you shout at someone to get them to back down or comply, roll +Muscles instead of +Magnetism.",
              tags: "yeller, substitution"
            }
          }
        ]
      }
    ];

    // Create actors in world first, then move to compendium
    for (let i = 0; i < templateConfigs.length; i++) {
      const config = templateConfigs[i];
      
      try {
        console.log("Creating", config.actorData.name, "in world first...");
        
        // Create actor in world
        const worldActor = await Actor.create(config.actorData);
        
        // Add moves to the world actor
        if (config.moves && config.moves.length > 0) {
          await Item.create(config.moves, { parent: worldActor });
          console.log("Added", config.moves.length, "moves to", config.actorData.name);
        }
        
        // Verify the actor has moves
        console.log("World actor items:", worldActor.items.contents.map(i => i.name));
        
        // Now move to compendium using toCompendium
        const compendiumData = worldActor.toCompendium();
        console.log("Compendium data items:", compendiumData.items?.length || 0);
        
        // Create in compendium
        const compendiumActor = await Actor.create(compendiumData, { pack: pack.collection });
        console.log("Created", config.actorData.name, "in compendium");
        
        // Clean up world actor
        await worldActor.delete();
        console.log("Cleaned up world actor");
        
      } catch (error) {
        console.error("Failed to create template:", config.actorData.name, error);
      }
    }

    ui.notifications.info("Playbook templates created in compendium with moves!");
  }
}
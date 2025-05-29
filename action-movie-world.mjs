console.log("AMW | Loading system file...");

// Import configuration
let AMW, AMWActor, AMWActorSheet, AMWItem, AMWItemSheet, AMWChatMessage, AMWCompendiumSetup;

try {
  const configModule = await import("./config.mjs");
  AMW = configModule.AMW;
  console.log("AMW | Config loaded successfully");
} catch (error) {
  console.error("AMW | Failed to load config:", error);
}

try {
  const actorModule = await import("./documents/actor.mjs");
  AMWActor = actorModule.AMWActor;
  console.log("AMW | Actor document loaded");
} catch (error) {
  console.error("AMW | Failed to load actor document:", error);
}

try {
  const actorSheetModule = await import("./sheets/actor-sheet.mjs");
  AMWActorSheet = actorSheetModule.AMWActorSheet;
  console.log("AMW | Actor sheet loaded");
} catch (error) {
  console.error("AMW | Failed to load actor sheet:", error);
}

try {
  const itemModule = await import("./documents/item.mjs");
  AMWItem = itemModule.AMWItem;
  console.log("AMW | Item document loaded");
} catch (error) {
  console.error("AMW | Failed to load item document:", error);
}

try {
  const itemSheetModule = await import("./sheets/item-sheet.mjs");
  AMWItemSheet = itemSheetModule.AMWItemSheet;
  console.log("AMW | Item sheet loaded");
} catch (error) {
  console.error("AMW | Failed to load item sheet:", error);
}

try {
  const chatModule = await import("./documents/chat-message.mjs");
  AMWChatMessage = chatModule.AMWChatMessage;
  console.log("AMW | Chat message loaded");
} catch (error) {
  console.error("AMW | Failed to load chat message:", error);
}

try {
  const setupModule = await import("./scripts/setup-compendiums.mjs");
  AMWCompendiumSetup = setupModule.AMWCompendiumSetup;
  console.log("AMW | Compendium setup loaded");
} catch (error) {
  console.error("AMW | Failed to load compendium setup:", error);
}

Hooks.once('init', async function() {
  console.log('AMW | Init hook triggered');
  
  try {
    // Assign custom classes and constants
    if (AMW) CONFIG.AMW = AMW;
    if (AMWActor) CONFIG.Actor.documentClass = AMWActor;
    if (AMWItem) CONFIG.Item.documentClass = AMWItem;
    if (AMWChatMessage) CONFIG.ChatMessage.documentClass = AMWChatMessage;

    // Register sheet application classes
    if (AMWActorSheet) {
      Actors.unregisterSheet("core", ActorSheet);
      Actors.registerSheet("action-movie-world", AMWActorSheet, { 
        types: ["actor", "character"], 
        makeDefault: true,
        label: "AMW.SheetLabels.Actor"
      });
    }

    if (AMWItemSheet) {
      Items.unregisterSheet("core", ItemSheet);
      Items.registerSheet("action-movie-world", AMWItemSheet, { 
        types: ["move", "gear", "script"], 
        makeDefault: true,
        label: "AMW.SheetLabels.Item"
      });
    }

    // Register system settings
    game.settings.register("action-movie-world", "setupComplete", {
      name: "Compendium Setup Complete",
      hint: "Whether the initial compendium setup has been completed.",
      scope: "world",
      config: false,
      type: Boolean,
      default: false
    });

    game.settings.register("action-movie-world", "camaraderie", {
      name: "Current Camaraderie",
      hint: "The current Camaraderie value for the group.",
      scope: "world", 
      config: true,
      type: Number,
      default: 0,
      range: {
        min: -3,
        max: 3,
        step: 1
      }
    });

    console.log("AMW | Settings registered successfully");

    // Preload Handlebars templates (optional - might fail if templates don't exist)
    try {
      await loadTemplates([
        "systems/action-movie-world/templates/actor/parts/actor-stats.hbs",
        "systems/action-movie-world/templates/actor/parts/actor-moves.hbs",
        "systems/action-movie-world/templates/actor/parts/actor-gear.hbs",
        "systems/action-movie-world/templates/actor/parts/actor-relationships.hbs",
        "systems/action-movie-world/templates/item/parts/move-details.hbs",
        "systems/action-movie-world/templates/item/parts/gear-details.hbs",
        "systems/action-movie-world/templates/chat/roll-result.hbs"
      ]);
      console.log("AMW | Templates loaded");
    } catch (error) {
      console.log("AMW | Some templates failed to load (this is ok):", error.message);
    }

  } catch (error) {
    console.error("AMW | Init hook failed:", error);
  }
});

Hooks.once("ready", async function() {
  console.log('AMW | Ready hook triggered');
  
  try {
    // Register custom Handlebars helpers
    Handlebars.registerHelper('concat', function() {
      var outStr = '';
      for (var arg in arguments) {
        if (typeof arguments[arg] != 'object') {
          outStr += arguments[arg];
        }
      }
      return outStr;
    });

    Handlebars.registerHelper('toLowerCase', function(str) {
      return str.toLowerCase();
    });

    Handlebars.registerHelper('amw-rollData', function(actor) {
      const context = {};
      context.actor = actor.data;
      context.data = actor.data.data;
      return context;
    });

    // Create global AMW object
    game.amw = {
      test: function() {
        console.log("AMW test function works!");
        ui.notifications.info("AMW is working!");
      },

      setupCompendiums: async function() {
        if (!game.user.isGM) {
          ui.notifications.warn("Only GMs can setup compendiums.");
          return;
        }
        
        if (!AMWCompendiumSetup) {
          ui.notifications.error("Compendium setup module not loaded!");
          return;
        }
        
        try {
          ui.notifications.info("Setting up Action Movie World compendiums...");
          await AMWCompendiumSetup.setupCompendiums();
          await game.settings.set("action-movie-world", "setupComplete", true);
          ui.notifications.info("Compendiums setup complete!");
        } catch (error) {
          console.error("AMW | Manual compendium setup error:", error);
          ui.notifications.error("Failed to setup compendiums. Check console for details.");
        }
      },

      unlockCompendiums: async function() {
        if (!game.user.isGM) {
          ui.notifications.warn("Only GMs can unlock compendiums.");
          return;
        }
        
        if (!AMWCompendiumSetup) {
          ui.notifications.error("Compendium setup module not loaded!");
          return;
        }
        
        try {
          await AMWCompendiumSetup.unlockCompendiums();
          ui.notifications.info("AMW compendiums unlocked!");
        } catch (error) {
          console.error("AMW | Failed to unlock compendiums:", error);
          ui.notifications.error("Failed to unlock compendiums. Check console for details.");
        }
      },

      rollItemMacro: function(itemName) {
        const speaker = ChatMessage.getSpeaker();
        let actor;
        if (speaker.token) actor = game.actors.tokens[speaker.token];
        if (!actor) actor = game.actors.get(speaker.actor);
        if (!actor) {
          ui.notifications.warn("No actor selected for this macro.");
          return;
        }
        const item = actor.items.find(i => i.name === itemName);
        if (!item) {
          ui.notifications.warn(`Item '${itemName}' not found on the selected actor.`);
          return;
        }
        return item.roll();
      }
    };

    console.log('AMW | Global object created successfully');
    console.log('AMW | Available functions:', Object.keys(game.amw));

    // Setup compendiums if this is the first time loading the system
    const hasSetupCompendiums = game.settings.get("action-movie-world", "setupComplete");
    console.log('AMW | Setup complete flag:', hasSetupCompendiums);
    
    if (!hasSetupCompendiums && game.user.isGM && AMWCompendiumSetup) {
      try {
        console.log("AMW | First time setup - creating compendiums...");
        await AMWCompendiumSetup.setupCompendiums();
        await game.settings.set("action-movie-world", "setupComplete", true);
        ui.notifications.info("Action Movie World compendiums have been set up!");
      } catch (error) {
        console.error("AMW | Error setting up compendiums:", error);
        ui.notifications.error("Failed to setup compendiums automatically. Use game.amw.setupCompendiums() manually.");
      }
    }

  } catch (error) {
    console.error("AMW | Ready hook failed:", error);
  }
});

// Chat message hooks
if (AMWChatMessage) {
  Hooks.on("renderChatMessage", (message, html, data) => {
    html.find('.amw-roll').click(AMWChatMessage._onRollClick.bind(message));
  });
}

// Hotbar macros
Hooks.on("hotbarDrop", (bar, data, slot) => {
  if (data.type !== "Item") return;
  createItemMacro(data.data, slot);
  return false;
});

async function createItemMacro(item, slot) {
  const command = `game.amw.rollItemMacro("${item.name}");`;
  let macro = game.macros.find(m => (m.name === item.name) && (m.command === command));
  if (!macro) {
    macro = await Macro.create({
      name: item.name,
      type: "script",
      img: item.img,
      command: command,
      flags: { "action-movie-world.itemMacro": true }
    });
  }
  game.user.assignHotbarMacro(macro, slot);
  return false;
}

console.log("AMW | System file loaded successfully");
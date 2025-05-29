// Import configuration
import { AMW } from "./config.mjs";
import { AMWActor } from "./documents/actor.mjs";
import { AMWActorSheet } from "./sheets/actor-sheet.mjs";
import { AMWItem } from "./documents/item.mjs";
import { AMWItemSheet } from "./sheets/item-sheet.mjs";
import { AMWChatMessage } from "./documents/chat-message.mjs";
import { AMWCompendiumSetup } from "./scripts/setup-compendiums.mjs";

/* -------------------------------------------- */
/*  Init Hook                                    */
/* -------------------------------------------- */
Hooks.once('init', async function() {
  console.log('AMW | Initializing Action Movie World System');

  // Assign custom classes and constants here
  CONFIG.AMW = AMW;
  CONFIG.Actor.documentClass = AMWActor;
  CONFIG.Item.documentClass = AMWItem;
  CONFIG.ChatMessage.documentClass = AMWChatMessage;

  // Register sheet application classes
  Actors.unregisterSheet("core", ActorSheet);
  Actors.registerSheet("action-movie-world", AMWActorSheet, { 
    types: ["actor", "character"], 
    makeDefault: true,
    label: "AMW.SheetLabels.Actor"
  });

  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("action-movie-world", AMWItemSheet, { 
    types: ["move", "gear", "script"], 
    makeDefault: true,
    label: "AMW.SheetLabels.Item"
  });

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

  // Preload Handlebars templates
  return loadTemplates([
    "systems/action-movie-world/templates/actor/parts/actor-stats.hbs",
    "systems/action-movie-world/templates/actor/parts/actor-moves.hbs",
    "systems/action-movie-world/templates/actor/parts/actor-gear.hbs",
    "systems/action-movie-world/templates/actor/parts/actor-relationships.hbs",
    "systems/action-movie-world/templates/item/parts/move-details.hbs",
    "systems/action-movie-world/templates/item/parts/gear-details.hbs",
    "systems/action-movie-world/templates/chat/roll-result.hbs"
  ]);
});

/* -------------------------------------------- */
/*  Handlebars Helpers                          */
/* -------------------------------------------- */
Hooks.once("ready", async function() {
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

  // Wait to register hotbar drop hook on ready so that modules could register earlier if they want to
  Hooks.on("hotbarDrop", (bar, data, slot) => {
    if (data.type !== "Item") return;
    createItemMacro(data.data, slot);
    return false;
  });

  // Setup compendiums if this is the first time loading the system
  const hasSetupCompendiums = game.settings.get("action-movie-world", "setupComplete");
  if (!hasSetupCompendiums && game.user.isGM) {
    try {
      await AMWCompendiumSetup.setupCompendiums();
      await game.settings.set("action-movie-world", "setupComplete", true);
      ui.notifications.info("Action Movie World compendiums have been set up! Check the Compendium packs for Basic Moves, Playbook Moves, and Character Templates.");
    } catch (error) {
      console.error("AMW | Error setting up compendiums:", error);
    }
  }
});

/* -------------------------------------------- */
/*  Chat Message Hooks                          */
/* -------------------------------------------- */
Hooks.on("renderChatMessage", (message, html, data) => {
  // Add click listeners for roll buttons in chat
  html.find('.amw-roll').click(AMWChatMessage._onRollClick.bind(message));
});

/* -------------------------------------------- */
/*  Hotbar Macros                               */
/* -------------------------------------------- */
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

// Create a global reference for macros
globalThis.game.amw = {
  rollItemMacro: function(itemName) {
    const speaker = ChatMessage.getSpeaker();
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);
    if (!actor) {
      ui.notifications.warn(game.i18n.localize("AMW.MacroNoActorSelected"));
      return;
    }
    const item = actor.items.find(i => i.name === itemName);
    if (!item) {
      ui.notifications.warn(game.i18n.format("AMW.MacroItemNotFound", {item: itemName}));
      return;
    }
    return item.roll();
  }
};
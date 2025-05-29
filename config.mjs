export const AMW = {};

// ASCII Artwork
AMW.ASCII = `_______________________________
 ___    __  ____      __
/ _ |  /  |/  / | /| / /
/ __ | / /|_/ /| |/ |/ / 
/_/ |_/_/  /_/ |__/|__/  
_______________________________`;

// Define constants
AMW.actorTypes = {
  "actor": "AMW.ActorTypeActor",
  "character": "AMW.ActorTypeCharacter"
};

AMW.itemTypes = {
  "move": "AMW.ItemTypeMove",
  "gear": "AMW.ItemTypeGear", 
  "script": "AMW.ItemTypeScript"
};

// Stats configuration
AMW.stats = {
  "agility": "AMW.StatAgility",
  "drama": "AMW.StatDrama",
  "muscles": "AMW.StatMuscles",
  "magnetism": "AMW.StatMagnetism",
  "swagger": "AMW.StatSwagger"
};

// Actor Playbooks
AMW.playbooks = {
  "musclehead": "AMW.PlaybookMusclehead",
  "gunfighter": "AMW.PlaybookGunfighter", 
  "pugilist": "AMW.PlaybookPugilist",
  "smartass": "AMW.PlaybookSmartass",
  "smooth-operator": "AMW.PlaybookSmoothOperator",
  "thespian": "AMW.PlaybookThespian",
  "yeller": "AMW.PlaybookYeller",
  "child-actor": "AMW.PlaybookChildActor",
  "old-codger": "AMW.PlaybookOldCodger"
};

// Move types
AMW.moveTypes = {
  "basic": "AMW.MoveTypeBasic",
  "playbook": "AMW.MoveTypePlaybook", 
  "script": "AMW.MoveTypeScript"
};

// Gear qualities
AMW.gearQualities = {
  "ap": "AMW.GearQualityAP",
  "area": "AMW.GearQualityArea",
  "autofire": "AMW.GearQualityAutofire",
  "close": "AMW.GearQualityClose",
  "deadly": "AMW.GearQualityDeadly",
  "far": "AMW.GearQualityFar",
  "hand": "AMW.GearQualityHand",
  "intimate": "AMW.GearQualityIntimate",
  "loud": "AMW.GearQualityLoud",
  "messy": "AMW.GearQualityMessy",
  "refill": "AMW.GearQualityRefill",
  "reload": "AMW.GearQualityReload",
  "tag": "AMW.GearQualityTag",
  "two-handed": "AMW.GearQualityTwoHanded",
  "unwieldy": "AMW.GearQualityUnwieldy",
  "valuable": "AMW.GearQualityValuable"
};

// Harm levels
AMW.harmLevels = {
  0: "AMW.HarmLevel0",
  1: "AMW.HarmLevel1", 
  2: "AMW.HarmLevel2",
  3: "AMW.HarmLevel3",
  4: "AMW.HarmLevel4",
  5: "AMW.HarmLevel5"
};

// Scripts/Movie types
AMW.scripts = {
  "barbarian": "AMW.ScriptBarbarian",
  "cop": "AMW.ScriptCop",
  "fighting-tournament": "AMW.ScriptFightingTournament",
  "ninja": "AMW.ScriptNinja",
  "sci-fi": "AMW.ScriptSciFi",
  "war": "AMW.ScriptWar",
  "comic-book": "AMW.ScriptComicBook",
  "disaster": "AMW.ScriptDisaster",
  "family-friendly": "AMW.ScriptFamilyFriendly",
  "trucker": "AMW.ScriptTrucker",
  "vigilante": "AMW.ScriptVigilante"
};

// Roll result ranges  
AMW.rollResults = {
  "miss": { min: 2, max: 6, label: "AMW.RollResultMiss" },
  "partial": { min: 7, max: 9, label: "AMW.RollResultPartial" },
  "hit": { min: 10, max: 12, label: "AMW.RollResultHit" }
};

// Basic moves list
AMW.basicMoves = [
  "violence",
  "getting-what-you-want", 
  "emote",
  "love-scene",
  "killer-one-liner",
  "stunts",
  "read-a-situation",
  "read-a-person",
  "vengeance",
  "camaraderie"
];

// Roles
AMW.roles = {
  "lead": "AMW.RoleLead",
  "supporting": "AMW.RoleSupporting"
};
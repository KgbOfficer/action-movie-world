export class AMWItem extends Item {

  /** @override */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareDerivedData() {
    const itemData = this;
    const systemData = itemData.system;
    
    // Make separate methods for each Item type
    this._prepareMoveData(itemData);
    this._prepareGearData(itemData);
    this._prepareScriptData(itemData);
  }

  /**
   * Prepare Move type specific data
   */
  _prepareMoveData(itemData) {
    if (itemData.type !== 'move') return;
    
    const systemData = itemData.system;
    
    // Ensure stat is valid
    if (systemData.stat && !CONFIG.AMW.stats[systemData.stat]) {
      systemData.stat = "agility";
    }
  }

  /**
   * Prepare Gear type specific data
   */
  _prepareGearData(itemData) {
    if (itemData.type !== 'gear') return;
    
    const systemData = itemData.system;
    
    // Parse qualities into array
    if (typeof systemData.qualities === 'string') {
      systemData.qualitiesList = systemData.qualities
        .split(',')
        .map(q => q.trim().toLowerCase())
        .filter(q => q.length > 0);
    } else {
      systemData.qualitiesList = [];
    }
  }

  /**
   * Prepare Script type specific data
   */
  _prepareScriptData(itemData) {
    if (itemData.type !== 'script') return;
    
    const systemData = itemData.system;
    
    // Scripts contain multiple moves and gear options
    systemData.movesList = systemData.moves || [];
    systemData.gearList = systemData.gear || [];
  }

  /**
   * Handle rolling a move
   */
  async roll() {
    if (this.type !== 'move') return;
    
    const actor = this.parent;
    if (!actor) {
      ui.notifications.warn(game.i18n.localize("AMW.NoActorForMove"));
      return;
    }

    const moveData = this.system;
    const stat = moveData.stat;
    
    if (!stat || !actor.system.stats[stat]) {
      ui.notifications.warn(game.i18n.localize("AMW.InvalidStatForMove"));
      return;
    }

    // Check if move has custom roll logic
    if (moveData.customRoll) {
      return this._handleCustomMove(actor);
    }

    // Standard 2d6 + stat roll
    const statValue = actor.system.stats[stat].value;
    const roll = new Roll("2d6 + @stat", { stat: statValue });
    const result = await roll.evaluate();

    // Determine success level
    let resultType = "miss";
    let resultLabel = game.i18n.localize("AMW.RollResultMiss");
    
    if (result.total >= 10) {
      resultType = "hit";
      resultLabel = game.i18n.localize("AMW.RollResultHit");
    } else if (result.total >= 7) {
      resultType = "partial";
      resultLabel = game.i18n.localize("AMW.RollResultPartial");
    }

    // Check for highlighted stat tick
    let gainTick = false;
    if (actor.system.highlightedStats?.includes(stat) && result.total >= 10) {
      gainTick = true;
      actor.addTick();
    }

    // Create chat message
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      roll: result,
      content: await renderTemplate("systems/action-movie-world/templates/chat/move-result.hbs", {
        actor: actor,
        item: this,
        move: this.name,
        stat: stat,
        statLabel: game.i18n.localize(`AMW.Stat${stat.capitalize()}`),
        result: result.total,
        resultType: resultType,
        resultLabel: resultLabel,
        gainTick: gainTick,
        description: moveData.description,
        hit: moveData.hit,
        partial: moveData.partial,
        miss: moveData.miss,
        formula: roll.formula,
        tooltip: await result.getTooltip()
      })
    };

    ChatMessage.create(chatData);
    return result;
  }

  /**
   * Handle moves with special mechanics
   */
  async _handleCustomMove(actor) {
    const moveName = this.name.toLowerCase().replace(/\s+/g, '-');
    
    switch (moveName) {
      case 'camaraderie':
        return this._rollCamaraderie(actor);
      case 'vengeance':
        return this._handleVengeance(actor);
      default:
        // Fall back to standard roll
        return this.roll();
    }
  }

  /**
   * Handle Camaraderie move
   */
  async _rollCamaraderie(actor) {
    // Get current camaraderie value from scene/game
    const camaraderie = game.settings.get("action-movie-world", "camaraderie") || 0;
    
    const roll = new Roll("2d6 + @camaraderie", { camaraderie: camaraderie });
    const result = await roll.evaluate();

    // Camaraderie decreases by 1 after any attempt
    await game.settings.set("action-movie-world", "camaraderie", Math.max(camaraderie - 1, -3));

    // Handle results based on Camaraderie move text
    let choices = [];
    if (result.total >= 10) {
      choices = ["heal", "weapon", "harm-villain", "inspiration", "insight"];
    } else if (result.total >= 7) {
      choices = ["heal", "weapon", "harm-villain", "inspiration", "insight"];
    } else {
      choices = ["lower-camaraderie", "fail-primary", "gm-move", "pc-fight"];
    }

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      roll: result,
      content: await renderTemplate("systems/action-movie-world/templates/chat/camaraderie-result.hbs", {
        actor: actor,
        result: result.total,
        camaraderie: camaraderie,
        choices: choices,
        tooltip: await result.getTooltip()
      })
    };

    ChatMessage.create(chatData);
    return result;
  }

  /**
   * Handle Vengeance move
   */
  async _handleVengeance(actor) {
    // Vengeance doesn't roll - it gives an automatic 10+ hold
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: await renderTemplate("systems/action-movie-world/templates/chat/vengeance-result.hbs", {
        actor: actor
      })
    };

    // Add vengeance hold to actor
    const currentHolds = actor.system.holds?.vengeance || 0;
    await actor.update({
      "system.holds.vengeance": currentHolds + 1
    });

    ChatMessage.create(chatData);
  }

  /**
   * Handle using gear
   */
  async use() {
    if (this.type !== 'gear') return;
    
    const actor = this.parent;
    if (!actor) return;

    const gearData = this.system;
    
    // Create chat message showing gear use
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: await renderTemplate("systems/action-movie-world/templates/chat/gear-use.hbs", {
        actor: actor,
        item: this,
        gear: this.name,
        description: gearData.description,
        harm: gearData.harm,
        armor: gearData.armor,
        qualities: gearData.qualitiesList
      })
    };

    ChatMessage.create(chatData);
  }
}
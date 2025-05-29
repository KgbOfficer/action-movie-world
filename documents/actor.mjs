export class AMWActor extends Actor {

  /** @override */
  prepareData() {
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    super.prepareBaseData();
  }

  /** @override */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.amw || {};

    // Make separate methods for each Actor type to keep things organized
    this._prepareCharacterData(actorData);
    this._prepareActorData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    const systemData = actorData.system;
    
    // Calculate derived values
    systemData.harm.max = 5;
    systemData.starPower.max = 5;
    
    // Ensure stats are within bounds
    for (let [key, stat] of Object.entries(systemData.stats)) {
      stat.value = Math.clamped(stat.value, -3, 3);
    }

    // Calculate highlighted stats bonus
    if (systemData.highlighted.primary && systemData.highlighted.secondary) {
      systemData.highlightedStats = [
        systemData.highlighted.primary,
        systemData.highlighted.secondary
      ];
    }
  }

  /**
   * Prepare Actor type specific data  
   */
  _prepareActorData(actorData) {
    if (actorData.type !== 'actor') return;

    const systemData = actorData.system;
    
    // Actors have career-spanning stats
    systemData.starPower.max = 10;
    systemData.experience.max = 5;
  }

  /**
   * Roll a stat
   * @param {String} statName The stat to roll
   * @param {Object} options Additional options
   */
  async rollStat(statName, options = {}) {
    const stat = this.system.stats[statName];
    if (!stat) return;

    const roll = new Roll("2d6 + @mod", { mod: stat.value });
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

    // Check if this is a highlighted stat for ticks
    let gainTick = false;
    if (this.system.highlightedStats?.includes(statName) && result.total >= 10) {
      gainTick = true;
      this.addTick();
    }

    // Create chat message
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this }),
      roll: result,
      content: await renderTemplate("systems/action-movie-world/templates/chat/roll-result.hbs", {
        actor: this,
        stat: statName,
        statLabel: game.i18n.localize(`AMW.Stat${statName.capitalize()}`),
        result: result.total,
        resultType: resultType,
        resultLabel: resultLabel,
        gainTick: gainTick,
        formula: roll.formula,
        tooltip: await result.getTooltip()
      })
    };

    ChatMessage.create(chatData);
    return result;
  }

  /**
   * Add a tick to star power
   */
  async addTick() {
    const currentTicks = this.system.starPower.ticks || 0;
    const newTicks = currentTicks + 1;
    
    await this.update({
      "system.starPower.ticks": newTicks
    });

    ui.notifications.info(game.i18n.format("AMW.TickGained", {
      actor: this.name,
      ticks: newTicks
    }));
  }

  /**
   * Take harm
   * @param {Number} amount Amount of harm to take
   */
  async takeHarm(amount) {
    const currentHarm = this.system.harm.value || 0;
    const newHarm = Math.min(currentHarm + amount, this.system.harm.max);
    
    await this.update({
      "system.harm.value": newHarm
    });

    // Check for special conditions at 5 harm
    if (newHarm >= 5) {
      this._handleMaxHarm();
    }
  }

  /**
   * Handle reaching maximum harm
   */
  _handleMaxHarm() {
    const isLead = this.system.role === "lead";
    
    if (isLead) {
      // Lead loses all ticks but doesn't die
      this.update({
        "system.starPower.ticks": 0
      });
      ui.notifications.warn(game.i18n.format("AMW.LeadMaxHarm", {
        actor: this.name
      }));
    } else {
      // Supporting character can die
      ui.notifications.warn(game.i18n.format("AMW.SupportingMaxHarm", {
        actor: this.name
      }));
    }
  }

  /**
   * Add experience points
   * @param {Number} amount XP to add
   */
  async addXP(amount = 1) {
    const currentXP = this.system.experience.value || 0;
    const newXP = currentXP + amount;
    
    await this.update({
      "system.experience.value": newXP
    });

    // Check for advancement
    if (newXP >= 5) {
      ui.notifications.info(game.i18n.format("AMW.AdvancementReady", {
        actor: this.name
      }));
    }
  }

  /**
   * Override getRollData to provide data for roll formulas
   */
  getRollData() {
    const data = { ...super.getRollData() };
    
    // Copy stats for easy access in formulas
    if (this.system.stats) {
      for (let [k, v] of Object.entries(this.system.stats)) {
        data[k] = v.value;
      }
    }

    return data;
  }
}
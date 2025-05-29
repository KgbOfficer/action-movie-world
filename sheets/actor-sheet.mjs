export class AMWActorSheet extends ActorSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["amw", "sheet", "actor"],
      width: 720,
      height: 680,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "stats" }]
    });
  }

  /** @override */
  get template() {
    return `systems/action-movie-world/templates/actor/actor-${this.actor.type}-sheet.hbs`;
  }

  /** @override */
  async getData() {
    const context = super.getData();
    const actorData = this.actor.toObject(false);
    
    context.system = actorData.system;
    context.flags = actorData.flags;
    context.config = CONFIG.AMW;

    // Add roll data for TinyMCE editors
    context.rollData = this.actor.getRollData();

    // Prepare character-specific data
    if (actorData.type === 'character') {
      this._prepareCharacterData(context);
    }

    // Prepare actor-specific data  
    if (actorData.type === 'actor') {
      this._prepareActorData(context);
    }

    // Prepare items
    this._prepareItems(context);

    return context;
  }

  /**
   * Prepare character-specific sheet data
   */
  _prepareCharacterData(context) {
    // Calculate harm levels with descriptions
    context.harmLevels = [];
    for (let i = 0; i <= 5; i++) {
      context.harmLevels.push({
        value: i,
        label: CONFIG.AMW.harmLevels[i],
        active: i <= (context.system.harm.value || 0)
      });
    }

    // Prepare stat blocks with proper highlighting
    context.stats = {};
    const highlightedStats = [
      context.system.highlighted?.primary,
      context.system.highlighted?.secondary
    ].filter(s => s);
    
    for (let [key, stat] of Object.entries(context.system.stats || {})) {
      context.stats[key] = {
        ...stat,
        key: key,
        label: CONFIG.AMW.stats[key],
        highlighted: highlightedStats.includes(key),
        modifier: stat.value >= 0 ? `+${stat.value}` : `${stat.value}`
      };
    }

    // Star power ticks
    context.starPowerTicks = [];
    const maxTicks = context.system.starPower.max || 5;
    const currentTicks = context.system.starPower.ticks || 0;
    for (let i = 1; i <= maxTicks; i++) {
      context.starPowerTicks.push({
        active: i <= currentTicks,
        number: i
      });
    }

    // Experience points visualization
    context.experiencePoints = [];
    const maxXP = 5;
    const currentXP = context.system.experience.value || 0;
    for (let i = 1; i <= maxXP; i++) {
      context.experiencePoints.push({
        active: i <= currentXP,
        number: i
      });
    }
  }

  /**
   * Prepare actor-specific sheet data
   */
  _prepareActorData(context) {
    // Actor career data
    context.playbook = CONFIG.AMW.playbooks[context.system.playbook] || "Unknown";
    
    // Experience tracking
    context.experiencePoints = [];
    const maxXP = 5;
    const currentXP = context.system.experience.value || 0;
    for (let i = 1; i <= maxXP; i++) {
      context.experiencePoints.push({
        active: i <= currentXP,
        number: i
      });
    }
  }

  /**
   * Organize and classify items for the sheet
   */
  _prepareItems(context) {
    const moves = [];
    const gear = [];
    const scripts = [];

    // Iterate through items, classifying them
    for (let i of context.items) {
      i.img = i.img || Item.DEFAULT_ICON;
      
      if (i.type === 'move') {
        moves.push(i);
      } else if (i.type === 'gear') {
        gear.push(i);
      } else if (i.type === 'script') {
        scripts.push(i);
      }
    }

    // Organize moves by type
    context.basicMoves = moves.filter(m => m.system.moveType === 'basic');
    context.playbookMoves = moves.filter(m => m.system.moveType === 'playbook');
    context.scriptMoves = moves.filter(m => m.system.moveType === 'script');

    // Organize gear by type
    context.weapons = gear.filter(g => g.system.gearType === 'weapon');
    context.armor = gear.filter(g => g.system.gearType === 'armor');
    context.equipment = gear.filter(g => !['weapon', 'armor'].includes(g.system.gearType));

    context.scripts = scripts;
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.sheet.render(true);
    });

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      const item = this.actor.items.get(li.data("itemId"));
      item.delete();
      li.slideUp(200, () => this.render(false));
    });

    // Rollable abilities
    html.find('.rollable').click(this._onRoll.bind(this));

    // Stat rolling
    html.find('.stat-roll').click(this._onStatRoll.bind(this));

    // Move rolling
    html.find('.move-roll').click(this._onMoveRoll.bind(this));

    // Gear usage
    html.find('.gear-use').click(this._onGearUse.bind(this));

    // Harm modification
    html.find('.harm-control').click(this._onHarmControl.bind(this));

    // Star Power tick modification
    html.find('.tick-control').click(this._onTickControl.bind(this));

    // Experience modification
    html.find('.xp-control').click(this._onXPControl.bind(this));

    // Drag events for macros
    if (this.actor.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    const type = header.dataset.type;
    const data = duplicate(header.dataset);
    const name = `New ${type.capitalize()}`;
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    delete itemData.system["type"];
    return await Item.create(itemData, {parent: this.actor});
  }

  /**
   * Handle clickable rolls
   */
  _onRoll(event) {
    event.preventDefault();
    const element = event.currentTarget;
    const dataset = element.dataset;

    // Handle item rolls
    if (dataset.rollType) {
      if (dataset.rollType == 'item') {
        const itemId = element.closest('.item').dataset.itemId;
        const item = this.actor.items.get(itemId);
        if (item) return item.roll();
      }
    }

    // Handle rolls that supply the formula directly
    if (dataset.roll) {
      let label = dataset.label ? `[roll] ${dataset.label}` : '';
      let roll = new Roll(dataset.roll, this.actor.getRollData());
      roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: label,
        rollMode: game.settings.get('core', 'rollMode'),
      });
      return roll;
    }
  }

  /**
   * Handle stat rolls
   */
  async _onStatRoll(event) {
    event.preventDefault();
    const stat = event.currentTarget.dataset.stat;
    return this.actor.rollStat(stat);
  }

  /**
   * Handle move rolls
   */
  async _onMoveRoll(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) return item.roll();
  }

  /**
   * Handle gear usage
   */
  async _onGearUse(event) {
    event.preventDefault();
    const itemId = event.currentTarget.closest('.item').dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) return item.use();
  }

  /**
   * Handle harm control buttons
   */
  async _onHarmControl(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const currentHarm = this.actor.system.harm.value || 0;
    
    let newHarm = currentHarm;
    if (action === 'increase' && currentHarm < 5) {
      newHarm = currentHarm + 1;
    } else if (action === 'decrease' && currentHarm > 0) {
      newHarm = currentHarm - 1;
    }

    if (newHarm !== currentHarm) {
      await this.actor.update({"system.harm.value": newHarm});
    }
  }

  /**
   * Handle star power tick controls
   */
  async _onTickControl(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const currentTicks = this.actor.system.starPower.ticks || 0;
    const maxTicks = this.actor.system.starPower.max || 5;
    
    let newTicks = currentTicks;
    if (action === 'increase' && currentTicks < maxTicks) {
      newTicks = currentTicks + 1;
    } else if (action === 'decrease' && currentTicks > 0) {
      newTicks = currentTicks - 1;
    }

    if (newTicks !== currentTicks) {
      await this.actor.update({"system.starPower.ticks": newTicks});
    }
  }

  /**
   * Handle experience point controls
   */
  async _onXPControl(event) {
    event.preventDefault();
    const action = event.currentTarget.dataset.action;
    const currentXP = this.actor.system.experience.value || 0;
    
    let newXP = currentXP;
    if (action === 'increase') {
      newXP = currentXP + 1;
    } else if (action === 'decrease' && currentXP > 0) {
      newXP = currentXP - 1;
    }

    if (newXP !== currentXP) {
      await this.actor.update({"system.experience.value": newXP});
      
      // Check for advancement
      if (newXP >= 5) {
        ui.notifications.info(game.i18n.format("AMW.AdvancementReady", {
          actor: this.actor.name
        }));
      }
    }
  }
}
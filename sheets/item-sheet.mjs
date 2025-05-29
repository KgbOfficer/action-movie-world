export class AMWItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["amw", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/action-movie-world/templates/item";
    return `${path}/item-${this.item.type}-sheet.hbs`;
  }

  /** @override */
  async getData() {
    const context = super.getData();
    const itemData = this.item.toObject(false);
    
    context.system = itemData.system;
    context.flags = itemData.flags;
    context.config = CONFIG.AMW;

    // Add roll data for TinyMCE editors
    context.rollData = this.item.getRollData?.() || {};

    // Prepare type-specific data
    if (itemData.type === 'move') {
      this._prepareMoveData(context);
    } else if (itemData.type === 'gear') {
      this._prepareGearData(context);
    } else if (itemData.type === 'script') {
      this._prepareScriptData(context);
    }

    return context;
  }

  /**
   * Prepare move-specific sheet data
   */
  _prepareMoveData(context) {
    // Stats dropdown
    context.statOptions = {};
    for (let [key, label] of Object.entries(CONFIG.AMW.stats)) {
      context.statOptions[key] = label;
    }

    // Move type options
    context.moveTypeOptions = CONFIG.AMW.moveTypes;

    // If this is a basic move, mark it as such
    context.isBasicMove = CONFIG.AMW.basicMoves.includes(
      context.item.name.toLowerCase().replace(/\s+/g, '-')
    );
  }

  /**
   * Prepare gear-specific sheet data
   */
  _prepareGearData(context) {
    // Parse qualities for display
    if (context.system.qualities) {
      context.qualitiesList = context.system.qualities
        .split(',')
        .map(q => q.trim())
        .filter(q => q.length > 0);
    } else {
      context.qualitiesList = [];
    }

    // Available qualities for selection
    context.availableQualities = CONFIG.AMW.gearQualities;

    // Gear type options
    context.gearTypes = {
      "weapon": "AMW.GearTypeWeapon",
      "armor": "AMW.GearTypeArmor", 
      "equipment": "AMW.GearTypeEquipment",
      "vehicle": "AMW.GearTypeVehicle"
    };

    // Range options
    context.rangeOptions = {
      "intimate": "AMW.RangeIntimate",
      "hand": "AMW.RangeHand",
      "close": "AMW.RangeClose",
      "far": "AMW.RangeFar",
      "close/far": "AMW.RangeCloseFar"
    };
  }

  /**
   * Prepare script-specific sheet data
   */
  _prepareScriptData(context) {
    // Available script types
    context.scriptTypes = CONFIG.AMW.scripts;

    // Parse moves list
    if (context.system.moves && typeof context.system.moves === 'string') {
      context.movesList = context.system.moves
        .split('\n')
        .map(m => m.trim())
        .filter(m => m.length > 0);
    } else {
      context.movesList = context.system.moves || [];
    }

    // Parse gear list
    if (context.system.gear && typeof context.system.gear === 'string') {
      context.gearList = context.system.gear
        .split('\n')
        .map(g => g.trim())
        .filter(g => g.length > 0);
    } else {
      context.gearList = context.system.gear || [];
    }

    // Parse relationships list
    if (context.system.relationships && typeof context.system.relationships === 'string') {
      context.relationshipsList = context.system.relationships
        .split('\n')
        .map(r => r.trim())
        .filter(r => r.length > 0);
    } else {
      context.relationshipsList = context.system.relationships || [];
    }
  }

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Roll buttons
    html.find('.item-roll').click(this._onRoll.bind(this));

    // Quality management for gear
    html.find('.quality-add').click(this._onQualityAdd.bind(this));
    html.find('.quality-remove').click(this._onQualityRemove.bind(this));

    // Move/gear/relationship list management for scripts
    html.find('.list-add').click(this._onListAdd.bind(this));
    html.find('.list-remove').click(this._onListRemove.bind(this));
  }

  /**
   * Handle rolling the item
   */
  async _onRoll(event) {
    event.preventDefault();
    return this.item.roll();
  }

  /**
   * Handle adding a quality to gear
   */
  async _onQualityAdd(event) {
    event.preventDefault();
    const select = event.currentTarget.parentElement.querySelector('select');
    const quality = select.value;
    
    if (!quality) return;

    const currentQualities = this.item.system.qualities || "";
    const qualitiesList = currentQualities
      .split(',')
      .map(q => q.trim())
      .filter(q => q.length > 0);

    if (!qualitiesList.includes(quality)) {
      qualitiesList.push(quality);
      await this.item.update({
        "system.qualities": qualitiesList.join(', ')
      });
    }

    select.value = "";
  }

  /**
   * Handle removing a quality from gear
   */
  async _onQualityRemove(event) {
    event.preventDefault();
    const quality = event.currentTarget.dataset.quality;
    
    const currentQualities = this.item.system.qualities || "";
    const qualitiesList = currentQualities
      .split(',')
      .map(q => q.trim())
      .filter(q => q.length > 0 && q !== quality);

    await this.item.update({
      "system.qualities": qualitiesList.join(', ')
    });
  }

  /**
   * Handle adding items to script lists
   */
  async _onListAdd(event) {
    event.preventDefault();
    const listType = event.currentTarget.dataset.list;
    const input = event.currentTarget.parentElement.querySelector('input');
    const value = input.value.trim();
    
    if (!value) return;

    const currentList = this.item.system[listType] || [];
    const newList = Array.isArray(currentList) ? [...currentList] : 
                   currentList.split('\n').map(i => i.trim()).filter(i => i.length > 0);
    
    if (!newList.includes(value)) {
      newList.push(value);
      await this.item.update({
        [`system.${listType}`]: newList
      });
    }

    input.value = "";
  }

  /**
   * Handle removing items from script lists
   */
  async _onListRemove(event) {
    event.preventDefault();
    const listType = event.currentTarget.dataset.list;
    const value = event.currentTarget.dataset.value;
    
    const currentList = this.item.system[listType] || [];
    const newList = Array.isArray(currentList) ? [...currentList] : 
                   currentList.split('\n').map(i => i.trim()).filter(i => i.length > 0);
    
    const filteredList = newList.filter(item => item !== value);
    
    await this.item.update({
      [`system.${listType}`]: filteredList
    });
  }
}
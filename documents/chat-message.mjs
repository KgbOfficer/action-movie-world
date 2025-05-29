export class AMWChatMessage extends ChatMessage {

  /**
   * Handle click events on roll buttons in chat messages
   */
  static async _onRollClick(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const action = button.dataset.action;
    const messageId = button.closest('.message').dataset.messageId;
    const message = game.messages.get(messageId);
    
    if (!message) return;

    const speaker = message.speaker;
    let actor;
    if (speaker.token) actor = game.actors.tokens[speaker.token];
    if (!actor) actor = game.actors.get(speaker.actor);
    
    if (!actor) {
      ui.notifications.warn(game.i18n.localize("AMW.MacroNoActorSelected"));
      return;
    }

    switch (action) {
      case 'stat-roll':
        const stat = button.dataset.stat;
        return actor.rollStat(stat);
        
      case 'move-roll':
        const moveName = button.dataset.move;
        const move = actor.items.find(i => i.name === moveName);
        if (move) return move.roll();
        break;
        
      case 'damage-roll':
        const damage = button.dataset.damage;
        return this._rollDamage(actor, damage);
        
      case 'camaraderie-choice':
        const choice = button.dataset.choice;
        return this._handleCamaraderieChoice(actor, choice);
    }
  }

  /**
   * Roll damage from a chat button
   */
  static async _rollDamage(actor, damageFormula) {
    const roll = new Roll(damageFormula, actor.getRollData());
    const result = await roll.evaluate();
    
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      roll: result,
      content: await renderTemplate("systems/action-movie-world/templates/chat/damage-result.hbs", {
        actor: actor,
        damage: result.total,
        formula: roll.formula,
        tooltip: await result.getTooltip()
      })
    };

    return ChatMessage.create(chatData);
  }

  /**
   * Handle camaraderie move choices
   */
  static async _handleCamaraderieChoice(actor, choice) {
    let content = "";
    
    switch (choice) {
      case 'heal':
        if (actor.system.harm.value > 0) {
          await actor.update({
            "system.harm.value": Math.max(0, actor.system.harm.value - 1)
          });
          content = `${actor.name} heals one level of harm.`;
        } else {
          content = `${actor.name} is already unharmed.`;
        }
        break;
        
      case 'weapon':
        content = `${actor.name} finds an awesome new weapon for the duration of the movie!`;
        break;
        
      case 'harm-villain':
        content = `${actor.name} will do an extra level of harm to the film's Villain!`;
        break;
        
      case 'inspiration':
        content = `${actor.name} gets inspired by their friends. Hold one to make a future roll an automatic 10+!`;
        break;
        
      case 'insight':
        // Give all PCs XP and lower camaraderie
        const currentCamaraderie = game.settings.get("action-movie-world", "camaraderie") || 0;
        await game.settings.set("action-movie-world", "camaraderie", Math.max(currentCamaraderie - 3, -3));
        
        // Give XP to all PCs in scene
        const tokens = canvas.tokens.controlled;
        for (let token of tokens) {
          if (token.actor && token.actor.type === 'character') {
            await token.actor.addXP(1);
          }
        }
        
        content = `The characters gain a great insight into their friendship and themselves. All PCs gain 1 XP and Camaraderie is reduced by 3.`;
        break;
        
      case 'lower-camaraderie':
        const camaraderie = game.settings.get("action-movie-world", "camaraderie") || 0;
        await game.settings.set("action-movie-world", "camaraderie", Math.max(camaraderie - 1, -3));
        content = `Camaraderie is lowered by an additional 1.`;
        break;
        
      case 'fail-primary':
        content = `${actor.name} will automatically fail their next roll in their primary stat.`;
        break;
        
      case 'gm-move':
        content = `The GM makes an immediate move against one of ${actor.name}'s compatriots!`;
        break;
        
      case 'pc-fight':
        content = `A fight breaks out immediately between ${actor.name} and another PC!`;
        break;
    }

    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      content: `<div class="amw camaraderie-result">
        <h3>Camaraderie Result</h3>
        <p>${content}</p>
      </div>`
    };

    return ChatMessage.create(chatData);
  }

  /**
   * Create a chat message for a move result
   */
  static async createMoveMessage(actor, move, roll, resultType) {
    const chatData = {
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: actor }),
      roll: roll,
      content: await renderTemplate("systems/action-movie-world/templates/chat/move-result.hbs", {
        actor: actor,
        move: move,
        result: roll.total,
        resultType: resultType,
        tooltip: await roll.getTooltip()
      })
    };

    return ChatMessage.create(chatData);
  }
}
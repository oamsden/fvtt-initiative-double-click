class FurnaceCombatQoL {
    static renderCombatTracker(tracker, html, data) {
        if (game.user.role < parseInt(game.settings.get("initiative-double-click","player-access")) ) return;
        html.find(".token-initiative").off("dblclick").on("dblclick", FurnaceCombatQoL._onInitiativeDblClick)
        for (let combatant of html.find("#combat-tracker li.combatant")) {
            if (combatant.classList.contains("active"))
                break;
            combatant.classList.add("turn-done");
        }
    }
    static _onInitiativeDblClick(event) {
        event.stopPropagation();
        event.preventDefault();
        let html = $(event.target).closest(".combatant")
        let cid = html.data("combatant-id")
        let initiative = html.find(".token-initiative")
        let combatant = game.combat.combatants.get(cid)
        if (!combatant.isOwner) return;
        let input = $(`<input class="initiative" style="width: 80%" value="${combatant.initiative}"/>`)
        initiative.off("dblclick")
        initiative.empty().append(input)
        input.focus().select()
        input.on('change', ev => game.combat.combatants.get(cid).update({initiative: input.val()}))
        input.on('focusout', ev => game.combats.render())


    }
}

Hooks.on('renderCombatTracker', FurnaceCombatQoL.renderCombatTracker)
Hooks.once("init", () => {
    game.settings.register("initiative-double-click", "player-access", {
        name: game.i18n.localize("initiative-double-click.settings.player-access.name"),
        hint: game.i18n.localize("initiative-double-click.settings.player-access.hint"),
        scope: "world",
        config: true,
        type: String,
        default: "4",
        choices: {
          "0": "initiative-double-click.settings.player-access.roles.none",
          "1": "initiative-double-click.settings.player-access.roles.player",
          "2": "initiative-double-click.settings.player-access.roles.trusted",
          "3": "initiative-double-click.settings.player-access.roles.assistant",
          "4": "initiative-double-click.settings.player-access.roles.gamemaster"
        }
    });
});
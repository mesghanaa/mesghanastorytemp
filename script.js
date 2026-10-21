// Game Variables and Evidence State
let gameState = {
    has_office_key: false,
    evidence: {
        bottle: false,
        receipt: false,
        journal: false
    },
    sanity: 100,
    inventory: []
};

// Complete Story Scenes Architecture
const scenes = {
    "main_stage": {
        title: "Main Stage - Night of the Final Dress Rehearsal",
        character: "Assistant Stage Manager",
        text: "Opening night is only three days away, but fear hangs heavier than the velvet curtains. You are the Assistant Stage Manager. Over the past week, three dancers have suddenly collapsed during rehearsals, their deaths chalked up to severe heat exhaustion and sudden heart failure. But something isn't right. You decide to investigate the studio before the next rehearsal begins.",
        getChoices: () => {
            return [
                { text: "Head to the Dancer Changing Rooms.", nextScene: "changing_rooms" },
                { text: "Head downstairs to Prop & Costume Storage.", nextScene: "prop_storage" },
                { text: "Check the Backstage Bathrooms.", nextScene: "bathrooms" }
            ];
        }
    },
    "changing_rooms": {
        title: "Location 1: Dancer Changing Rooms",
        character: "Assistant Stage Manager",
        text: "Rows of lockers line the room, framed by glowing vanity mirrors and racks of costumes. The air smells heavily of floral hairspray and sweat. On the bench near Locker 14 sits a custom hydration bottle left behind by one of the lead dancers.",
        getChoices: () => {
            let options = [];
            if (!gameState.evidence.bottle) {
                options.push({ text: "[Inspect Object] Examine the hydration bottle on Locker 14.", action: "collect_bottle", nextScene: "changing_rooms" });
            }
            options.push({ text: "[Move] Walk over to the Sound & Lighting Booth.", nextScene: "sound_booth" });
            options.push({ text: "[Move] Go back out to the Main Stage.", nextScene: "main_stage" });
            return options;
        }
    },
    "prop_storage": {
        title: "Location 2: Prop & Costume Storage (Basement)",
        character: "Assistant Stage Manager",
        text: "The basement studio is cold, packed with wooden trunks, mannequin torsos, sewing machinery, and sharp performance props. Dusty industrial shelves line the back wall next to a trash bin filled with trashed invoices.",
        getChoices: () => {
            let options = [];
            if (!gameState.evidence.receipt) {
                options.push({ text: "[Inspect Object] Search the trash bin near the chemical shelf.", action: "collect_receipt", nextScene: "prop_storage" });
            }
            options.push({ text: "[Move] Go upstairs to the Balcony Observation Deck.", nextScene: "observation_deck" });
            options.push({ text: "[Move] Return to the Dancer Changing Rooms.", nextScene: "changing_rooms" });
            return options;
        }
    },
    "bathrooms": {
        title: "Location 3: Backstage Bathrooms",
        character: "Assistant Stage Manager",
        text: "Tiled walls reflect the faint hum of a buzzing fluorescent light bulb above the individual stalls. This is where the last victim was found right before the ambulance arrived. On the counter near the sink, a key sits tucked underneath a paper towel dispenser.",
        getChoices: () => {
            let options = [];
            if (!gameState.has_office_key) {
                options.push({ text: "[Inspect Object] Pick up the brass key.", action: "collect_key", nextScene: "bathrooms" });
            }
            options.push({ text: "[Move] Return to the Main Stage.", nextScene: "main_stage" });
            options.push({ text: "[Move] Go to Prop & Costume Storage.", nextScene: "prop_storage" });
            return options;
        }
    },
    "sound_booth": {
        title: "Location 4: Sound & Lighting Booth",
        character: "Assistant Stage Manager",
        text: "Positioned above the seating area, the sound board overlooks the entire stage floor. Microphones pick up distant footsteps echoing across the floorboards below. Rehearsal logs on the desk detail the Lead Choreographer's notes about each dancer's technique.",
        getChoices: () => {
            let options = [];
            if (!gameState.evidence.journal && !gameState.inventory.includes("Locked Journal")) {
                options.push({ text: "[Inspect Object] Read the rehearsal logbook.", action: "read_log", nextScene: "sound_booth" });
            }
            options.push({ text: "[Move] Head upstairs toward the Choreographer's Office.", action: "try_office" });
            options.push({ text: "[Move] Go down to the Dancer Changing Rooms.", nextScene: "changing_rooms" });
            return options;
        }
    },
    "observation_deck": {
        title: "Location 5: Balcony Observation Deck",
        character: "Assistant Stage Manager",
        text: "From up here, you can see the entire studio layout. The Lead Dancer is practicing her solos below under the harsh lights. She looks exhausted, reaching for her water bottle every few minutes.",
        getChoices: () => {
            return [
                { text: "[Talk] Warn the Lead Dancer about the water bottles.", action: "warn_dancer", nextScene: "observation_deck" },
                { text: "[Move] Head directly to the Choreographer's Office door.", action: "try_office" },
                { text: "[Move] Go down to the Sound & Lighting Booth.", nextScene: "sound_booth" }
            ];
        }
    },
    "choreographer_office_locked": {
        title: "Location 6: Choreographer's Office (Locked Room)",
        character: "Assistant Stage Manager",
        text: "You try to turn the doorknob to the Choreographer's Office. It is locked. A small brass keyhole stares back at you. You need to find the office key before you can enter.",
        getChoices: () => {
            return [
                { text: "Return to the Balcony Observation Deck.", nextScene: "observation_deck" },
                { text: "Return to the Backstage Bathrooms.", nextScene: "bathrooms" }
            ];
        }
    },
    "choreographer_office_unlocked": {
        title: "Location 6: Choreographer's Office",
        character: "Assistant Stage Manager",
        text: "You insert the key into the lock. It turns. You step into the dimly lit, luxurious office. Audition files, rehearsal schedules, and awards cover the desk. Locked inside the top drawer is a leather-bound notebook. Inside, names of deceased dancers are crossed out with red ink next to the word 'Flawed'.",
        getChoices: () => {
            return [
                { text: "[Confront] Walk down to the Main Stage to confront the Lead Choreographer.", action: "evaluate_ending" }
            ];
        }
    },
    "ending_true": {
        title: "Ending 1: Flawless Deduction (True Ending)",
        character: "Case Resolved",
        text: "You confront the Lead Choreographer center stage in front of the remaining dancers. You present the chemical receipt, the altered hydration bottle, and the journal detailing her victims. Overwhelmed by undeniable evidence, her composed facade shatters. 'They were ruining my masterpiece!' she screams as sirens wail outside. Police enter the stage and place her under arrest. You saved the lead dancer and stopped the killing spree.",
        getChoices: () => [{ text: "Play Again", action: "reset_game", nextScene: "main_stage" }]
    },
    "ending_bad": {
        title: "Ending 2: Premature Accusation (Bad Ending)",
        character: "Case Failed",
        text: "You accuse the Lead Choreographer on stage, but without sufficient proof, she dismisses your claims as slander. She fires you as Assistant Stage Manager on the spot and bans you from the building. Two nights later, news broke that opening night was canceled after another tragic 'accident' during the final performance.",
        getChoices: () => [{ text: "Play Again", action: "reset_game", nextScene: "main_stage" }]
    }
};

// UI Rendering Engine
function updateScene(sceneKey) {
    const currentScene = scenes[sceneKey];
    
    document.getElementById("message-display").innerText = "";
    document.getElementById("location-title").innerText = currentScene.title;
    document.getElementById("character-title").innerText = currentScene.character;
    document.getElementById("story-text").innerText = currentScene.text;

    const choicesContainer = document.getElementById("choices-container");
    choicesContainer.innerHTML = "";

    const activeChoices = currentScene.getChoices();
    activeChoices.forEach(choice => {
        const button = document.createElement("button");
        button.innerText = choice.text;
        button.addEventListener("click", function() {
            if (choice.action) {
                executeAction(choice.action);
            }
            if (choice.nextScene) {
                updateScene(choice.nextScene);
            }
        });
        choicesContainer.appendChild(button);
    });
}

// Global Core Action Processing Module
function executeAction(actionName) {
    if (actionName === "collect_bottle") {
        gameState.evidence.bottle = true;
        gameState.inventory.push("Poisoned Hydration Bottle");
        gameState.sanity -= 15;
        document.getElementById("message-display").innerText = "Result: You unscrew the lid. An acrid, chemical stench hits your nose. It's odorless industrial cleaner mixed into the electrolyte drink. (COLLECTED: Poisoned Hydration Bottle)";
    } 
    else if (actionName === "collect_receipt") {
        gameState.evidence.receipt = true;
        gameState.inventory.push("Toxic Chemical Receipt");
        gameState.sanity -= 10;
    document.getElementById("message-display").innerText = "Result: You find a receipt from a local industrial supplier for concentrated, tasteless cardiac-blocking cleaner, signed in quick handwriting. (COLLECTED: Toxic Chemical Receipt)";
}
else if (actionName === "collect_key") {
gameState.has_office_key = true;
gameState.inventory.push("L.C. Office Key");
document.getElementById("message-display").innerText = "Result: You pick up the heavy key stamped with the initials 'L.C.' (has_office_key = True)";
}
else if (actionName === "read_log") {
gameState.sanity -= 5;
document.getElementById("message-display").innerText = "Result: 'Dancer #2: Slightly off-beat. Needs immediate replacement.'";
}
else if (actionName === "warn_dancer") {
document.getElementById("message-display").innerText = "Result: You warn the Lead Dancer about the water bottles. She looks confused but nods carefully.";
}
else if (actionName === "try_office") {
if (gameState.has_office_key) {
gameState.evidence.journal = true;
if (!gameState.inventory.includes("Locked Journal")) {
gameState.inventory.push("Locked Journal");
}
updateScene("choreographer_office_unlocked");
} else {
updateScene("choreographer_office_locked");
}
}
else if (actionName === "evaluate_ending") {
if (gameState.evidence.bottle && gameState.evidence.receipt && gameState.evidence.journal) {
updateScene("ending_true");
} else {
updateScene("ending_bad");
}
}
else if (actionName === "reset_game") {
gameState.has_office_key = false;
gameState.evidence.bottle = false;
gameState.evidence.receipt = false;
gameState.evidence.journal = false;
gameState.sanity = 100;
gameState.inventory = [];
}
updateUI();
}
// Interface Display Sync Unit
function updateUI() {
if (gameState.sanity < 0) gameState.sanity = 0;
document.getElementById("sanity-display").innerText = gameState.sanity;
const invPanel = document.getElementById("inventory-display");
invPanel.innerText = gameState.inventory.length > 0 ? gameState.inventory.join(", ") : "None";
}
// Program Entry Point
window.onload = function() {
updateScene("main_stage");
};

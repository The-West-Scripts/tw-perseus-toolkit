// ==UserScript==
// @name        The West Perseus Toolkit Extended
// @author      Mr. Perseus
// @namespace   tw-perseus
// @description Useful tools for The West.
// @include     https://*.the-west.*/game.php*
// @include     http://*.the-west.*/game.php*
// @include     https://*.tw.innogames.*/game.php*
// @include     http://*.tw.innogames.*/game.php*
// @version     0.3.0
// @grant       none
// ==/UserScript==

/*globals $*/
(function (fn) {
    const script = document.createElement("script");
    script.setAttribute("type", "application/javascript");
    script.textContent = `(${fn})();`;
    document.body.appendChild(script);
    document.body.removeChild(script);
}(() => {
    $(document).ready(() => {
        const TWPT = {
            base64: {
                menuImage: "url('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QCMRXhpZgAATU0AKgAAAAgABQESAAMAAAABAAEAAAEaAAUAAAABAAAASgEbAAUAAAABAAAAUgEoAAMAAAABAAIAAIdpAAQAAAABAAAAWgAAAAAAAABIAAAAAQAAAEgAAAABAAOgAQADAAAAAQABAACgAgAEAAAAAQAAABmgAwAEAAAAAQAAABkAAAAA/+0AOFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAAAOEJJTQQlAAAAAAAQ1B2M2Y8AsgTpgAmY7PhCfv/AABEIABkAGQMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2dri4+Tl5ufo6ery8/T19vf4+fr/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/3QAEAAL/2gAMAwEAAhEDEQA/APHLTT9Z1bU7101HUApunA2t8qgHp0rqbXwHq0ttuOo6kGI67zXpX7PEA1bw5rGmGCF3S6llRmAGMOSQTjjI5r0iNLRtEvpBEgCNEA2QNoO7+eBXwmPzDFqs4wdld213sfQUIUlH3o3/AOCfJHjfw54i8PKsrajqSLhHG9iMgkeorpvt93/z9Tf9917h+0FdaMPAWvQ3yJNeyWkK2I8v5rVgvLFv4geDtFeBbx6frXuZZiJ1qT53do4qyXNeKsf/0PP/AIdePv8AhHW1TTGvmtop7lvMHK5AbPb612yfEjRfIZBfwFWxkZPOOmRXmV1/rR9Kb2r5fE5LSxE/aOTR7VLHSpR5eVMu/E74gx6zaPZ28jTGQqhbDEkZ6fhUGW/55tUEf+tH1FSV3YXDQwkOSBz1q0q0rs//2Q==')",
            },
            version: "0.3.0",
            settingsKey: "TWPT_preferences",
            defaultPreferences: {
                JobHighlighter: true,
                CinemaSkipButton: true,
                ZoomMap: true,
                DisablePremiumNotifications: true,
                NineTimesFifteenButton: true,
                // MoreFifteenSec: true,
                DuelClothCalc: true,
            },
            preferences: {},
            currentZoom: 1,
            serverUrl: window.location.hostname.split(/[.0-9]+/)[0],
        };

        TWPT.Updater = {
            init () {
                setTimeout(TWPT.Updater.load, 5000);
            },

            load () {
                $.getScript("https://rawcdn.githack.com/mr-perseus/tw-js-library/master/script-updater.js", () => {
                    if (scriptUpdater.TWPTExt > TWPT.version) {
                        const updateMessage = new west.gui.Dialog(
                            "Update: The West Perseus Toolkit",
                            `<span>Update Available<br><br><b>v${scriptUpdater.TWPTExt}:</b><br>${scriptUpdater.TWPTExtNew
                                }</span>`, west.gui.Dialog.SYS_WARNING
                        ).addButton("Update", () => {
                            updateMessage.hide();
                            location.href = "https://greasyfork.org/scripts/371618-the-west-perseus-toolkit-extended/code/The%20West%20Perseus%20Toolkit%20Extended.user.js";
                        }).addButton("cancel").show();
                    }
                });
            },
        };

        TWPT.Settings = {
            init () {
                const storage = JSON.parse(localStorage.getItem(TWPT.settingsKey));
                TWPT.preferences = storage ? storage : TWPT.defaultPreferences;

                const div = $("<div class=\"ui_menucontainer\" />");
                const link = $("<div id=\"TWPT_Menu\" class=\"menulink\" title=\"The West Perseus Toolkit\" />")
                    .css("background-image", TWPT.base64.menuImage)
                    .css("background-position", "0px 0px")
                    .mouseenter(function () {
                        $(this).css("background-position", "-2px 0px");
                    })
                    .mouseleave(function () {
                        $(this).css("background-position", "0px 0px");
                    });

                $(link).on("click", () => {
                    TWPT.Settings.refreshMenu();
                });

                $("#ui_menubar").append((div).append(link).append("<div class=\"menucontainer_bottom\" />"));
            },

            refreshMenu () {
                const win = wman.open("TWPTSettings", "TWPT Settings", "noreload").setMaxSize(1268, 838).setMiniTitle("TWPT Settings");
                const scrollPane = new west.gui.Scrollpane();

                const setTitle = function (name) {
                    scrollPane.appendContent(`<p><span style="font-size: 130%; font-weight: bold; font-style: italic; display: inline-block; margin-top: 20px;">${
                        name}</span></p>`);
                };

                const setCheckBox = function (prefName, text) {
                    const checkbox = new west.gui.Checkbox(text);
                    checkbox.setId(`TWPT_${prefName}`);
                    if (TWPT.preferences[prefName]) {
                        checkbox.toggle();
                    }
                    checkbox.setCallback(() => {
                        TWPT.preferences[prefName] = checkbox.isSelected();
                        localStorage.setItem(TWPT.settingsKey, JSON.stringify(TWPT.preferences));
                        TWPT.Settings.refreshMenu();
                        new UserMessage("Okay. Please refresh your page.", "success").show();
                    });
                    scrollPane.appendContent(checkbox.getMainDiv());
                };

                setTitle("Enabled Features");
                setCheckBox("JobHighlighter", "Enable Silver / Gold job highlighter (doesn't search for them on it's own).");
                setCheckBox("CinemaSkipButton", "Enable the Cinema Skip button (allows to skip cinema videos after 5 seconds).");
                setCheckBox("ZoomMap", "Enable the Zoom feature (hover the minimap icon on the top right and scroll up / down to zoom out / in).");
                setCheckBox("DisablePremiumNotifications", "Suppress energy refill and automation premium notifications.");
                setCheckBox("NineTimesFifteenButton", "Add a button to job windows which allows you to start 9x 15 second jobs at once.");

                setTitle("Perseus Toolkit Extended");
                // setCheckBox("MoreFifteenSec", "Adds buttons to jobs which allow you to start a job 25 / 50 / unlimited times.");
                setCheckBox("DuelClothCalc", "Enable duel cloth calc (hover a persons profile picture to calculate duel values). WARNING: this overwrites bounties!");

                setTitle("Feedback");
                scrollPane.appendContent("<ul style=\"margin-left:15px;line-height:18px;\">" +
                    "<li>Send a message to <a target=\"_blank\" href=\"https://www.the-west.de/?ref=west_invite_linkrl&player_id=83071&world_id=1&hash=0dc5\">Mr. Perseus on world DE1</a></li>" +
                    "<li>Contact me on <a target=\"_blank\" href=\"https://greasyfork.org/forum/messages/add/Mr. Perseus\">Greasy Fork</a></li>" +
                    "<li>Send me a message on the <a target=\"_blank\" href=\"https://forum.beta.the-west.net/index.php?conversations/add&to=Mr.%20Perseus\">The West Beta Forum</a> or the <a target=\"_blank\" href=\"https://forum.the-west.de/index.php?conversations/add&to=Mr.%20Perseus\">German The West Forum</a></li>" +
                    "</ul><br />Check out other scripts on <a target=\"_blank\" href=\"https://greasyfork.org/de/users/179973-mr-perseus\">Greasyfork</a>.");

                win.appendToContentPane(scrollPane.getMainDiv());
            },
        };

        TWPT.JobHighlighter = {
            init () {
                $("head").append("<style type=\"text/css\">" +
                    ".jobgroup.silver {background-color: rgba(192, 192, 192, .7); border-radius: 10%; } " +
                    ".jobgroup.gold {background-color: rgba(255, 215, 0, .7); border-radius: 10%; }" +
                    "</style>");

                // eslint-disable-next-line camelcase
                Map.Component.JobGroup.prototype.backup_getAdditionalClasses = Map.Component.JobGroup.prototype.getAdditionalClasses;
                Map.Component.JobGroup.prototype.getAdditionalClasses = function (tileX, tileY) {
                    const backupClasses = Map.Component.JobGroup.prototype.backup_getAdditionalClasses.apply(this, arguments);
                    const featuredJobs = Map.JobHandler.Featured[`${this.getLeft(tileX)}-${this.getTop(tileY)}`] || {};

                    for (const property in featuredJobs) {
                        if (featuredJobs.hasOwnProperty(property)) {
                            if (featuredJobs[property]["gold"]) {
                                return `${backupClasses} gold`;
                            }
                            if (featuredJobs[property]["silver"]) {
                                return `${backupClasses} silver`;
                            }
                        }
                    }

                    return backupClasses;
                };
            },
        };

        TWPT.CinemaSkipButton = {
            init () {
                const button = new west.gui.Button("Skip ad", () => {
                    CinemaWindow.controller("rewards");
                });

                // eslint-disable-next-line camelcase
                CinemaWindow.backup_cotroller = CinemaWindow.controller;
                CinemaWindow.controller = function (key) {
                    button.setVisible(false);
                    button.disable();

                    // Uncomment the following line if you want to access rewards directly.
                    // if (key === "video") return CinemaWindow.backup_cotroller("rewards");


                    if (key === "video") {
                        let count = 5;
                        const countDown = () => {
                            if (count > 0) {
                                button.setCaption(`Skip ad (${count})`);
                                setTimeout(countDown, 1000);
                                count--;
                            } else {
                                button.setCaption("Skip ad");
                                button.enable();
                            }
                        };
                        button.setVisible(true);
                        countDown();
                    }

                    // If there is no ad available you should be able to get the rewards.
                    if (key === "noVideo") {
                        return CinemaWindow.backup_cotroller("rewards");
                    }

                    return CinemaWindow.backup_cotroller(key);
                };

                // eslint-disable-next-line camelcase
                CinemaWindow.backup_open = CinemaWindow.open;
                CinemaWindow.open = function (townId) {
                    CinemaWindow.backup_open(townId);
                    const header = $(this.window.divMain).find(".tw2gui_inner_window_title");
                    button.divMain.setAttribute("style", "margin-left: 20px; margin-top: -20px");
                    button.setVisible(false);
                    header.append(button.getMainDiv());
                };
            },
        };

        TWPT.ZoomMap = {
            init () {
                $(window).bind("mousewheel", (event) => {
                    if ($("#ui_minimap").is(":hover")) {
                        if (event.originalEvent.wheelDelta >= 0) {
                            if (TWPT.currentZoom < 1.95) TWPT.currentZoom += 0.1;
                        } else {
                            if (TWPT.currentZoom > 0.75) TWPT.currentZoom -= 0.1;
                        }

                        document.getElementById("map").style.zoom = TWPT.currentZoom;
                    }
                });
            },
        };

        TWPT.DisablePremiumNotifications = {
            init () {
                Premium.checkForEnergyPremium = function (callback, failCallback) {
                    if (typeof failCallback !== "undefined") return failCallback();
                };
                Premium.checkForAutomationPremium = function (callback, failCallback) {
                    if (typeof failCallback !== "undefined") return failCallback();
                };
            },
        };

        TWPT.NineTimesFifteenButton = {
            init () {
                // eslint-disable-next-line camelcase
                JobWindow.backup_initView = JobWindow.initView;
                JobWindow.initView = function () {
                    JobWindow.backup_initView.apply(this, arguments);
                    const button = new west.gui.Button("9x 15s", () => {
                        button.disable();
                        const jobAmountNum = this.window.divMain.getElementsByClassName("job-amount-num")[0];
                        const numberBefore = jobAmountNum.innerHTML;
                        jobAmountNum.innerHTML = "9";
                        $(".job_durationbar.job_durationbar_short").click();
                        setTimeout(() => {
                            button.enable();
                            jobAmountNum.innerHTML = numberBefore;
                        }, 5000);
                    });

                    const buttonDiv = button.getMainDiv();
                    buttonDiv.style["z-index"] = "5";
                    buttonDiv.style.bottom = "25px";
                    buttonDiv.style.left = "300px";
                    this.window.divMain.querySelector("div.tw2gui_window_content_pane").appendChild(button.getMainDiv());
                };
            },
        };

        TWPT.MoreFifteenSec = {
            init () {
                // eslint-disable-next-line camelcase
                JobWindow.backup_initView = JobWindow.initView;
                JobWindow.initView = function () {
                    JobWindow.backup_initView.apply(this, arguments);
                    let doJobs = false;
                    const button25 = new west.gui.Button("Start 25");
                    const button50 = new west.gui.Button("Start 50");
                    const button150 = new west.gui.Button("Start 150");

                    const repeatJobXTimes = (amount, button) => {
                        const clickJobFourTimes = () => {
                            let smallCounter = 4;
                            const clickJobOnce = () => {
                                $(".job_durationbar.job_durationbar_short").click();
                                smallCounter--;
                                if (smallCounter >= 1) {
                                    setTimeout(clickJobOnce, (Math.random() * 1000) + 200);
                                }
                            };
                            clickJobOnce();
                        };

                        let bigCounter = amount;
                        const repeatJob = () => {
                            console.log("new iteration::", bigCounter, Character.energy, button.caption.text, doJobs);
                            clickJobFourTimes();
                            bigCounter = bigCounter - 4;
                            if (bigCounter >= 1 && Character.energy > 0 && doJobs/*whichButton.caption.text.startsWith("Stop")*/) {
                                button.setCaption(`Stop ${bigCounter}`);
                                setTimeout(repeatJob, (Math.random() * 30000) + 55000);
                            }
                        };

                        repeatJob();
                    };

                    const buttonOnClick = (amount, button) => {
                        console.log("start...", button.caption.text);
                        if (button.caption.text === `Start ${amount}`) {
                            console.log("this", this);
                            doJobs = true;
                            button25.disable();
                            button50.disable();
                            button150.disable();
                            button.enable();
                            button.setCaption(`Stop ${amount}`);
                            repeatJobXTimes(amount, button);
                        } else {
                            button.setCaption(`Start ${amount}`);
                            button25.enable();
                            button50.enable();
                            button150.enable();
                            doJobs = false;
                        }
                    };

                    const styleAndAppendDiv = (button, bottom, left) => {
                        const buttonDiv = button.getMainDiv();
                        buttonDiv.style["z-index"] = "5";
                        buttonDiv.style.bottom = bottom;
                        buttonDiv.style.left = left;
                        this.window.divMain.querySelector("div.tw2gui_window_content_pane").appendChild(button.getMainDiv());
                    };

                    console.log("This:");
                    console.log(this);

                    button25.onclick = () => buttonOnClick(25, button25);
                    styleAndAppendDiv(button25, "140px", "300px");

                    button50.onclick = () => buttonOnClick(50, button50);
                    styleAndAppendDiv(button50, "110px", "200px");

                    button150.onclick = () => buttonOnClick(150, button150);
                    styleAndAppendDiv(button150, "80px", "100px");
                };
                // TODO
                // setInterval(function() {$(".job_durationbar.job_durationbar_short").click();}, 16000);
            },
        };

        TWPT.DuelClothCalc = {
            init () {
                // eslint-disable-next-line camelcase
                PlayerProfileMain.backup_setWear = PlayerProfileMain.setWear;
                PlayerProfileMain.setWear = function () {
                    PlayerProfileMain.backup_setWear.apply(this, arguments);

                    const playerLevel = this.resp.level;

                    let weaponId = 0;

                    const itemKeys = [];


                    Object.keys(this.resp.wear).forEach((key) => {
                        if (this.resp.wear[key] &&
                            (key === "animal" || key === "yield" /*Product*/ ||
                                key === "head" || key === "body" || key === "pants" || key === "foot" ||
                                key === "neck" || key === "belt" || key === "right_arm" || key === "left_arm")) {
                            if (key === "right_arm") {
                                weaponId = this.resp.wear[key];
                            }
                            itemKeys.push(this.resp.wear[key]);
                        }
                    });

                    const values = TWPT.DuelClothCalc.getSkillValuesFromItemKeys(playerLevel, itemKeys);
                    const popupData = TWPT.DuelClothCalc.getPopupData(values);

                    const duelistPopup = TWPT.DuelClothCalc.generateNpcPopup(popupData, weaponId, this.resp);
                    const jqueryAvatar = this.window.find("div.profileavatar");
                    jqueryAvatar.attr("title", duelistPopup);

                    const overlayClass = this.window.find("div.overlay");
                    overlayClass.removeClass("overlay");
                };
            },

            getSkillValuesFromItemKeys (playerLevel, itemKeys) {
                const itemObjects = TWPT.DuelClothCalc.getItemObjects(itemKeys);
                const sets = TWPT.DuelClothCalc.getSetsNumbers(itemObjects);
                const setObjects = TWPT.DuelClothCalc.getSetData(sets);

                return TWPT.DuelClothCalc.calculateValues(itemObjects, playerLevel, sets, setObjects);
            },

            getItemObjects (itemKeys) {
                const itemObjects = [];
                itemKeys.forEach((key) => itemObjects.push(ItemManager.get(key)));

                return itemObjects;
            },

            calculateValues (itemObjects, playerLevel, sets, setObjects) {
                const values = {
                    strength: 0,
                    flexibility: 0,
                    dexterity: 0,
                    charisma: 0,
                    /*Strength*/
                    build: 0,
                    punch: 0,
                    tough: 0,
                    endurance: 0,
                    health: 0,
                    /*flexibility*/
                    ride: 0,
                    reflex: 0,
                    dodge: 0,
                    hide: 0,
                    swim: 0,
                    /*Dexterity*/
                    aim: 0,
                    shot: 0,
                    pitfall: 0,
// eslint-disable-next-line camelcase
                    finger_dexterity: 0,
                    repair: 0,
                    /*charisma*/
                    leadership: 0,
                    tactic: 0,
                    trade: 0,
                    animal: 0,
                    appearance: 0,
                };

                itemObjects.forEach((itemObject) => {
                    const newValuesBonus = TWPT.DuelClothCalc.getBonusObjectValues(itemObject.bonus.item);
                    TWPT.DuelClothCalc.factorizeValues(newValuesBonus, playerLevel, itemObject.item_level);

                    TWPT.DuelClothCalc.addToValues(values, newValuesBonus);

                    const newValuesSimple = TWPT.DuelClothCalc.getSimpleObjectValues(itemObject);
                    TWPT.DuelClothCalc.addToValues(values, newValuesSimple);
                });

                TWPT.DuelClothCalc.addSetsToValues(sets, values, playerLevel, setObjects);

                return values;
            },

            factorizeValues (values, playerLevel, itemLevel) {
                const itemPercent = itemLevel ? 1 + (itemLevel / 10) : 1;
                Object.keys(values).forEach((key) => {
                    const ceilValue = Math.ceil(values[key] * playerLevel);
                    values[key] = Math.round(ceilValue * itemPercent);
                    if (values[key] === ceilValue && itemPercent !== 1) {
                        values[key]++;
                    }
                });
            },

            addToValues (values, newValues) {
                Object.keys(newValues).forEach((key) => values[key] = values[key] ? values[key] + newValues[key] : newValues[key]);
            },

            getBonusObjectValues (item) {
                const values = {};

                item.forEach((valueObj) => {
                    if (valueObj.type === "character" && valueObj.key === "level" && /*valueObj.roundingMethod === "ceil" &&*/
                        (valueObj.bonus.type === "skill" || valueObj.bonus.type === "attribute")) {
                        values[valueObj.bonus.name] = valueObj.bonus.value;
                    }
                });

                return values;
            },

            getSimpleSetObjectValues (setObject) {
                const values = {};

                setObject.forEach((key) => {
                    if (key.type === "attribute" || key.type === "skill") {
                        values[key.name] = key.value;
                    }
                });

                return values;
            },

            getSimpleObjectValues (itemObject) {
                const values = {};

                Object.keys(itemObject.bonus.skills).forEach((key) => values[key] = itemObject.bonus.skills[key]);
                Object.keys(itemObject.bonus.attributes).forEach((key) => values[key] = itemObject.bonus.attributes[key]);

                return values;
            },

            addSetsToValues (sets, values, playerLevel, setObjects) {
                Object.keys(sets).forEach((key) => {
                    const setData = setObjects[key];
                    if (setData && setData.bonus[sets[key]]) {
                        const valuesSetBonus = {};
                        const valuesSetSimple = {};

                        for (let index = 2; index <= sets[key]; index++) {
                            const valuesSetBonusLevel = TWPT.DuelClothCalc.getBonusObjectValues(setData.bonus[index]);
                            TWPT.DuelClothCalc.addToValues(valuesSetBonus, valuesSetBonusLevel);

                            const valuesSetSimpleLevel = TWPT.DuelClothCalc.getSimpleSetObjectValues(setData.bonus[index]);
                            TWPT.DuelClothCalc.addToValues(valuesSetSimple, valuesSetSimpleLevel);
                        }

                        TWPT.DuelClothCalc.factorizeValues(valuesSetBonus, playerLevel);

                        TWPT.DuelClothCalc.addToValues(values, valuesSetBonus);
                        TWPT.DuelClothCalc.addToValues(values, valuesSetSimple);
                    }
                });
            },

            getPopupData (values) {
                return {
                    shot: values.dexterity + values.shot,
                    punch: values.strength + values.punch,
                    aim: values.dexterity + values.aim,
                    appearance: values.charisma + values.appearance,
                    tactic: values.charisma + values.tactic,
                    reflex: values.flexibility + values.reflex,
                    dodge: values.flexibility + values.dodge,
                    tough: values.strength + values.tough,
                    health: values.strength + values.health,
                };
            },

            getSetsNumbers (itemObjects) {
                const sets = {};
                itemObjects.forEach((itemObject) => {
                    if (itemObject.set) {
                        if (sets.hasOwnProperty(itemObject.set)) {
                            sets[itemObject.set]++;
                        } else {
                            sets[itemObject.set] = 1;
                        }
                    }
                });
                return sets;
            },

            getSetData (sets) {
                const setObjects = [];
                Object.keys(sets).forEach((key) => {
                    setObjects[key] = west.storage.ItemSetManager.get(key);
                });
                return setObjects;
            },

            generateNpcPopup (npcData, weaponId, character) {
                let weapon, damage;
                if (weaponId) {
                    weapon = ItemManager.get(weaponId);
                    damage = weapon.getDamage(character);
                }
                return `<table class="dln_npcskill_popup">${
                        weapon ? "<tr><td colspan=\"5\" class=\"text_bold\">" + "The opponent's skill bonus" + "<br />&nbsp;</td></tr>" : ""
                        }<tr><td><img src="https://west${TWPT.serverUrl}.innogamescdn.com/images/window/duels/npcskill_shot.jpg" /></td><td><img src="https://west${TWPT.serverUrl}.innogamescdn.com/images/window/duels/npcskill_punch.jpg" /></td>` +
                    `<td><img src="https://west${TWPT.serverUrl}.innogamescdn.com/images/window/duels/npcskill_aim.jpg" /></td><td><img src="https://west${TWPT.serverUrl}.innogamescdn.com/images/window/duels/npcskill_appearance.jpg" /></td><td></td></tr>` +
                    `<tr><td class="text_bold">${npcData.shot || 0}</td><td class="text_bold">${npcData.punch || 0}</td>` +
                    `<td class="text_bold">${npcData.aim || 0}</td><td class="text_bold">${npcData.appearance || 0
                        }</td><td></td></tr>` +
                    `<tr><td><img src="https://west${TWPT.serverUrl}.innogamescdn.com/images/window/duels/npcskill_tactic.jpg" /></td><td><img src="https://west${TWPT.serverUrl}.innogamescdn.com/images/window/duels/npcskill_reflex.jpg" /></td>` +
                    `<td><img src="https://west${TWPT.serverUrl}.innogamescdn.com/images/window/duels/npcskill_dodge.jpg" /></td><td><img src="https://west${TWPT.serverUrl}.innogamescdn.com/images/window/duels/npcskill_tough.jpg" /></td><td><img src="https://west${TWPT.serverUrl}.innogamescdn.com/images/window/duels/npcskill_health.jpg" /></td></tr>` +
                    `<tr><td class="text_bold">${npcData.tactic || 0}</td><td class="text_bold">${npcData.reflex || 0}</td>` +
                    `<td class="text_bold">${npcData.dodge || 0}</td><td class="text_bold">${npcData.tough || 0
                        }</td><td class="text_bold">${npcData.health || 0}</td></tr>${weapon ?
                        `<tr><td colspan="2" class="text_bold"><img src="${weapon.image
                            }" /></td><td colspan="3" class="text_bold"><br />${
                            weapon.name}<br />(` + "Damage" + `:&nbsp;${damage.min} - ${damage.max})</td></tr>` :
                        ""}</table>`;
            },
        };

        try {
            TWPT.Updater.init();
            TWPT.Settings.init();
            Object.keys(TWPT.preferences).forEach((property) => {
                if (TWPT.preferences[property]) {
                    try {
                        TWPT[property].init();
                    } catch (err) {
                        console.log(`TWPT Error with feature "${property}".`, err.stack);
                    }
                }
            });

            // call TWPTClothCalc.getRealSkillValuesFormatted(playerLevel, [key1, key2, ...]) to get added and formatted values.
            // call TWPTClothCalc.getSkillValues(playerLevel, [key1, key2, ...]) to get naked values.
            TWPTClothCalc = {
                getRealSkillValuesFormatted (playerLevel, itemKeys) {
                    const values = TWPT.DuelClothCalc.getSkillValuesFromItemKeys(playerLevel, itemKeys);
                    return {
                        strength: {
                            build: values.strength + values.build,
                            punch: values.strength + values.punch,
                            tough: values.strength + values.tough,
                            endurance: values.strength + values.endurance,
                            health: values.strength + values.health,
                        },

                        flexibility: {
                            ride: values.flexibility + values.ride,
                            reflex: values.flexibility + values.reflex,
                            dodge: values.flexibility + values.dodge,
                            hide: values.flexibility + values.hide,
                            swim: values.flexibility + values.swim,
                        },

                        dexterity: {
                            aim: values.dexterity + values.aim,
                            shot: values.dexterity + values.shot,
                            pitfall: values.dexterity + values.pitfall,
// eslint-disable-next-line camelcase
                            finger_dexterity: values.dexterity + values.finger_dexterity,
                            repair: values.dexterity + values.repair,
                        },

                        charisma: {
                            leadership: values.charisma + values.leadership,
                            tactic: values.charisma + values.tactic,
                            trade: values.charisma + values.trade,
                            animal: values.charisma + values.animal,
                            appearance: values.charisma + values.appearance,
                        },

                        duelValues: {
                            shot: values.dexterity + values.shot,
                            punch: values.strength + values.punch,
                            aim: values.dexterity + values.aim,
                            appearance: values.charisma + values.appearance,
                            tactic: values.charisma + values.tactic,
                            reflex: values.flexibility + values.reflex,
                            dodge: values.flexibility + values.dodge,
                            tough: values.strength + values.tough,
                            health: values.strength + values.health,
                        },
                    };
                },
                getSkillValues: TWPT.DuelClothCalc.getSkillValuesFromItemKeys,
            };
        } catch (err) {
            console.log(err.stack);
        }
    });
}));
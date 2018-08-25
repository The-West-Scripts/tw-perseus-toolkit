// ==UserScript==
// @name        The West Perseus Toolkit
// @author      Mr. Perseus
// @namespace   tw-perseus
// @description Useful tools for The West.
// @include     https://*.the-west.*/game.php*
// @include     http://*.the-west.*/game.php*
// @include     https://*.tw.innogames.*/game.php*
// @include     http://*.tw.innogames.*/game.php*
// @version     0.2.0
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
            version: "0.2.0",
            settingsKey: "TWPT_preferences",
            defaultPreferences: {
                JobHighlighter: true,
                CinemaSkipButton: true,
                ZoomMap: true,
                DisablePremiumNotifications: true,
                MoreFifteenSec: true,
            },
            preferences: {},
            currentZoom: 1,
        };

        TWPT.Updater = {
            init () {
                setTimeout(TWPT.Updater.load, 5000);
            },

            load () {
                $.getScript("https://rawcdn.githack.com/mr-perseus/tw-js-library/master/script-updater.js", () => {
                    if (scriptUpdater.TWPT > TWPT.version) {
                        const updateMessage = new west.gui.Dialog(
                            "Update: The West Perseus Toolkit",
                            `<span>Update Available<br><br><b>v${scriptUpdater.TWPT}:</b><br>${scriptUpdater.TWPTNew
                                }</span>`, west.gui.Dialog.SYS_WARNING
                        ).addButton("Update", () => {
                            updateMessage.hide();
                            location.href = "https://greasyfork.org/scripts/370137-the-west-perseus-toolkit/code/The%20West%20Perseus%20Toolkit.user.js";
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

                setTitle("Perseus Toolkit Extended");
                setCheckBox("MoreFifteenSec", "Adds buttons to jobs which allow you to start a job 25 / 50 / unlimited times.");

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

        TWPT.MoreFifteenSec = {
            init () {
                // TODO
                // setInterval(function() {$(".job_durationbar.job_durationbar_short").click();}, 16000);
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
        } catch (err) {
            console.log(err.stack);
        }
    });
}));
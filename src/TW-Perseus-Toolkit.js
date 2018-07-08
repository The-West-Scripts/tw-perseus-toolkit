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
            version: "0.0.1",
        };

        TWPT.Updater = {
            init () {
                setTimeout(TWPT.Updater.load, 5000);
            },

            load () {
                $.getScript("https://rawcdn.githack.com/mr-perseus/tw-js-library/master/script-updater.js", () => {
                    if (scriptUpdater.TWPT > TWPT.version) {
                        const updateMessage = new west.gui.Dialog(
                            "Update: The West Duel Warner",
                            `<span>Update Available<br><br><b>v${scriptUpdater.TWPT}:</b><br>${scriptUpdater.TWPTNew
                                }</span>`, west.gui.Dialog.SYS_WARNING
                        ).addButton("Update", () => {
                            updateMessage.hide();
                            location.href = "TODO";
                        }).addButton("cancel").show();
                    }
                });
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
                    console.log("CONTROLLER", key);
                    button.setVisible(false);
                    button.disable();

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

        try {
            TWPT.Updater.init();
            TWPT.JobHighlighter.init();
            TWPT.CinemaSkipButton.init();
        } catch (err) {
            console.log(err.stack);
        }
    });
}));
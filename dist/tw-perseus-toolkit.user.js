// ==UserScript==
// @name        The West Perseus Toolkit
// @author      Mr. Perseus
// @namespace   tw-perseus
// @description Useful tools for The West.
// @include     https://*.the-west.*/game.php*
// @include     http://*.the-west.*/game.php*
// @include     https://*.tw.innogames.*/game.php*
// @include     http://*.tw.innogames.*/game.php*
// @version     0.0.1
// @grant       none
// ==/UserScript==

(function(a){const b=document.createElement("script");b.setAttribute("type","application/javascript"),b.textContent=`(${a})();`,document.body.appendChild(b),document.body.removeChild(b)})(()=>{$(document).ready(()=>{const a={version:"0.0.1"};a.Updater={init(){setTimeout(a.Updater.load,5e3)},load(){$.getScript("https://rawcdn.githack.com/mr-perseus/tw-js-library/master/script-updater.js",()=>{if(scriptUpdater.TWPT>a.version){const a=new west.gui.Dialog("Update: The West Duel Warner",`<span>Update Available<br><br><b>v${scriptUpdater.TWPT}:</b><br>${scriptUpdater.TWPTNew}</span>`,west.gui.Dialog.SYS_WARNING).addButton("Update",()=>{a.hide(),location.href="TODO"}).addButton("cancel").show()}})}},a.JobHighlighter={init(){$("head").append("<style type=\"text/css\">.jobgroup.silver {background-color: rgba(192, 192, 192, .7); border-radius: 10%; } .jobgroup.gold {background-color: rgba(255, 215, 0, .7); border-radius: 10%; }</style>"),Map.Component.JobGroup.prototype.backup_getAdditionalClasses=Map.Component.JobGroup.prototype.getAdditionalClasses,Map.Component.JobGroup.prototype.getAdditionalClasses=function(a,b){const c=Map.Component.JobGroup.prototype.backup_getAdditionalClasses.apply(this,arguments),d=Map.JobHandler.Featured[`${this.getLeft(a)}-${this.getTop(b)}`]||{};for(const e in d)if(d.hasOwnProperty(e)){if(d[e].gold)return`${c} gold`;if(d[e].silver)return`${c} silver`}return c}}};try{a.Updater.init(),a.JobHighlighter.init()}catch(a){console.log(a.stack)}})});
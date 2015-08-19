/*!
 * context-menu.js
 * Context sensitive menu in Javascript
 * https://github.com/markbernard/jquerycontextmenu
 *
 * Copyright (c) 2015, Mark Bernard
 * Released under the MIT license
 */

/*global $, menu, setTimeout, window */
var menu = {
    defaultBackgroundColour: "white",
    defaultForegroundColour: "black",
    registeredMenus: {},
    init: function (bindId, defaults) {
        "use strict";
        var type;
        
        menu.registeredMenus[bindId] = {};

        if (defaults.preMenu !== undefined) {
            menu.registeredMenus[bindId].preMenu = defaults.preMenu;
        } else {
            menu.registeredMenus[bindId].preMenu = function (){/*user implementation only*/};
        }
        if (defaults.postMenu !== undefined) {
            menu.registeredMenus[bindId].postMenu = defaults.postMenu;
        } else {
            menu.registeredMenus[bindId].postMenu = function (){/*user implementation only*/};
        }
        menu.registeredMenus[bindId].items = defaults.items;
        if (defaults.compact !== undefined) {
            menu.registeredMenus[bindId].compact = defaults.compact;
        } else {
            menu.registeredMenus[bindId].compact = false;
        }        
        if (menu.registeredMenus[bindId].compact) {
            type = "menu-compact";
        } else {
            type = "menu-standard";
        }
        menu.registeredMenus[bindId].color = menu.defaultBackgroundColour;

        $("#" + bindId).bind("contextmenu", function (eventObject) {
            var menuContent, menuContinue, target = eventObject.delegateTarget;

            for (var registeredMenu in menu.registeredMenus) {
                console.log(registeredMenu);
                $("#menu-container-" + registeredMenu).remove();
            }
            menuContinue = menu.registeredMenus[bindId].preMenu(target, menu.registeredMenus[bindId]);
            if (menuContinue === undefined || menuContinue === true) {
                menuContent = "<div id=\"menu-container-" + bindId + "\" class=\"menu " + type + "\"><ul>";

                menu.registeredMenus[bindId].items.forEach(function (option, index) {
                    if (option.label === "separator") {
                        menuContent += "<hr/>";
                    } else {
                        menuContent += "<li id=\"menu-" + bindId + "-" + index + "\">" + option.label + "</li>";
                    }
                });
                menuContent += "</ul></div>";
                $("body").append(menuContent);
                $(".menu").css("background-color", menu.registeredMenus[bindId].color);
                menu.registeredMenus[bindId].items.forEach(function (option, index) {
                    if (option.label !== "separator") {
                        $("#menu-" + bindId + "-" + index).on("click", function () {
                            option.action(target);
                        });
                    }
                });
                menu.registeredMenus[bindId].postMenu(target);
                setTimeout(function () {
                    var menuTop = eventObject.pageY,
                        menuLeft = eventObject.pageX + 15;
                    $("body").on("click", function () {
                        $("#menu-container-" + bindId).hide();
                    });
                    if (menuTop + $("#menu-container-" + bindId).height() > $(window).height()) {
                        menuTop = $(window).height() - ($("#menu-container-" + bindId).height() + 15);
                    }
                    if (menuLeft + $("#menu-container-" + bindId).width() > $(window).width()) {
                        menuLeft = $(window).width() - ($("#menu-container-" + bindId).width() + 15);
                    }
                    $("#menu-container-" + bindId).css({top: menuTop + "px", left: menuLeft + "px"});
                    $("#menu-container-" + bindId).show();
                }, 20);
            }
            return false;
            
        });
    }
};

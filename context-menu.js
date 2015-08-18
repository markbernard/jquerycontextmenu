var menu = {
    defaultBackgroundColour: "#eee",
    defaultForegroundColour: "black",
    types: ["standard", "compact"],
    init: function (bindId, defaults) {
        "use strict";
        menu[bindId] = {};
        
        if (defaults.preMenu !== undefined) {
            menu[bindId].preMenu = defaults.preMenu;
        } else {
            menu[bindId].preMenu = function (){};
        }
        if (defaults.postMenu !== undefined) {
            menu[bindId].postMenu = defaults.postMenu;
        } else {
            menu[bindId].postMenu = function (){};
        }
        menu[bindId].items = defaults.items;
        if (defaults.type !== undefined) {
            menu[bindId].type = defaults.type;
        } else {
            menu[bindId].type = 0;
        }
        menu[bindId].color = menu.defaultBackgroundColour;

        $("#" + bindId).bind("contextmenu", function (eventObject) {
            var menuContent, target = $(eventObject.delegateTarget);

            $("#menu-container-" + bindId).remove();
            menu[bindId].preMenu(target, menu[bindId]);
            menuContent = "<div id=\"menu-container-" + bindId + "\" class=\"menu " + menu.types[menu[bindId].type] + "\"><ul>";
            
            menu[bindId].items.forEach(function (option, index) {
                if (option.label === "separator") {
                    menuContent += "<hr/>";
                } else {
                    menuContent += "<li id=\"menu-" + bindId + "-" + index + "\">" + option.label + "</li>";
                }
            });
            menuContent += "</ul></div>";
            $("body").append(menuContent);
            $(".menu").css("background-color", menu[bindId].color);
            menu[bindId].items.forEach(function (option, index) {
                if (option.label !== "separator") {
                    $("#menu-" + bindId + "-" + index).on("click", function () {
                        option.action(target);
                    });
                }
            });
            menu[bindId].postMenu(target);
            setTimeout(function () {
                var menuTop = eventObject.pageY,
                    menuLeft = eventObject.pageX;
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

            return false;
        });
    }
};

import * as Plugin from "iitcpluginkit";
import icon from "./refresh.svg";

class Refresh implements Plugin.Class {

    /** time to cache tiles (in sec) */
    CACHE_TIME = 10;


    init() {
        require("./styles.css");

        this.createButton();


        window.addHook("mapDataRefreshStart", () => this.refreshStart());
        window.addHook("mapDataRefreshEnd", () => this.refreshEnd());
    }

    private createButton(): void {
        const toolbarGroup = $("<div>", { class: "leaflet-bar leaflet-control" })
            .append(
                $("<a>", {
                    id: "refreshMapButton",
                    class: "leaflet-bar-part",
                    click: () => this.refresh()
                }).append(
                    $("<img>", {
                        src: icon,
                        width: 16,
                        height: 16
                    })
                )
            );

        const parent = $(".leaflet-top.leaflet-left", window.map.getContainer());
        parent.prepend(toolbarGroup);
    }


    private refresh(): void {
        if ($("#refreshMapButton").hasClass("running")) return;


        window.idleReset();
        this.clearCache();
        window.mapDataRequest.clearTimeout();
        window.mapDataRequest.refresh();

        window.chat.request();

        // @ts-ignore
        window.portalDetail.setup();
    }


    private refreshStart(): void {
        $("#refreshMapButton").addClass("running");
    }

    private refreshEnd(): void {
        $("#refreshMapButton").removeClass("running");
        $("#refreshMapButton img").fadeOut(0).fadeIn(this.CACHE_TIME * 1000);
    }

    private clearCache(): void {
        const oldTime = window.mapDataRequest.cache.REQUEST_CACHE_MAX_AGE;

        window.mapDataRequest.cache.REQUEST_CACHE_MAX_AGE = this.CACHE_TIME;
        window.mapDataRequest.cache.runExpire()

        window.mapDataRequest.cache.REQUEST_CACHE_MAX_AGE = oldTime;

    }
}


Plugin.Register(new Refresh(), "Refresh");

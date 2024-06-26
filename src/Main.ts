import * as Plugin from "iitcpluginkit";
import icon from "./refresh.svg";

class Refresh implements Plugin.Class {

    /** time to keep cache tiles (in sec) */
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

        const parent = $(".leaflet-top.leaflet-left", window.map.getContainer()).first();
        parent.prepend(toolbarGroup);
    }


    private refresh(): void {
        if ($("#refreshMapButton").hasClass("running")) return;

        // make sure map is active
        window.idleReset();

        // clear tile cache
        this.clearCache();

        // refresh map
        window.mapDataRequest.clearTimeout();
        window.mapDataRequest.refresh();

        // refresh chat
        window.chat.request();

        window.artifact.requestData();

        // clear portal detail cache
        // @ts-ignore
        if (window.portalDetail.setup) {
            window.portalDetail.setup();
        } else if (window.portalDetail.clearCache) {
            window.portalDetail.clearCache();
        }
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

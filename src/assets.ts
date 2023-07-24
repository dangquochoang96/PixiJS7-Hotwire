import type { ResolverManifest } from "pixi.js";

export const manifest:ResolverManifest = {
    bundles: [
        {
            name : "game",
            assets:
            {
                "Clampy" : "./clampy.png",
            }
        },
        {
            name : "sounds",
            assets:
            {
                "whistle" : "",
            }
        },
    ]
}

export const BG_COLOR = 0xf00000;
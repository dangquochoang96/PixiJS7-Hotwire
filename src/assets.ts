import type { ResolverManifest } from "pixi.js";

export const manifest:ResolverManifest = {
    bundles: [
        {
            name : "images",
            assets:
            {
                "Clampy" : "./clampy.png",
            }
        },
        {
            name : "sound",
            assets:
            {
                "whistle" : "",
            }
        },
    ]
}

export const BG_COLOR = 0xf00000;
import { Container, Assets } from "pixi.js";
import { manifest } from "../assets";
import { IScene, Manager } from "./Manager";
import { GameScene } from "./GameScene";
import { LoadingBarContainer } from "../game/LoadingBar";

export class LoaderScene extends Container implements IScene {
    private _loadingBar: LoadingBarContainer;
    constructor() {
        super();
        
        const loaderBarWidth = 280;
        this._loadingBar = new LoadingBarContainer(loaderBarWidth, Manager.width, Manager.height);
        this.addChild(this._loadingBar);

        this.initializeLoader().then(() => {
            this.gameLoaded();
        })
    }

    private async initializeLoader(): Promise<void>
    {
        await Assets.init({ manifest: manifest });
        const bundleIds =  manifest.bundles.map(bundle => bundle.name);
        await Assets.loadBundle(bundleIds, this.downloadProgress.bind(this));
    }

    private downloadProgress(progressRatio: number): void {
        this._loadingBar.scaleProgress(progressRatio);
    }

    private gameLoaded(): void {
        // Change scene to the game scene!
        Manager.changeScene(new GameScene());
    }
    public update(): void {}
    public resize(): void {}
}
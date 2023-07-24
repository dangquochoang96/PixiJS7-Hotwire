import { Application, DisplayObject, Assets } from "pixi.js";
import { manifest } from "../assets";

export class Manager {
  private constructor() {}

  private static app: Application;
  private static currentScene: IScene;

  private static _width: number;
  private static _height: number;

  private static initializeAssetsPromise: Promise<unknown>;

  public static get width(): number {
    return Manager._width;
  }
  public static get height(): number {
    return Manager._height;
  }

  public static initialize(
    width: number,
    height: number,
    background: number
  ): void {
    Manager._width = width;
    Manager._height = height;

    Manager.app = new Application({
      view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
      backgroundColor: background,
      width: width,
      height: height,
    });

    // We store it to be sure we can use Assets later on
    Manager.initializeAssetsPromise = Assets.init({ manifest: manifest });
    const bundleNames = manifest.bundles.map((b) => b.name);
    Manager.initializeAssetsPromise.then(() =>
      Assets.backgroundLoadBundle(bundleNames)
    );

    Manager.app.ticker.add(Manager.update);

    // listen for the browser telling us that the screen size changed
    window.addEventListener("resize", Manager.resize);

    // call it manually once so we are sure we are the correct size after starting
    Manager.resize();
  }

  public static resize(): void {
    const view = Manager.app.view as HTMLCanvasElement;
    // current screen size
    const screenWidth = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    );
    const screenHeight = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    );

    // uniform scale for our game
    const scale = Math.min(
      screenWidth / Manager.width,
      screenHeight / Manager.height
    );

    // the "uniformly englarged" size for our game
    const enlargedWidth = Math.floor(scale * Manager.width);
    const enlargedHeight = Math.floor(scale * Manager.height);

    // margins for centering our game
    const horizontalMargin = (screenWidth - enlargedWidth) / 2;
    const verticalMargin = (screenHeight - enlargedHeight) / 2;

    // now we use css trickery to set the sizes and margins
    view.style.width = `${enlargedWidth}px`;
    view.style.height = `${enlargedHeight}px`;
    view.style.marginLeft = view.style.marginRight = `${horizontalMargin}px`;
    view.style.marginTop = view.style.marginBottom = `${verticalMargin}px`;
  }

  // Call this function when you want to go to a new scene
  public static async changeScene(newScene: IScene): Promise<void> {
    // let's make sure our Assets were initialized correctly
    await Manager.initializeAssetsPromise;

    // Remove and destroy old scene... if we had one..
    if (Manager.currentScene) {
      Manager.app.stage.removeChild(Manager.currentScene);
      Manager.currentScene.destroy();
    }

    // Now, let's start downloading the assets we need and wait for them...
    await Assets.loadBundle(newScene.assetBundles);

    // when we have assets, we tell that scene
    newScene.constructorWithAssets();

    // we now store it and show it, as it is completely created
    Manager.currentScene = newScene;
    Manager.app.stage.addChild(Manager.currentScene);
  }

  // This update will be called by a pixi ticker and tell the scene that a tick happened
  private static update(framesPassed: number): void {
    // Let the current scene know that we updated it...
    // Just for funzies, sanity check that it exists first.
    if (Manager.currentScene) {
      Manager.currentScene.update(framesPassed);
    }
    // as I said before, I HATE the "frame passed" approach. I would rather use `Manager.app.ticker.deltaMS`
  }
}

export interface IScene extends DisplayObject {
  update(framesPassed: number): void;
  resize(screenWidth: number, screenHeight: number): void;
  assetBundles: string[];
  constructorWithAssets(): void;
}

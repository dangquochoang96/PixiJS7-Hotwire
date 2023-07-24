import { Container, Sprite } from "pixi.js";
import { IScene } from "../scene/Manager";

export class GameScene extends Container implements IScene {
  assetBundles: string[] = ["game", "sounds"];

  constructor() {
    super();
    this.clg();
  }
  clg() {
    console.log("Hello");
  }
  constructorWithAssets(): void {
    const clampy = Sprite.from("Clampy");
    this.addChild(clampy);
  }
  update(): void {}
  resize(): void {}
}

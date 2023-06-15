import { Container, Sprite } from "pixi.js";
import 'pixi-spine';
import { IScene, Manager, } from "./Manager";

export class GameScene extends Container implements IScene {
    private clampy: Sprite;
    private clampyVelocity: number;
    constructor() {
        super();

        this.clampy = Sprite.from("Clampy");
        this.clampy.anchor.set(0.5);
        this.clampy.x = Manager.width / 2;
        this.clampy.y = Manager.height / 2;
        this.addChild(this.clampy);
        
        this.clampyVelocity = 5;
    }

    public update(framesPassed: number): void {
        // Lets move clampy!
        this.clampy.x += this.clampyVelocity * framesPassed;

        if (this.clampy.x > Manager.width) {
            this.clampy.x = Manager.width;
            this.clampyVelocity = -this.clampyVelocity;
        }

        if (this.clampy.x < 0) {
            this.clampy.x = 0;
            this.clampyVelocity = -this.clampyVelocity;
        }
    }
    public resize(): void {
    }
}
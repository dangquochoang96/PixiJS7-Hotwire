import { Manager } from './scene/Manager';
import { BG_COLOR } from './assets';
import { GameScene } from './game/GameScene';

Manager.initialize(720, 1280, BG_COLOR);

// We no longer need to tell the scene the size because we can ask Manager!
Manager.changeScene(new GameScene());
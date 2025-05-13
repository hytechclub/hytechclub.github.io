// =============================================================================
// Gameplay Settings
// =============================================================================

Spider.SPEED = SPIDER_SPEED;
Hero.RUN_FPS = RUN_FPS;

// =============================================================================
// Sprites
// =============================================================================

//
// Hero
//

function Hero(game, x, y) {
    // call Phaser.Sprite constructor
    Phaser.Sprite.call(this, game, x, y, 'hero');

    // anchor
    this.anchor.set(0.5, 0.5);
    // physics properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    // animations
    this.animations.add('stop', [0]);
    this.animations.add('run', [0, 1, 2, 3], Hero.RUN_FPS, true); // 8fps looped
    this.animations.add('jump', [1]);
    this.animations.add('fall', [1]);
    this.animations.add('die', [1], 12); // 12fps no loop
    // starting animation
    this.animations.play('stop');
}

// inherit from Phaser.Sprite
Hero.prototype = Object.create(Phaser.Sprite.prototype);
Hero.prototype.constructor = Hero;

Hero.prototype.move = function (direction) {
    // guard
    if (this.isFrozen) { return; }

    this.body.velocity.x = direction * SPEED;

    // update image flipping & animations
    if (this.body.velocity.x < 0) {
        this.scale.x = -1;
    }
    else if (this.body.velocity.x > 0) {
        this.scale.x = 1;
    }
};

Hero.prototype.jump = function () {
    let canJump = this.body.touching.down && this.alive && !this.isFrozen;

    if (canJump || this.isBoosting) {
        this.body.velocity.y = -JUMP_SPEED;
        this.isBoosting = true;
    }

    return canJump;
};

Hero.prototype.stopJumpBoost = function () {
    this.isBoosting = false;
};

Hero.prototype.bounce = function () {
    this.body.velocity.y = -BOUNCE_SPEED;
};

Hero.prototype.update = function () {
    // update sprite animation, if it needs changing
    let animationName = this._getAnimationName();
    if (this.animations.name !== animationName) {
        this.animations.play(animationName);
    }
};

Hero.prototype.freeze = function () {
    this.body.enable = false;
    this.isFrozen = true;
};

Hero.prototype.die = function () {
    this.alive = false;
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

// returns the animation name that should be playing depending on
// current circumstances
Hero.prototype._getAnimationName = function () {
    let name = 'stop'; // default animation

    // dying
    if (!this.alive) {
        name = 'die';
    }
    // frozen & not dying
    else if (this.isFrozen) {
        name = 'stop';
    }
    // jumping
    else if (this.body.velocity.y < 0) {
        name = 'jump';
    }
    // falling
    else if (this.body.velocity.y >= 0 && !this.body.touching.down) {
        name = 'fall';
    }
    else if (this.body.velocity.x !== 0 && this.body.touching.down) {
        name = 'run';
    }

    return name;
};

//
// Spider (enemy)
//

function Spider(game, x, y) {
    Phaser.Sprite.call(this, game, x, y, 'spider');

    // anchor
    this.anchor.set(0.5);
    // animation
    this.animations.add('crawl', [0, 1, 2], 8, true);
    this.animations.add('die', [0, 4, 0, 4, 0, 4, 3, 3, 3, 3, 3, 3], 12);
    this.animations.play('crawl');

    // physic properties
    this.game.physics.enable(this);
    this.body.collideWorldBounds = true;
    this.body.velocity.x = Spider.SPEED;
}

// inherit from Phaser.Sprite
Spider.prototype = Object.create(Phaser.Sprite.prototype);
Spider.prototype.constructor = Spider;

Spider.prototype.update = function () {
    // check against walls and reverse direction if necessary
    if (this.body.touching.right || this.body.blocked.right) {
        this.body.velocity.x = -Spider.SPEED; // turn left
    }
    else if (this.body.touching.left || this.body.blocked.left) {
        this.body.velocity.x = Spider.SPEED; // turn right
    }
};

Spider.prototype.die = function () {
    this.body.enable = false;

    this.animations.play('die').onComplete.addOnce(function () {
        this.kill();
    }, this);
};

// =============================================================================
// Loading state
// =============================================================================

LoadingState = {};

LoadingState.init = function () {
    // keep crispy-looking pixels
    this.game.renderer.renderSession.roundPixels = true;
};

LoadingState.preload = function () {
    this.game.load.crossOrigin = "anonymous";
    const cdnUrl = "https://cdn.glitch.global/d8bf25fe-9738-44c2-9596-3d575fcc99e6/";
    this.game.load.json('level:0', 'level00.json');
    this.game.load.json('level:1', 'level01.json');
    this.game.load.json('level:2', 'level02.json');

    this.game.load.image('font:numbers', `${cdnUrl}numbers.png`);

    this.game.load.image('icon:coin', `${cdnUrl}coin_icon.png`);
    this.game.load.image('background', `${cdnUrl}background.png`);
    this.game.load.image('invisible-wall', `${cdnUrl}invisible_wall.png`);
    this.game.load.image('ground', `${cdnUrl}ground.png`);
    this.game.load.image('grass:8x1', `${cdnUrl}grass_8x1.png`);
    this.game.load.image('grass:7x1', `${cdnUrl}grass_7x1.png`);
    this.game.load.image('grass:6x1', `${cdnUrl}grass_6x1.png`);
    this.game.load.image('grass:4x1', `${cdnUrl}grass_4x1.png`);
    this.game.load.image('grass:2x1', `${cdnUrl}grass_2x1.png`);
    this.game.load.image('grass:1x1', `${cdnUrl}grass_1x1.png`);
    this.game.load.image('key', `${cdnUrl}key.png`);

    this.game.load.spritesheet('decoration', `${cdnUrl}decor.png`, 42, 42);
    this.game.load.spritesheet('hero', `${cdnUrl}player.png`, 32, 32);
    this.game.load.spritesheet('coin', `${cdnUrl}coin_animated.png`, 22, 22);
    this.game.load.spritesheet('spider', `${cdnUrl}spider.png`, 42, 32);
    this.game.load.spritesheet('door', `${cdnUrl}door.png`, 42, 66);
    this.game.load.spritesheet('icon:key', `${cdnUrl}key_icon.png`, 34, 30);

    // this.game.load.audio('sfx:jump', 'audio/jump.wav');
    // this.game.load.audio('sfx:coin', 'audio/coin.wav');
    // this.game.load.audio('sfx:key', 'audio/key.wav');
    // this.game.load.audio('sfx:stomp', 'audio/stomp.wav');
    // this.game.load.audio('sfx:door', 'audio/door.wav');
    // this.game.load.audio('bgm', ['audio/bgm.mp3', 'audio/bgm.ogg']);
};

LoadingState.create = function () {
    this.game.state.start('play', true, false, {level: 0});
};


// ===============================
// Game Over
// ===============================

var GameOverState = {}; 

GameOverState.create = function () {
  this.gameoverText = this.game.add.text(10,10, `

    ${this.won ? "You Won :)" : "Game Over :("}

    total score: ${this.endScore}
    
    press Enter to restart`); 
  this.gameoverText.fill = "#ffffff";
  
  if (this.won) {
    addNewScore(this.endScore);
  }
}; 

GameOverState.init = function(data) {
  this.endScore = data.score;
  this.won = data.won;
  
  this.keys = this.game.input.keyboard.addKeys({
      enter: Phaser.KeyCode.ENTER,
  });
}

GameOverState.update = function () {
  if (this.keys.enter.isDown) {
        this.game.state.start('play');
    }
}

GameOverState.restart = function(){ 
    game.state.start('play', {score: 0, level: 0}); 
};

// =============================================================================
// Play state
// =============================================================================

PlayState = {};

const LEVEL_COUNT = 3;

PlayState.init = function (data) {
    this.keys = this.game.input.keyboard.addKeys({
        left: Phaser.KeyCode.LEFT,
        right: Phaser.KeyCode.RIGHT,
        up: Phaser.KeyCode.UP
    });

    this.score = data && data.score || 0;
    this.hasKey = false;
    this.level = data && data.level || 0;
    this.timeTicking = true;
};

PlayState.create = function () {
    // fade in (from black)
    this.camera.flash('#000000');

    // create sound entities
    // this.sfx = {
    //     jump: this.game.add.audio('sfx:jump'),
    //     coin: this.game.add.audio('sfx:coin'),
    //     key: this.game.add.audio('sfx:key'),
    //     stomp: this.game.add.audio('sfx:stomp'),
    //     door: this.game.add.audio('sfx:door')
    // };
    // this.bgm = this.game.add.audio('bgm');
    // this.bgm.loopFull();

    // create level entities and decoration
    this.game.add.image(0, 0, 'background');
  
    this.timeLimit = 60;
    this.timeTicking = true;
    this.timeText = this.game.add.text(850, 10, "01:00"); 
    this.timeText.fill = "#000000"; 
    this.timer = this.game.time.events.loop(1000, tick, this);
  
    if (this.level >= LEVEL_COUNT) {
      this.game.state.start("gameover", true, false, {
        score: this.score,
        won: true
      });
    } else {
      this._loadLevel(this.game.cache.getJSON(`level:${this.level}`));
    }

    // create UI score boards
    this._createHud();
};

PlayState.update = function () {
    this._handleCollisions();
    this._handleInput();

    // update scoreboards
    this.scoreText.text = `  score: ${this.score}`;
    this.keyIcon.frame = this.hasKey ? 1 : 0;
};

PlayState.shutdown = function () {
    // this.bgm.stop();
};

PlayState._handleCollisions = function () {
    this.game.physics.arcade.collide(this.spiders, this.platforms);
    this.game.physics.arcade.collide(this.spiders, this.enemyWalls);
    this.game.physics.arcade.collide(this.hero, this.platforms);

    // hero vs coins (pick up)
    this.game.physics.arcade.overlap(this.hero, this.coins, this._onHeroVsCoin,
        null, this);
    // hero vs key (pick up)
    this.game.physics.arcade.overlap(this.hero, this.key, this._onHeroVsKey,
        null, this);
    // hero vs door (end level)
    this.game.physics.arcade.overlap(this.hero, this.door, this._onHeroVsDoor,
        // ignore if there is no key or the player is on air
        function (hero, door) {
            return this.hasKey && hero.body.touching.down;
        }, this);
    // collision: hero vs enemies (kill or die)
    this.game.physics.arcade.overlap(this.hero, this.spiders,
        this._onHeroVsEnemy, null, this);
};

PlayState._handleInput = function () {
    if (this.keys.left.isDown) { // move hero left
        this.hero.move(-1);
    }
    else if (this.keys.right.isDown) { // move hero right
        this.hero.move(1);
    }
    else { // stop
        this.hero.move(0);
    }

    // handle jump
    const JUMP_HOLD = 200; // ms
    if (this.keys.up.downDuration(JUMP_HOLD)) {
        let didJump = this.hero.jump();
        // if (didJump) { this.sfx.jump.play(); }
    }
    else {
        this.hero.stopJumpBoost();
    }
};

PlayState._onHeroVsKey = function (hero, key) {
    // this.sfx.key.play();
    key.kill();
    this.hasKey = true;
};

PlayState._onHeroVsCoin = function (hero, coin) {
    // this.sfx.coin.play();
    coin.kill();
    this.score = this.score + 100;
};

PlayState._onHeroVsEnemy = function (hero, enemy) {
    // the hero can kill enemies when is falling (after a jump, or a fall)
    if (hero.body.velocity.y > 0) {
        enemy.die();
        hero.bounce();
        this.score += 250;
        // this.sfx.stomp.play();
    }
    else { // game over -> play dying animation and restart the game
        hero.die();
        // this.sfx.stomp.play();
        hero.events.onKilled.addOnce(function () {
          this.game.state.start("gameover", true, false, {
            won: false,
            score: this.score
          });
        }, this);

        // NOTE: bug in phaser in which it modifies 'touching' when
        // checking for overlaps. This undoes that change so spiders don't
        // 'bounce' agains the hero
        enemy.body.touching = enemy.body.wasTouching;
    }
};

PlayState._onHeroVsDoor = function (hero, door) {
    // 'open' the door by changing its graphic and playing a sfx
    door.frame = 1;
    // this.sfx.door.play();

    // play 'enter door' animation and change to the next level when it ends
    hero.freeze();
    this.game.add.tween(hero)
        .to({x: this.door.x, alpha: 0}, 500, null, true)
        .onComplete.addOnce(this._goToNextLevel, this);
};

PlayState._goToNextLevel = function () {
    const timeBonusTime = this.timeLimit;
    this.timeTicking = false;
    this.score = this.score + timeBonusTime * 10;
    this.game.add.text(350, 10, `TIME BONUS: ${timeBonusTime} x 10 = ${timeBonusTime * 10}`); 
    setTimeout(() => {
      this.camera.fade('#000000')
    }, 2000);
    this.camera.onFadeComplete.addOnce(function () {
        // change to next level
        this.game.state.restart(true, false, {
            level: this.level + 1,
            score: this.score
        });
    }, this);
};

PlayState._loadLevel = function (data) {
    // create all the groups/layers that we need
    this.bgDecoration = this.game.add.group();
    this.platforms = this.game.add.group();
    this.coins = this.game.add.group();
    this.spiders = this.game.add.group();
    this.enemyWalls = this.game.add.group();
    this.enemyWalls.visible = false;

    // spawn hero and enemies
    this._spawnCharacters({hero: data.hero, spiders: data.spiders});

    // spawn level decoration
    data.decoration.forEach(function (deco) {
        this.bgDecoration.add(
            this.game.add.image(deco.x, deco.y, 'decoration', deco.frame));
    }, this);

    // spawn platforms
    data.platforms.forEach(this._spawnPlatform, this);

    // spawn important objects
    data.coins.forEach(this._spawnCoin, this);
    this._spawnKey(data.key.x, data.key.y);
    this._spawnDoor(data.door.x, data.door.y);

    // enable gravity
    this.game.physics.arcade.gravity.y = GRAVITY;
};

PlayState._spawnCharacters = function (data) {
    // spawn spiders
    data.spiders.forEach(function (spider) {
        let sprite = new Spider(this.game, spider.x, spider.y);
        this.spiders.add(sprite);
    }, this);

    // spawn hero
    this.hero = new Hero(this.game, data.hero.x, data.hero.y);
    this.game.add.existing(this.hero);
};

PlayState._spawnPlatform = function (platform) {
    let sprite = this.platforms.create(
        platform.x, platform.y, platform.image);

    // physics for platform sprites
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;
    sprite.body.immovable = true;

    // spawn invisible walls at each side, only detectable by enemies
    this._spawnEnemyWall(platform.x, platform.y, 'left');
    this._spawnEnemyWall(platform.x + sprite.width, platform.y, 'right');
};

PlayState._spawnEnemyWall = function (x, y, side) {
    let sprite = this.enemyWalls.create(x, y, 'invisible-wall');
    // anchor and y displacement
    sprite.anchor.set(side === 'left' ? 1 : 0, 1);
    // physic properties
    this.game.physics.enable(sprite);
    sprite.body.immovable = true;
    sprite.body.allowGravity = false;
};

PlayState._spawnCoin = function (coin) {
    let sprite = this.coins.create(coin.x, coin.y, 'coin');
    sprite.anchor.set(0.5, 0.5);

    // physics (so we can detect overlap with the hero)
    this.game.physics.enable(sprite);
    sprite.body.allowGravity = false;

    // animations
    sprite.animations.add('rotate', [0, 1, 2, 1], COIN_FPS, true); // 6fps, looped
    sprite.animations.play('rotate');
};

PlayState._spawnKey = function (x, y) {
    this.key = this.bgDecoration.create(x, y, 'key');
    this.key.anchor.set(0.5, 0.5);
    // enable physics to detect collisions, so the hero can pick the key up
    this.game.physics.enable(this.key);
    this.key.body.allowGravity = false;

    // add a small 'up & down' animation via a tween
    this.key.y -= 3;
    this.game.add.tween(this.key)
        .to({y: this.key.y + 6}, 800, Phaser.Easing.Sinusoidal.InOut)
        .yoyo(true)
        .loop()
        .start();
};

PlayState._spawnDoor = function (x, y) {
    this.door = this.bgDecoration.create(x, y, 'door');
    this.door.anchor.setTo(0.5, 1);
    this.game.physics.enable(this.door);
    this.door.body.allowGravity = false;
};

PlayState._createHud = function () {
    const NUMBERS_STR = '0123456789X ';
    // this.coinFont = this.game.add.retroFont('font:numbers', 20, 26,
    //     NUMBERS_STR, 6);

    this.keyIcon = this.game.make.image(0, 19, 'icon:key');
    this.keyIcon.anchor.set(0, 0.5);

    let coinIcon = this.game.make.image(this.keyIcon.width + 7, 0, 'icon:coin');
    this.scoreText = this.game.add.text(coinIcon.x + coinIcon.width, 0, "x0"); 
    this.scoreText.fill = "#ffffff"; 

    this.hud = this.game.add.group();
    this.hud.add(coinIcon);
    this.hud.add(this.scoreText);
    this.hud.add(this.keyIcon);
    this.hud.position.set(10, 10);
};

// =============================================================================
// entry point
// =============================================================================
let game;
window.onload = function () {
    game = new Phaser.Game(960, 600, Phaser.AUTO, "", "", false, false);
    game.state.add('play', PlayState);
    game.state.add('loading', LoadingState);
    game.state.add("gameover", GameOverState); 
    game.state.start('loading');
};

var restartGame = function () {
    game.state.start('play', {score: 0, level: 0});
};

var tick = function () {
    if (this.timeTicking) {
      this.timeLimit--; 
    }
  
    var minutes = Math.floor(this.timeLimit / 60); 
    var seconds = this.timeLimit - (minutes * 60); 
    var timeString = addZeros(minutes) + ":" + addZeros(seconds); 
    this.timeText.text = timeString; 
    if (this.timeLimit === 0) {
        this.game.state.start("gameover", true, false, {
          won: false,
          score: this.score
        });
    } 
};

var reRunVars = function () {
  game.physics.arcade.gravity.y = GRAVITY;
  Spider.SPEED = SPIDER_SPEED;
}

var addZeros = function (num) {
    if (num < 10) {
        num = "0" + num;
    }
    return num;
};
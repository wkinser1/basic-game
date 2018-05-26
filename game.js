var game;
var player;
var platforms;
var badges;
var stars;
var poisons;
var cursors;
var coin;
var jumpButton;
var scoreText;
var livesText;
var finalMessage;
var won = false;
var gameOver = false;
var currentScore = 0;
var lives = 3;
var winningScore = 100;

function createStars() {
    stars = game.add.physicsGroup();

    starCreate(750, 50, 'star');
    starCreate(315, 225, 'star');
    starCreate(25, 150, 'star');
    starCreate(225, 75, 'star');
    starCreate(25, 300, 'star');

}

function createCoins() {
    coins = game.add.physicsGroup();

    coinCreate(75, 30, 'coin');
}


function createPoisons() {
    poisons = game.add.physicsGroup();

    poisonCreate(675, 275, 'poison');
    poisonCreate(450, 225, 'poison');
    poisonCreate(400, 450, 'poison');

}


function createPlatforms() {
    platforms = game.add.physicsGroup();

//top to bottom
    platforms.create(450, 150, 'platform');
    platforms.create(425, 300, 'platform');
    platforms.create(600, 400, 'platform');
    platforms.create(350, 500, 'platform');
    
// wall platforms, top to bottom
    
    platforms.create(0, 215, 'platform2');
    platforms.create(0, 350, 'platform2');
    

    platforms.setAll('body.immovable', true);
}

function starCreate(left, top, starImage) {
    var star = stars.create(left, top, starImage);
    star.animations.add('spin');
    star.animations.play('spin', 8, true);
}

function coinCreate(left, top, coinImage) {
    var coin = coins.create(left, top, coinImage);
    coin.animations.add('spin');
    coin.animations.play('spin', 8, true);

}

function poisonCreate(left, top, poisonImage) {
    var poison = poisons.create(left, top, poisonImage);
    poison.animations.add('bubble');
    poison.animations.play('bubble', 8, true);
}

function starCollect(player, star) {
    star.kill();
    currentScore = currentScore + 20;
    if (currentScore === winningScore) {
        won = true;
    }
}

function coinCollect(player, coin) {
    coin.kill();
    currentScore = currentScore + 40;
    if (currentScore === winningScore) {
        player.kill();
        won = true;
    }

    lives = lives + 1;
    if (lives === 5) {
        player.kill();
        won = true;
    }
}

function poisonCollect(player, poison) {
    poison.kill();
    currentScore = currentScore - 20;
    if (currentScore === winningScore) {
        won = true;
    }

    lives = lives - 1;
    if (lives === 0) {
        player.kill();
        gameOver = true;
    }
}

window.onload = function () {

    game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update, render: render });

    function preload() {

        game.stage.backgroundColor = '#89889c';

        //Load images
        game.load.image('platform', 'platform_1.png');
        game.load.image('platform2', 'platform_2.png');
        //Load spritesheets
        game.load.spritesheet('player', 'mikethefrog.png', 32, 32);
        game.load.spritesheet('coin', 'coin.png', 36, 44);
        game.load.spritesheet('badge', 'badge.png', 42, 54);
        game.load.spritesheet('poison', 'poison.png', 32, 32);
        game.load.spritesheet('star', 'star.png', 32, 32);
    }

    function create() {

        player = game.add.sprite(150, 600, 'player');
        player.animations.add('walk');
        player.anchor.setTo(0.5, 1);

        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.gravity.y = 800;

        createStars();
        createPoisons();
        createPlatforms();
        createCoins();

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);

        scoreText = game.add.text(16, 16, "SCORE: " + currentScore, { font: "24px Arial", fill: "white" });
        livesText = game.add.text(685, 16, "LIVES: " + lives, { font: "24px Arial", fill: "white" });

        finalMessage = game.add.text(game.world.centerX, 250, "", { font: "48px Arial", fill: "white" });
        finalMessage.anchor.setTo(0.5, 1);
    }

    function update() {
        scoreText.text = "SCORE: " + currentScore;
        livesText.text = "LIVES: " + lives;

        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.overlap(player, stars, starCollect);
        game.physics.arcade.overlap(player, poisons, poisonCollect);
        game.physics.arcade.overlap(player, coins, coinCollect);

        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = -350;
            player.scale.x = - 1;
        }
        else if (cursors.right.isDown) {
            player.animations.play('walk', 10, true);
            player.body.velocity.x = 500;
            player.scale.x = 1;
        }
        else {
            player.animations.stop();
        }

        if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -400;
        }
        if (won) {
            finalMessage.text = "YOU WIN!!!";
        }
        if (gameOver) {
            finalMessage.text = "GAME OVER!!!";
        }

    }

    function render() {

    }

};

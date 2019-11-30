var phaser = require("phaser");
//var ball;
var cannon;
var angle = -0.4;
var target;
var score = 1;
var text;
let ball;
var balls = [];
var timedEvent;
var trainingData = []

var config = {
  type: phaser.AUTO,
  width: 800,
  height: 400,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

new phaser.Game(config);

function preload() {
  this.load.image("ball", "/ball.png");
  this.load.image("cannon", "/canon.png");
  this.load.image("target", "/target.png");
}

function create() {
  //this.add.image(400, 300, 'ball');
  timedEvent = this.time.addEvent({ delay: 500, callback: fire, callbackScope: this, loop: true });

  text = this.add.text(10, 10, "Score: ", {
    font: "28px Arial",
    fill: "#ff0044",
    align: "center"
  });
  target = this.physics.add.staticImage(700, 200, "target");

  cannon = this.add.image(100, 320, "cannon").setScale(0.5);
  //var ball = this.physics.add.sprite(400, 0, "ball").setScale(0.5);
  //ball.disableBody(true, true);
  //ball.setCollideWorldBounds(true);
  //ball = this.physics.add.sprite(400, 0, "ball").setScale(0.5);
  // ball = new Ball({ scene: this, x: cannon.x + 130, y: cannon.y - 50 });
  //ball.disableBody(true, true);

  this.input.on(
    "pointerup",
    function() {
      //timer = 0;
      ball = new Ball({ scene: this, x: cannon.x + 130, y: cannon.y - 50 });
      balls.push(ball);

      for (var i = 0; i < balls.length; i++) {
        this.physics.velocityFromRotation(angle, 600, ball.body.velocity);
      }

      // balls.push(ball);
      // for (var i = 0; i < balls.length; i++) {
      //   // ball.play('fly');
      //   balls[i].enableBody(true, cannon.x + 130, cannon.y - 50, true, true);

      //   this.physics.velocityFromRotation(angle, 600, ball.body.velocity);
      //   //console.log(balls);0
      // }
    },
    this
  );
}

function update() {
  //console.log(angle)
  for (var i = 0; i < balls.length; i++) {
    this.physics.world.collide(balls[i], target, function() {
      text.text = "Score: " + score;
      score++;
      balls[i].destroy();
      trainingData.push({x:balls[i].x, y:balls[i].y, sp:cannon.x})
    
    });
  }
}

class Ball extends phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, "ball");
    config.scene.add.existing(this);
    config.scene.physics.add.existing(this);
    this.body.setCollideWorldBounds(true);
    this.setInteractive();
    this.setScale(0.5);
    this.on("pointerdown", function() {});
    //this.physics.add.collider(this.body, target);
  }

  clickMe() {
    this.alpha -= 0.1;
  }
}

function fire() {
  // console.log("fire")
  var randomSpeed = Math.floor(Math.random() * 600)+200;  
  ball = new Ball({ scene: this, x: cannon.x + 130, y: cannon.y - 50 });
  balls.push(ball);

  for (var i = 0; i < balls.length; i++) {
    this.physics.velocityFromRotation(angle, randomSpeed, ball.body.velocity);
  }

  if (balls.length === 50) {
    timedEvent.remove(true);
    console.log(trainingData)
  }

  console.log(randomSpeed)
}

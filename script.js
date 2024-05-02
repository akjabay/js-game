var w = window.innerWidth,
		h = window.innerHeight;
var game = new Phaser.Game(
	w, h, Phaser.AUTO, 'game',
	{ preload: preload, create: create, update: update, render: render }
);

var slashAudio = new Audio('./static/slash-21834.mp3');
var gameoverAudio = new Audio('./static/failure-drum-sound-effect-2-7184.mp3');

		
function preload() {
	var bmd0 = game.add.bitmapData(120,120);
	bmd0.ctx.drawImage(document.getElementById('source0'), 0, 0);
	game.cache.addBitmapData('good0', bmd0);
	var bmd1 = game.add.bitmapData(120,120);
	bmd1.ctx.drawImage(document.getElementById('source1'), 0, 0);
	game.cache.addBitmapData('good1', bmd1);
	var bmd2 = game.add.bitmapData(120,120);
	bmd2.ctx.drawImage(document.getElementById('source2'), 0, 0);
	game.cache.addBitmapData('good2', bmd2);
	var bmd3 = game.add.bitmapData(120,120);
	bmd3.ctx.drawImage(document.getElementById('source3'), 0, 0);
	game.cache.addBitmapData('good3', bmd3);
	var bmd4 = game.add.bitmapData(120,120);
	bmd4.ctx.drawImage(document.getElementById('source4'), 0, 0);
	game.cache.addBitmapData('good4', bmd4);
	var bmd5 = game.add.bitmapData(120,120);
	bmd5.ctx.drawImage(document.getElementById('source5'), 0, 0);
	game.cache.addBitmapData('good5', bmd5);
	var bmd6 = game.add.bitmapData(120,120);
	bmd6.ctx.drawImage(document.getElementById('source6'), 0, 0);
	game.cache.addBitmapData('good6', bmd6);
	var bmd7 = game.add.bitmapData(120,120);
	bmd7.ctx.drawImage(document.getElementById('source7'), 0, 0);
	game.cache.addBitmapData('good7', bmd7);
	var bmd8 = game.add.bitmapData(120,120);
	bmd8.ctx.drawImage(document.getElementById('source8'), 0, 0);
	game.cache.addBitmapData('good8', bmd8);
	var bmd9 = game.add.bitmapData(120,120);
	bmd9.ctx.drawImage(document.getElementById('source9'), 0, 0);
	game.cache.addBitmapData('good9', bmd9);
	var bmd10 = game.add.bitmapData(120,120);
	var bmd = game.add.bitmapData(120,120);
	bmd.ctx.drawImage(document.getElementById('source-1'), 0, 0);
	game.cache.addBitmapData('bad', bmd);

	// game.load.image('emitter', './static/bg.jpg');

}

var good_objects = {},
bad_objects,
slashes,
line,
emitter,
scoreLabel,
score = 0,
points = [];	

var fireRate = 1000;
var nextFire = 0;


function create() {

	game.stage.backgroundColor = "#7F6BF1";

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.physics.arcade.gravity.y = 300;

	good_objects[0] = createGroup(4, game.cache.getBitmapData('good0'));
	good_objects[1] = createGroup(4, game.cache.getBitmapData('good1'));
	good_objects[2] = createGroup(4, game.cache.getBitmapData('good2'));
	good_objects[3] = createGroup(4, game.cache.getBitmapData('good3'));
	good_objects[4] = createGroup(4, game.cache.getBitmapData('good4'));
	good_objects[5] = createGroup(4, game.cache.getBitmapData('good5'));
	good_objects[6] = createGroup(4, game.cache.getBitmapData('good6'));
	good_objects[7] = createGroup(4, game.cache.getBitmapData('good7'));
	good_objects[8] = createGroup(4, game.cache.getBitmapData('good8'));
	good_objects[9] = createGroup(4, game.cache.getBitmapData('good9'));
	bad_objects = createGroup(4, game.cache.getBitmapData('bad'));

	slashes = game.add.graphics(0, 0);

	scoreLabel = game.add.text(10,10,'Tip: Stay with Monad :)!');
	scoreLabel.fill = 'white';

	emitter = game.add.emitter(0, 0, 300);
	emitter.makeParticles('parts');
	// var particles = game.add.particles('emitter');
	// var emitter = particles.createEmitter();
	emitter.gravity = 300;
	emitter.setYSpeed(-400,400);

	var rand = Math.floor(Math.random()*10);
	throwObject(rand);

}

function createGroup (numItems, sprite) {
	var group = game.add.group();
	group.enableBody = true;
	group.physicsBodyType = Phaser.Physics.ARCADE;
	group.createMultiple(numItems, sprite);
	group.setAll('checkWorldBounds', true);
	group.setAll('outOfBoundsKill', true);
	return group;
}

function throwObject(rand) {
	if (game.time.now > nextFire && bad_objects.countDead() > 0 && good_objects[rand].countDead()>0) {
		nextFire = game.time.now + fireRate;
		throwGoodObject(rand);
		if (Math.random()>.5) {
			throwBadObject();
		}
	}
}

function throwGoodObject(rand) {
	var obj = good_objects[rand].getFirstDead();
	obj.reset(game.world.centerX + Math.random()*100-Math.random()*100, 600);
	obj.anchor.setTo(0.5, 0.5);
	obj.body.angularAcceleration = 100;
	game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, 530);
}

function throwBadObject() {
	var obj = bad_objects.getFirstDead();
	obj.reset(game.world.centerX + Math.random()*100-Math.random()*100, 600);
	obj.anchor.setTo(0.5, 0.5);
	//obj.body.angularAcceleration = 100;
	game.physics.arcade.moveToXY(obj, game.world.centerX, game.world.centerY, 530);
}

function update() {
	var rand = Math.floor(Math.random()*10);
	throwObject(rand);
	
	points.push({
		x: game.input.x,
		y: game.input.y
	});
	points = points.splice(points.length-10, points.length);
	//game.add.sprite(game.input.x, game.input.y, 'hit');
	
	if (points.length<1 || points[0].x==0) {
		return;
	}
	
	slashes.clear();
	slashes.beginFill(0xFFFFFF);
	slashes.alpha = .5;
	slashes.moveTo(points[0].x, points[0].y);
	for (var i=1; i<points.length; i++) {
		slashes.lineTo(points[i].x, points[i].y);
	} 
	slashes.endFill();
	
	for(var i = 1; i< points.length; i++) {
		line = new Phaser.Line(points[i].x, points[i].y, points[i-1].x, points[i-1].y);
		game.debug.geom(line);

		good_objects[rand].forEachExists(checkIntersects);
		bad_objects.forEachExists(checkIntersects);
	}
}

var contactPoint = new Phaser.Point(0,0);

function checkIntersects(fruit, callback) {
	var l1 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom - fruit.height, fruit.body.right, fruit.body.bottom);
	var l2 = new Phaser.Line(fruit.body.right - fruit.width, fruit.body.bottom, fruit.body.right, fruit.body.bottom-fruit.height);
	l2.angle = 90;

	if(Phaser.Line.intersects(line, l1, true) ||
		 Phaser.Line.intersects(line, l2, true)) {

		contactPoint.x = game.input.x;
		contactPoint.y = game.input.y;
		var distance = Phaser.Point.distance(contactPoint, new Phaser.Point(fruit.x, fruit.y));

		console.log(distance, 'distance')
		if (distance > 130) {
			return;
		}

		if (
			fruit.parent == good_objects[0] ||
			fruit.parent == good_objects[1] ||
			fruit.parent == good_objects[2] ||
			fruit.parent == good_objects[3] ||
			fruit.parent == good_objects[4] ||
			fruit.parent == good_objects[5] ||
			fruit.parent == good_objects[6] ||
			fruit.parent == good_objects[7] ||
			fruit.parent == good_objects[8] ||
			fruit.parent == good_objects[9]
		) {
			killFruit(fruit);
			slashAudio.play();
		} else {
			resetScore();	
			gameoverAudio.play();
		}
	}

}

async function resetScore() {

	var highscore = Math.max(score, localStorage.getItem("highscore"));
	localStorage.setItem("highscore", highscore);

	good_objects[0].forEachExists(killFruit);
	good_objects[1].forEachExists(killFruit);
	good_objects[2].forEachExists(killFruit);
	good_objects[3].forEachExists(killFruit);
	good_objects[4].forEachExists(killFruit);
	good_objects[5].forEachExists(killFruit);
	good_objects[6].forEachExists(killFruit);
	good_objects[7].forEachExists(killFruit);
	good_objects[8].forEachExists(killFruit);
	good_objects[9].forEachExists(killFruit);

	bad_objects.forEachExists(killFruit);

	score = 0;
	scoreLabel.text = 'Game Over!\nHigh Score: '+highscore;
	// Retrieve

	await new Promise(resolve => setTimeout(resolve, 500));

	alert('You are Purged :)')

}

function render() {
}

function killFruit(fruit) {

	emitter.x = fruit.x;
	emitter.y = fruit.y;
	emitter.start(true, 2000, null, 4);
	fruit.kill();
	points = [];
	score++;
	scoreLabel.text = 'Score: ' + score;
}

import React from 'react';
import ReactDOM from 'react-dom';
import p2 from 'p2';

const radius = 9,
	img_width = 24;

var width = 72,
	height = 330,
	speed = 500,
	jarHeight = 0,
	jarWidth = 0;

var base_image = new Image();


class Canvas extends React.Component {
	static state = {
		time: 0
	};
	componentDidMount = () => {
		this.ctx = ReactDOM.findDOMNode(this).getContext('2d');
		requestAnimationFrame(this.tick.bind(this));
	}

	tick = (time) => {
		requestAnimationFrame(this.tick);

		if (this.state !== null && this.state.time !== 0) {
			const dt = (time - this.state.time) / 1000;
			this.props.draw(this.ctx, dt);
		}

		this.setState({
			time
		});
	}

	render() {
		return <canvas width={ this.props.width } height={ this.props.height } />;
	}
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function box(width, height, world, ballShapes) {
	const top = new p2.Body({
		position: [0, -jarHeight / 2],
		angle: 0
	});

	const bottom = new p2.Body({
		position: [0, -jarHeight / 2],
		angle: 0
	});

	/*const bottom = new p2.Body({
		position: [0, jarHeight / 2],
		angle: Math.PI
	});*/

	const left = new p2.Body({
		position: [(width/2)+(-jarWidth / 2)-5, -30],
		angle: -Math.PI / 2
	});

	const side_left = new p2.Body({
		position: [-width/2, 0],
		angle: -Math.PI / 2
	});
	const side_right = new p2.Body({
		position: [width*2, 0],
		angle: Math.PI / 2
	});

	const right = new p2.Body({
		position: [(width/2)+(jarWidth / 2)+5, -30],
		angle: Math.PI / 2
	});

	const sides = [top, left, right, bottom];

	var sideShapes = [];

	 
	var side_left_sideShape = new p2.Plane(),
		side_right_sideShape = new p2.Plane();
	
	side_left_sideShape.material = new p2.Material();
	side_right_sideShape.material = new p2.Material();
	side_left.addShape(side_left_sideShape);
	side_right.addShape(side_right_sideShape);

	world.addBody(side_left);
	sideShapes.push(side_left_sideShape)

	world.addBody(side_right);
	sideShapes.push(side_right_sideShape)

	for (let side of sides) {
		if(side.angle===0) {
			var sideShape = new p2.Plane();
		}
		else if(side.angle===0.1) {
			var sideShape = new p2.Plane();
		}
		else {
			console.log(side.angle);
			var sideShape = new p2.Box({ width: jarHeight-30, height: 5 });
		}
		//
		
		sideShape.material = new p2.Material();

		

		side.addShape(sideShape);
		world.addBody(side);
		sideShapes.push(sideShape)


	}
	return {
		sides: sides,
		sideShapes: sideShapes
	};
}

function drawBox(ctx, x, y, width, height) {
	ctx.moveTo(-width / 2 + x, -height / 2 + y);
	ctx.lineTo(width / 2 + x, -height / 2 + y);
	ctx.stroke();

	ctx.moveTo(-width / 2 + x, height / 2 + y);
	ctx.lineTo(width / 2 + x, height / 2 + y);
	ctx.stroke();

	ctx.moveTo(-width / 2 + x, -height / 2 + y);
	ctx.lineTo(-width / 2 + x, height / 2 + y);
	ctx.stroke();

	ctx.moveTo(width / 2 + x, -height / 2 + y);
	ctx.lineTo(width / 2 + x, height / 2 + y);
	ctx.stroke();
}

class Overlay extends React.Component {
	constructor(props) {
		super(props);
		const world = new p2.World({
			gravity: [0, -200],
		});
		var ballShapes = [],
			balls = []
		var enablePositionNoise = true,
			N = 0,
			M = 15,
			r = radius,
			d = 2.2;
		world.overlapKeeper.recordPool.resize(16);
		world.narrowphase.contactEquationPool.resize(1024);
		world.narrowphase.frictionEquationPool.resize(1024);
		this.count = props.count;
		width = parseInt(props.boxWidth);
		height = parseInt(props.boxHeight);
		jarHeight = height - 20;
		jarWidth = width - 20;
		base_image.src = require(`${this.props.img}`);
		const sdata = box(width, height, world, ballShapes)
		var sides = sdata.sides,
			sideShapes = sdata.sideShapes

		this.world = world;
		this.balls = balls;
		this.sideShapes = sideShapes;
		this.sides = sides;
		this.images = []
		for (var i = 0; i < parseInt(this.count); i++) {
			this.add();
		}

	}

	paint(ctx, dt) {
		ctx.clearRect(-width*2, -height*2, width*3, height*2);
		ctx.save();
		ctx.fillStyle = "rgb(0,255,0)";
		ctx.fillRect(0, 0, width*3, height*2);
		//ctx.lineWidth = 0;
		
		ctx.translate(width / 2, height / 2);
		ctx.scale(1, 1);


		this.world.step(1 / 60, dt);
		ctx.beginPath();
		for (var i = 0; i < this.balls.length; i++) {
			var ball = this.balls[i]
			ctx.moveTo(ball.position[0], ball.position[1]);
			ctx.drawImage(base_image, ball.position[0] - (img_width - (img_width - (radius))), -(ball.position[1] + (img_width)), img_width, img_width);
		}

		/*for (var i = 0; i < this.sides.length; i++) {
			var side = this.sides[i]
			ctx.moveTo(side.position[0], side.position[1]);
			ctx.lineTo(side.position[0]+side.position[0].width, side.position[1]+side.position[0].height);
			//ctx.drawImage(base_image, ball.position[0] - (img_width - (img_width - (radius))), -(ball.position[1] + (img_width)), img_width, img_width);
		}*/


		ctx.stroke();
		ctx.restore();
	}
	
	add() {
		var enablePositionNoise = true,
			N = 0,
			M = 15,
			r = radius,
			d = 2.2,
			world = this.world;

		
		//var y = height / 2;
		//var x = width/2;
		//var x = getRandomArbitrary(width/2-r, width/2+r);
		var x = width/2+(getRandomArbitrary(1,3));
		var y = height/2;
		var p = new p2.Body({
			mass: 1,
			position: [x, y],
		});
		var ballShape = new p2.Circle({
			radius: radius
		});
		ballShape.material = new p2.Material();

		p.addShape(ballShape);
		p.allowSleep = true;
		p.sleepSpeedLimit = 1;
		p.sleepTimeLimit = 1;
		world.addBody(p);
		this.balls.push(p)
		for (let i = 0; i < this.sideShapes.length; i++) {
			this.world.addContactMaterial(new p2.ContactMaterial(
				this.sideShapes[i].material,
				ballShape.material, {
					restitution: 0.2,
					stiffness: Number.MAX_VALUE
				}
			));
		}
	}

	render() {
		return <div id="overlay"><Canvas width={ 320 } height={ 480 } draw={ this.paint.bind(this) } /></div>;
	}
}

export default Overlay;
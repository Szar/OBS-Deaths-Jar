import React from 'react';
import ReactDOM from 'react-dom';
import Overlay from './Overlay';
import './style.scss';

var coinImg = "./images/serious-face-with-symbols-covering-mouth_1f92c.png",
	jarImg  = "./images/glass-pint.png"

class App extends React.Component {
	constructor(props, context) {
		super(props, context);
		this.state = {
			count: 0
		}
		this.jar = require(`${jarImg}`);
		this.coin = require(`${coinImg}`);
		this.canvasRef = React.createRef();
		this.update = this.update.bind(this)
		this.add = this.add.bind(this)
		this.count = 0;
		
	}
	componentDidMount() {
		setInterval(()=>{
			this.updateCount();
		}, 3000);
	}
	readTextFile = (file, cb) => {
		var rawFile = new XMLHttpRequest();
		rawFile.open("GET", file, false);
		rawFile.onreadystatechange = () => {
			if (rawFile.readyState === 4) {
				if (rawFile.status === 200 || rawFile.status == 0) {
					cb(rawFile.responseText);
				}
			}
		};
		rawFile.send(null);
	};

	sleep(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	};

	update(count) {
		if(count>this.count) {
			var diff = count - this.count;
			for(let i = 0; i<diff; i++) {
				this.add();
				this.sleep(400);
			}
			this.sleep(400);
		}
		this.setState({
			count: this.count
		})
	}
	updateCount() {
		var file = require("./counter.txt");
		this.readTextFile(file, (txt)=>{
			var count = parseInt(txt);
			this.update(count)
		});
	}
	
	add() {
		this.count = this.count+1;
		this.canvasRef.current.add()
	}
	
	render() {
		return (
			<div id="counter">
				<div id="jar">
					<img src={this.jar} onClick={ ()=>{ this.add(); this.setState({count: this.count});} } />
					<Overlay ref={this.canvasRef} count={this.state.count} boxWidth="100" boxHeight="263" img={coinImg}/>
				</div>
				
				<div id="count">{this.state.count}</div>
				
			</div>
		);
	}
}

export default App;

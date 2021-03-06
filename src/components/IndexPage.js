/**
 * Created by Schwerve on 1/30/2017.
 */
import React from 'react';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import ScoreButtons from './ScoreButtons';
import Sheep from './Sheep';

export default class IndexPage extends React.Component {
	constructor(props) {
		super();

		this.state = {
			scores: [0,0,0],
			names: ["","",""],
			sheepEnabled: false,
			numOfPeople: 3,
			remainingSheep: [0,0,1,1,1,1,2,2,2,2,2,3,3,3,3,3,4,4],
			subSheepArray: [[],[],[]]
		}
	}

	nameUpdate(newName, i) {
		var namesArr = this.state.names;
		namesArr[i] = newName;
		this.setState({
			names: namesArr
		});
		this.forceUpdate();
	}

	scoreUpdate(newScore, i) {
		var scoresArr = this.state.scores;
		scoresArr[i] = newScore;
		this.setState({
			scores: scoresArr
		})
	}

	addPerson() {
		//TODO: Rename stuff
		var namesArr = this.state.names;
		namesArr.push("");

		var scoresArr = this.state.scores;
		scoresArr.push(0);

		var subSheepArr = this.state.subSheepArray;
		subSheepArr.push([]);
		
		var currentNum = this.state.numOfPeople;

		this.setState({
			numOfPeople: currentNum+1,
			names: namesArr,
			scores: scoresArr,
			subSheepArray: subSheepArr
		});
	}

	openLink() {
		window.open("https://github.com/lsweatman/CarcassonneScoreboard");
	}

	//TODO: Move this back to sheep.js
	toggleSheep() {
		var currentSheepState = this.state.sheepEnabled;
		this.setState({
			sheepEnabled: !currentSheepState
		});
	}
	
	returnSheep(array) {
		var currentSheep = this.state.remainingSheep;
		array.map((index) => {
			this.state.remainingSheep.push(index);
		},this);
	}

	handleSheepGenerate(i) {
		if (this.state.remainingSheep.length == 0) {
			window.alert("All sheep used. Gather only");
		}
		else {
			var randomVal = Math.floor(Math.random() * this.state.remainingSheep.length);
			
			if (this.state.remainingSheep[randomVal] !== 0) {
				var subSheepUpdater = this.state.subSheepArray;

				subSheepUpdater[i].push(this.state.remainingSheep[randomVal]);

				var updateRemaining = this.state.remainingSheep;
				updateRemaining.splice(randomVal, 1);
				
				this.setState({
					subSheepArray: subSheepUpdater,
					remainingSheep: updateRemaining
				});
			}
			else {
				window.alert("A wolf has eaten your flock!");
				this.returnSheep(this.state.subSheepArray[i]);

                var subSheepWiper = this.state.subSheepArray;
                subSheepWiper[i] = [];

				this.setState({
					subSheepArray: subSheepWiper
				});
			}
		}
	}

	handleSheepGather(i) {
		var totalSheep = this.state.subSheepArray[i].reduce((a, b) => a + b, 0);
		var updateScoreArr = this.state.scores;
		updateScoreArr[i] = totalSheep + updateScoreArr[i];
		
        this.returnSheep(this.state.subSheepArray[i]);
        var subSheepWiper = this.state.subSheepArray;
        subSheepWiper[i] = [];

        this.setState({
            subSheepArray: subSheepWiper,
			scores: updateScoreArr
        });
	}

	removePerson(i) {
		var namesArr = this.state.names;
		namesArr.splice(i, 1);

		var scoresArr = this.state.scores;
		scoresArr.splice(i, 1);

		var subSheepArr = this.state.subSheepArray;
		subSheepArr.splice(i, 1);

		var currentNum = this.state.numOfPeople;
		this.setState({
			numOfPeople: currentNum-1,
			names: namesArr,
			scores: scoresArr,
            subSheepArray: subSheepArr
		});
	}

	eachPerson(score, i) {
		return (
			<ScoreButtons key={i}
						  index={i}
						  onRemove={this.removePerson.bind(this)}
						  nameChange={this.nameUpdate.bind(this)}
						  scoreChange={this.scoreUpdate.bind(this)}
						  indivName={this.state.names[i]}
						  indivScore={this.state.scores[i]}/>
		)
	}

	eachSheepPerson(score, i) {
		return (
			<Sheep key={i}
				   index={i}
				   indivName={this.state.names[i]}
				   nameChange={this.nameUpdate.bind(this)}
				   scoreChange={this.scoreUpdate.bind(this)} 
				   remainingSheep={this.state.remainingSheep} 
				   returnSheep={this.returnSheep.bind(this)}
				   handleGenerate={this.handleSheepGenerate.bind(this)}
				   handleGather={this.handleSheepGather.bind(this)}
				   subSheepArray={this.state.subSheepArray[i]}/>
		)
	}

	wipeScores() {
		var userChoice = confirm("Are you sure you want to wipe all scores?");
		if (userChoice == true) {
			var i;
			for (i = 0; i < this.state.subSheepArray.length; i++){
				this.returnSheep(this.state.subSheepArray[i]);
			}
			var subSheepWiper = Array(this.state.scores.length).fill().map(()=> []);

			var test = Array.apply(null, Array(this.state.scores.length)).map(Number.prototype.valueOf,0);
			console.log(test);
			this.setState({
				scores: test,
				subSheepArray: subSheepWiper
			});
		}
	}

	renderWithSheep() {
		return (
			<div className="subboard">
				{this.state.names.map(this.eachPerson, this)}
				<div className="sheep-div">
					{this.state.names.map(this.eachSheepPerson, this)}
				</div>
			</div>
		)
	}
	
	render() {
		if(this.state.sheepEnabled){
			return(
				<div className="board">

					{this.renderWithSheep()}

					<div className="misc-div">
						<Button className="btn btn-sm btn-success misc-buttons"
								onClick={this.addPerson.bind(this)}>
							<Glyphicon glyph="glyphicon glyphicon-plus"/>
						</Button>

						<Button className="btn btn-sm btn-info misc-buttons sheep-icon"
								onClick={this.toggleSheep.bind(this)}>
						</Button>

						<Button className="btn btn-sm btn-danger misc-buttons"
								onClick={this.wipeScores.bind(this)}>
							<Glyphicon glyph="glyphicon glyphicon-repeat"/>
						</Button>
					</div>

					<button className="footer-pin"
							onClick={this.openLink.bind(this)}>
						View on GitHub
					</button>

				</div>
			)
		}
		else {
			return (
				<div className="board">
					{this.state.names.map(this.eachPerson, this)}

					<div className="misc-div">
						<Button className="btn btn-sm btn-success misc-buttons"
								onClick={this.addPerson.bind(this)}>
							<Glyphicon glyph="glyphicon glyphicon-plus"/>
						</Button>

						<Button className="btn btn-sm btn-info misc-buttons sheep-icon"
								onClick={this.toggleSheep.bind(this)}>
						</Button>

						<Button className="btn btn-sm btn-danger misc-buttons"
								onClick={this.wipeScores.bind(this)}>
							<Glyphicon glyph="glyphicon glyphicon-repeat"/>
						</Button>
					</div>

					<button className="footer-pin"
							onClick={this.openLink.bind(this)}>
						View on GitHub
					</button>

				</div>
			)
		}
	}
}
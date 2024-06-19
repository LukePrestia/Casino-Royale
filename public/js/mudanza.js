const accountUpDate = () => compte.innerText = account + " $";
const reinit = () => {
	for(var j=0; j<boxes.length; j++){
		while (boxes[j].firstChild) {
			boxes[j].removeChild(boxes[j].lastChild);
		}
		boxes[j].innerHTML = valueBoxes[j];
		boxes[j].setAttribute("bet", 0);
	}
	output.innerHTML = "?";
	output.style.backgroundColor = "green";
	currentlyBet = 0;
	even = odd = 0;
	red = black = 0;
	outRow = row1 = row2 = row3 = 0;
	select1_12 = select1_18 = select13_24 = select19_36 = select25_36 = 0;
	tempAccount = account;
	betUpDate();	
	
};
const start = (result) => {
	out = result
	check();
	output.innerText = out;
	output.style.backgroundColor = outColor;
	finish.style.display = "flex";
	setTimeout(function() { 
		finish.style.display = "none";
		accountUpDate();
		reinit();
		run = false;
	}, 3000);
	
};

const check = () => {
	for(let i=0; i<nbrs.length; i++){
		let bet = parseInt(nbrs[i].getAttribute("bet"));
		let nbr = parseInt(nbrs[i].getAttribute("nums"));
		if(out==nbr){
			account += 36*bet;
			outRow = parseInt(nbrs[i].getAttribute("row"));
			nbrs[i].style.backgroundColor = "blue";
			setTimeout(function() { 
				nbrs[i].style.backgroundColor = outColor;
			}, 3000);
		}
    }
}
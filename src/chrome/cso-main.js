
var badQuestionPatterns = [
	/document\.write/,
	/beginner/, /newbie/, /plz/i, /please/i, /\bsir\b/i, /urgent/i, /bear with me/i,
	/bootstrap/i, /carousel/i
];
var probablyBadQuestionPatterns = [
	/not working/i,
	/thanks/i, /help/i
];


// --------------------------------------------
// utils
// --------------------------------------------
HTMLElement.prototype.prepend = function(node){
	this.insertBefore(node, this.childNodes[0]);
}

// --------------------------------------------
// info display
// --------------------------------------------
var chromosoLog = document.createElement("div");
chromosoLog.id = "chromoso-log";
document.body.prepend(chromosoLog);
function log(h, t){
	if (!t) t = 13000;
	var e = document.createElement("div");
	e.innerHTML = h;
	chromosoLog.prepend(e);
	setTimeout(function(){
		e.className = "chromoso-dying";
	}, t);
	setTimeout(function(){
		e.remove();
	}, t+3000);
}

if (document.getElementById('questions')) { // we're in a questions page
	
	log("Chromoso questions filtering is ON", 4000);

	// --------------------------------------------
	// 
	// --------------------------------------------

	// --------------------------------------------
	// removing the ad pushing away the questions
	// --------------------------------------------
	var ad = document.querySelector('.everyonelovesstackoverflow'); // yes, only the first one is bad
	if (ad) {
		ad.style.display='none';
		log("killed painful ad");
	}

	// --------------------------------------------
	// removing or flagging bad questions
	// making question links open in _blank
	// --------------------------------------------
	function visitSummaryNode(node){
		var text = node.textContent;
		var link = node.querySelector('.question-hyperlink');
		link.target = "_blank";
		console.log("checking question ", node.id.split('-').pop());
		for (var k=0; k<badQuestionPatterns.length; k++) {
			if (badQuestionPatterns[k].test(text)) {
				setTimeout(function(){
					link.title = "Trigger: " + badQuestionPatterns[k];
					log("killed question " + link.outerHTML);
					node.remove();
				}, 0);
				return;
			}
		}
		for (var k=0; k<probablyBadQuestionPatterns.length; k++) {
			if (probablyBadQuestionPatterns[k].test(text)) {
				var warningDiv = document.createElement("div");
				warningDiv.className = "chromoso-warning";
				warningDiv.appendChild(document.createTextNode("warning: "+probablyBadQuestionPatterns[k]));
				node.prepend(warningDiv);
				return;
			}
		}
	}

	// removing the questions initially in the page
	[].forEach.call(document.querySelectorAll('#questions .question-summary'), visitSummaryNode);

	// removing new questions in the flow
	(new MutationObserver(function(mutations){
		for (var i=0; i<mutations.length; i++) {
			var nodes = mutations[i].addedNodes;
			if (!nodes || !nodes.length) continue;
			for (var j=0; j<nodes.length; j++) {
				var	node = nodes[j];
				if (!/\bquestion-summary\b/.test(node.className)) continue;
				visitSummaryNode(node);
			}
		}
	})).observe(document.getElementById('questions'), {childList:true});
	
}

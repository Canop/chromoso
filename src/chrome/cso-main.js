
// --------------------------------------------
// removing the ad pushing away the questions
// --------------------------------------------
var ad = document.querySelector('.everyonelovesstackoverflow'); // yes, only the first one is bad
if (ad) {
	ad.style.display='none';
	console.log("Chromoso: killed ad");
}

// --------------------------------------------
// removing or flagging bad questions
// --------------------------------------------
var badQuestionPatterns = [
	/document\.write/,
	/beginner/, /newbie/, /plz/i, /please/i, /\bsir\b/i, /urgent/i
];
var probablyBadQuestionPatterns = [
	/not working/i, 
	/bootstrap/i
];
function checkSummaryNode(node){
	var text = node.textContent;
	console.log("checking question ", node.id.split('-').pop());
	for (var k=0; k<badQuestionPatterns.length; k++) {
		if (badQuestionPatterns[k].test(text)) {
			setTimeout(function(){
				console.log("killed question", text);
				node.remove();
			}, 0);
			return;
		}
	}
	for (var k=0; k<probablyBadQuestionPatterns.length; k++) {
		if (probablyBadQuestionPatterns[k].test(text)) {
			var warningDiv = document.createElement("div");
			warningDiv.appendChild(document.createTextNode("warning: "+probablyBadQuestionPatterns[k]));
			warningDiv.setAttribute('style', "position:absolute;left:20px;top:-2px;z-index:24;color:red;");
			node.style.position = "relative";
			node.insertBefore(warningDiv, node.childNodes[0]);
			return;
		}
	}
}

// removing the questions initially in the page
[].forEach.call(document.querySelectorAll('#questions .question-summary'), checkSummaryNode);

// removing new questions in the flow
(new MutationObserver(function(mutations){
	for (var i=0; i<mutations.length; i++) {
		var nodes = mutations[i].addedNodes;
		if (!nodes || !nodes.length) continue;
		for (var j=0; j<nodes.length; j++) {
			var	node = nodes[j];
			if (!/\bquestion-summary\b/.test(node.className)) continue;
			checkSummaryNode(node);
		}
	}
})).observe(document.getElementById('questions'), {childList:true});

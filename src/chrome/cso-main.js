
var ad = document.querySelector('.everyonelovesstackoverflow');
if (ad) {
	ad.style.display='none';
	console.log("Chromoso: killed ad");
}

var badQuestionPatterns = [
	/document\.write/
];
(new MutationObserver(function(mutations){
	for (var i=0; i<mutations.length; i++) {
		var nodes = mutations[i].addedNodes;
		if (!nodes || !nodes.length) continue;
		for (var j=0; j<nodes.length; j++) {
			var	node = nodes[j];
			if (!/\bquestion-summary\b/.test(node.className)) continue;
			var text = node.textContent;
			console.log("checking question ", node.id.split('-').pop());
			for (var k=0; k<badQuestionPatterns.length; k++) {
				if (badQuestionPatterns[k].test(text)) {
					console.log("killed question", text);
					node.remove();
				}
			}
		}
	}
})).observe(document.getElementById('questions'), {childList:true});

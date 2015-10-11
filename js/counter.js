var searchOpt = document.getElementById("searchOpt");
var defaultSearch = localStorage.getItem("defaultSearch");
var searchMap = {
	"Google":{url: "https://www.google.com.tw/search", keyword:"q"},
	"Scholar":{url: "https://scholar.google.com.tw/scholar", keyword:"q"},
	"PubMed":{url: "http://www.ncbi.nlm.nih.gov/pubmed/", keyword:"term"}
};
var birthday;
var showDayOfLife = true;

chrome.storage.sync.get(function(data) {
	if (data.hasOwnProperty('birthday')) {
		birthday = new Date(data.birthday);
		setInterval(counting, 50);
		if(!data.dayOfLifeChk){
			document.getElementById('lifeLabel').style.display = 'none';
			showDayOfLife = false;
		}
		if(data.searchChk){
			initialVoiceSearch();
			if(defaultSearch)searchOpt.value = defaultSearch;
			searchOpt.addEventListener("change", changeChk);
			changeChk();
		}else{
			document.getElementById('searchForm').style.display = 'none';
		}
		if(!data.optionChk)document.getElementById('optionLink').style.display = 'none';
	}else{
		location.href = 'options.html';
	}
});


function counting(){
	var diff = new Date() - birthday;
	var diffYear = diff / 31556900000;
	var numHead = parseInt(diffYear).toString();
	var numTail = diffYear.toString().substr(numHead.length, numHead.length + 8);
	
	if(showDayOfLife)document.getElementById("lifeDay").innerHTML = Math.round(diff / (1000*60*60*24));
	document.getElementById("numHead").innerHTML = numHead;
	document.getElementById("numTail").innerHTML = numTail;
}

function changeChk(){
	localStorage.setItem("defaultSearch", searchOpt.value);
	var searchObj = searchMap[searchOpt.value];
	document.getElementById("searchForm").action = searchObj.url;
	document.getElementById("keyword").name = searchObj.keyword;
}
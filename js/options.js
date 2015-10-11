var birthdayInput = document.getElementById("birthday");
var dayOfLifeChk = document.getElementById("dayOfLifeChk");
var searchChk = document.getElementById("searchChk");
var optionChk = document.getElementById("optionChk");

chrome.storage.sync.get(function(data) {
	if (data.hasOwnProperty('birthday')) {
		birthdayInput.value = data.birthday;
		dayOfLifeChk.checked = data.dayOfLifeChk;
		searchChk.checked = data.searchChk;
		optionChk.checked = data.optionChk;
	}
});


function saveSetting(){
	var birthday = new Date(birthdayInput.value);
	if(isNaN(birthday.getTime())){ //invalid input
		//do somthig alert
	}else{
		chrome.storage.sync.set({
			birthday: birthdayInput.value,
			dayOfLifeChk: dayOfLifeChk.checked,
			searchChk: searchChk.checked,
			optionChk: optionChk.checked
			
		}, function() {
			location.href = 'tab.html';
        });
	}
}
birthdayInput.addEventListener('keydown', function(e) {
	if (e.keyCode === 13) { //KEY_ENTER
		saveSetting();
	}
}, false);

document.getElementById("saveBtn").addEventListener("click", saveSetting);
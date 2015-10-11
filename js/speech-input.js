/*global webkitSpeechRecognition */

function initialVoiceSearch() {
	'use strict';

	if (! ('webkitSpeechRecognition' in window) ) return;

	var talkMsg = 'Listening...';
	var patience = 3;

	function capitalize(str) {
		return str.length ? str[0].toUpperCase() + str.slice(1) : str;
	}

	var speechInputWrappers = document.getElementsByClassName('si-wrapper');

	[].forEach.call(speechInputWrappers, function(speechInputWrapper) {
		// find elements
		var inputEl = speechInputWrapper.querySelector('.si-input');
		var micBtn = speechInputWrapper.querySelector('.si-btn');

		// size and position them
		var inputHeight = inputEl.offsetHeight;
		var inputRightBorder = parseInt(getComputedStyle(inputEl).borderRightWidth, 10);
		var buttonSize = 0.8 * inputHeight;
		micBtn.style.top = 0.1 * inputHeight + 'px';
		micBtn.style.height = micBtn.style.width = buttonSize + 'px';
		inputEl.style.paddingRight = buttonSize - inputRightBorder + 'px';
		speechInputWrapper.appendChild(micBtn);

		// setup recognition
		var finalTranscript = '';
		var tmpTranscript = '';
		var recognizing = false;
		var timeout;
		var oldPlaceholder = null;
		var recognition = new webkitSpeechRecognition();
		recognition.continuous = true;
		recognition.interimResults = true;

		function startSearch(){
			if(document.getElementById('keyword').value != ''){
				document.getElementById('searchForm').submit();				
			}
		}
		
		function restartTimer() {
			timeout = setTimeout(function() {
				recognition.stop();
			}, patience * 1000);
		}

		function click2Stop(e) {
			 if (e.target === document.body) {
				recognition.stop();
			}
		}
		
		recognition.onstart = function() {
			oldPlaceholder = inputEl.placeholder;
			inputEl.placeholder = talkMsg;
			recognizing = true;
			micBtn.classList.add('listening');
			document.body.style.backgroundColor = "black";
			document.body.addEventListener('click', click2Stop);
			restartTimer();
		};

		recognition.onend = function() {
			document.body.style.backgroundColor = "white";
			recognizing = false;
			clearTimeout(timeout);
			micBtn.classList.remove('listening');
			if (oldPlaceholder !== null) inputEl.placeholder = oldPlaceholder;
			document.body.removeEventListener('click', click2Stop);
			startSearch();
		};

		recognition.onresult = function(event) {
			clearTimeout(timeout);
			for (var i = event.resultIndex; i < event.results.length; ++i) {
				if (event.results[i].isFinal) {
					tmpTranscript = '';
					finalTranscript += event.results[i][0].transcript;
				}else{
					tmpTranscript = event.results[i][0].transcript;
				}
			}
			finalTranscript = capitalize(finalTranscript);
			inputEl.value = finalTranscript + tmpTranscript;
			restartTimer();
		};

		micBtn.addEventListener('click', function(event) {
			event.preventDefault();
			if (recognizing) {
				recognition.stop();
				return;
			}
			inputEl.value = finalTranscript = '';
			recognition.start();
		}, false);
	});
}
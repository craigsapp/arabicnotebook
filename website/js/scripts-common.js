//
// Programmer:		Craig Stuart Sapp <craig@ccrma.stanford.edu>
// Creation Date:	Sun Oct  5 00:53:24 PDT 2014
// Last Modified:	Tue Oct  7 14:56:01 PDT 2014
// Filename:		.../js/scripts-common.js
// Web Address:	http://arabic.sapp.org/js/scripts-common.js
// Syntax:			JavaScript 1.8/ECMAScript 5
// vim:				ts=3: ft=javascript
//
// Description:	JavaScript functions common to scripts on all pages.
//

// GLOBAL VARIABLES:
var WORDLISTS;		// Vocabulary lists in JSON format.
var BASEADDR	= window.location.host;

// List of Key Codes.  More can be extracted from this page:
// http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes
const AKey				= 65; // Letters
const CKey				= 67;
const DKey				= 68;
const EKey				= 69;
const FKey				= 70;
const IKey				= 73;
const JKey				= 74;
const LKey				= 76;
const MKey				= 77;
const NKey				= 78;
const OKey				= 79;
const PKey				= 80;
const RKey				= 82;
const SKey				= 83;
const TKey				= 84;
const UKey				= 85;
const VKey				= 86;
const XKey				= 88;
const ZKey				= 90;
const ZeroKey			= 48; // Numbers
const OneKey			= 49;
const TwoKey			= 50;
const ThreeKey			= 51;
const FourKey			= 52;
const FiveKey			= 53;
const SixKey			= 54;
const SevenKey			= 55;
const EightKey			= 56;
const NineKey			= 57;
const BackspaceKey	=  8; // Other
const TabKey			=  9;
const EnterKey			= 13;
const EscKey			= 27;
const SpaceKey			= 32;
const EqualsKey		= 187;
const MinusKey			= 189;
const PageUpKey		= 33;
const PageDownKey		= 34;
const EndKey			= 35;
const HomeKey			= 36;
const DeleteKey		= 46;
const ControlKey		= 17;
const AltKey			= 18;
const ShiftKey			= 16;
const CommandLeftKey	= 91; // or Window key in MSWindows, and Meta key in Unix
const CommandRightKey = 93;
const F1Key				= 112; // Function keys
const F2Key				= 113;
const F3Key				= 114;
const F4Key				= 115;
const F5Key				= 116;
const F6Key				= 117;
const F7Key				= 118;
const F8Key				= 119;
const F9Key				= 120;
const F10Key			= 121;

// Arrows:
const UpArrowKey		= 38;    // maybe also 30 & 57373
const DownArrowKey	= 40;    // maybe also 31 & 57374
const LeftArrowKey	= 37;    // maybe also 28 & 57375
const RightArrowKey	= 39;    // maybe also 29 & 57376



//////////////////////////////
//
// InitializeWordlist -- manages setup of the WORDLISTS object which 
//    contains a list of the words in the database.
//

function InitializeWordlist() {
	if (WORDLISTS != null) {
		return;
	}

	// Eventually request a timestamp from the server, and compare
	// to WORDLISTS store in localStorage, and only re-download if the
	// server has a newer WORDLISTS.  For now, update once an hour.
	var refreshtime = 3600 * 1;  // update once an hour
	var currenttime = parseInt(new Date() / 1000);  // convert from ms to sec.

	if ((typeof localStorage.WORDLISTSrefreshtime !== 'undefined') && 
		 (localStorage.WORDLISTSrefreshtime < currenttime)) {
		localStorage.WORDLISTS = null;
	}

	if ((typeof localStorage.WORDLISTS === 'undefined') ||
			(localStorage.WORDLISTS == "null") || (localStorage.WORDLISTS == "")) {
		// need to download the WORDLISTS data from the server.
		localStorage.WORDLISTS = ReadFile('/wordlists/all.json');
		WORDLISTS = JSON.parse(localStorage.WORDLISTS);
		localStorage.WORDLISTSrefreshtime = currenttime + refreshtime;
	} else {
		// already have the worklist in local storage, so read from there.
		WORDLISTS = JSON.parse(localStorage.WORDLISTS);
	}
}



//////////////////////////////
//
// ReadFile -- Download URL content which is returned as a string.
//		The URL must be on the same domain as index.html due to
//		JavaScript Same-Origin policy:
//		 	http://en.wikipedia.org/wiki/Same-origin_policy
// XMLHttpRequest object:
//			http://www.w3.org/TR/2007/WD-XMLHttpRequest-20070618
//			http://xhr.spec.whatwg.org
//
//	See:
//		http://codingforums.com/ajax-design/123705-make-script-wait-until-request-comes-back.html
//

function ReadFile(url) {
	var request = new XMLHttpRequest();

	request.open('GET', url, false);
	request.send(null);

	var string = request.responseText;
	if ((string.length < 1000) && string.match(/Not Found/)) {
		return '';
	} else {
		return request.responseText;
	}
}



/////////////////////////////
//
// ReadFileAsync -- Don't wait for the file to download, but 
// leave a function to call once it is ready.
//

function ReadFileAsync(url, callback) {
	var request = new XMLHttpRequest();
	request.open('GET', url, true);
	request.onload = function (e) {
		if (this.readyState == 4) {
			callback(this.responseText);
		}
	};
	request.onerror = function(e) {
		console.error(request.statusText);
	};
	request.send(null);
}



//////////////////////////////
//
// GetCgiParameters -- Returns an associative array containing the
//     page's URL's CGI parameters
//

function GetCgiParameters() {
	var url = window.location.search.substring(1);
	var output = {};
	var settings = url.split('&');
	for (var i=0; i<settings.length; i++) {
		var pair = settings[i].split('=');
		pair[0] = decodeURIComponent(pair[0]);
		pair[1] = decodeURIComponent(pair[1]);
		if (typeof output[pair[0]] === 'undefined') {
			output[pair[0]] = pair[1];
		} else if (typeof output[pair[0]] === 'string') {
			var arr = [ output[pair[0]], pair[1] ];
			output[pair[0]] = arr;
		} else {
			output[pair[0]].push(pair[1]);
		}
	}
	return output;
}



//////////////////////////////
//
// UpdateEzMark -- Set the styling of the select2 form elements.
// 		This function is needed to run whenever an input form is changed
// 		(such as changing the value).
//

function UpdateEzMark() {
	$("select").not('.tricky').select2({
		width: "off"
	});
}



//////////////////////////////
//
// DecorateHeaderFooterLinks -- Highlight and disable any
// 	self-referential links in the header or footer.
//

function DecorateHeaderFooterLinks() {
	var alli = $("ul.header-links > li, ul.footer-links > li").toArray();

	if (!alli) {
		return;
	}

	var target = document.URL.replace(/\/$/, "");
	var targetbase = target.replace(/^http:\/\/[^\/]+/i, "");
	var i;
	for (i=0; i<alli.length; i++) {
		var link = alli[i].querySelector("a");
		if (!link) {
			continue;
		}
		var linkref = link.href.replace(/\/$/, "");

		if (linkref !== target) {
			continue;
		}
		link.style.color = "#d7ab5b";
		link.name = link.href;
		link.removeAttribute("href");
	}
}




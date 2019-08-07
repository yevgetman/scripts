function p(obj,heading){ 

	// print @obj to the console log with optional @heading string

	if(heading) console.log(heading + ':',obj);
	else console.log(obj);
} 

function redirect(url){

	// Redirect the browser to @url
	
	window.location.assign(url);
}

function rand(min, max) {   

 	// generte a random integer between min and max (inclusive)

	min = Math.ceil(min);
	max = Math.floor(max); 
	return Math.floor(Math.random() * (max - min)) + min;
}

function empty(obj){ 

	// returns true if object (string, array, or object) is undefined, null, or empty

	if(obj === undefined || obj === null || obj === "") return true;
	else if(obj.constructor === Object && Object.keys(obj).length <= 0) return true; 
	else if(obj.constructor === Array && obj.length <= 0) return true;
	else if(obj == void 0) return true;
	return false;
} 

function deepClone(obj){

	/* deep clone an object NOT by reference */

	return JSON.parse(JSON.stringify(obj));
}

function ready(callback){

	// viable analogue for jQuery's $(document).ready()
	//
	// @callback - function to fire after document has loaded
	// copypasta'd from https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery

    // in case the document is already rendered
    if(document.readyState!='loading') callback();
    // modern browsers
    else if(document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    // IE <= 8
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

function validate(rules, data){

    /*
    Validate each item in @data given set of items in @rules
    @return - true, if all conditions met
              if any condition is not met, an object containing error information {rule failed, index of failed data}
    @data   - single value or array of values to be validated 
    @rules  - array of supported validation rules 
                supported rules: 
                    required - check if value is empty or null
                    isEmail - checks for valid email address input
                    isNumeric - check whether value is a number or a string representation of a number 
                    isAlpha - check whether value contains alphabetic charcters only
                    minLength - check minimum length of string (requires 1 additional parameter)
                    maxLength - check maximum length of string (requires 1 additional parameter)
                an invalid rule returns -1
    */

    // @data is a single parameter - rewrite as array
    if(data.constructor !== Array) data = [data];

    var err = {}, param = [];

    for(var i=0; i < data.length; i++){

        for(var j=0; j < rules.length; j++){

            // @rule is an array with a set of test parameters
            if(rules[j].constructor === Array) {
                for(var k=1; k < rules[j].length; k++) {
                    param.push(rules[j][k]);
                }
                rules[j] = rules[j][0];
            }

            // check for null or empty
            if(rules[j] === 'required'){

                if(data[i] === null || data[i] === 'undefined' || data[i] === '') {
                    return {'rule':rules[j], 'data':i};
                }

            // check for valid email address
            } else if(rules[j] === 'isEmail'){
            
                var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if(reg.test(data[i])===false) {
                    return {'rule':rules[j], 'data':i};
                }
            
            // check for a number or a string representation of a number with no alpha characters
            } else if(rules[j] === 'isNumeric'){  

                if(isNaN(data[i]) && !isFinite(data[i])) {
                    return {'rule':rules[j], 'data':i};
                }
            
            // check for valid phone number
            } else if(rules[j] === 'isPhone'){

                if(/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/.test(data[i]) === false) {
                    return {'rule':rules[j], 'data':i};
                } 

            // check for date in format MM/DD/YYYY
            } else if(rules[j] === 'isDate'){

                if(/^[0-3]?[0-9].[0-3]?[0-9].(?:[0-9]{2})?[0-9]{2}$/.test(data[i]) === false) {

                    return {'rule':rules[j], 'data':i};
                } 

            // check for alphabetic string with no numeric or special characters
            } else if(rules[j] === 'isAlpha'){

                if(/^[a-zA-Z() ]+$/.test(data[i]) === false) {
                    return {'rule':rules[j], 'data':i};
                } 
            
            // check for trimmed data at least @param in length
            } else if(rules[j] === 'minLength'){ 

                if(validate(['required'],param) !== true) {
                    console.log('must provide test parameter for minLength');
                    return -1;
                }

                var str = data[i].trim();
                if(str.length < param[0]) {
                    return {'rule':rules[j], 'data':i};
                }

            // check for trimmed data no longer than @param
            } else if(rules[j] === 'maxLength'){

                if(validate(['required'],param) !== true) {
                    console.log('must provide test parameter for maxLength');
                    return -1;
                }

                var str = data[i].trim();
                if(str.length > param[0]) {
                    return {'rule':rules[j], 'data':i};
                }

            // invalid rule
            } else { 
                console.log('invalid rule'); 
                return -1; 
            }
        }
    }

    return true;
} 

function htmlDecode(input) {

    var e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
} 

function linkify(inputText){

    var replacedText, replacePattern1, replacePattern2, replacePattern3;

    //URLs starting with http://, https://, or ftp://
    replacePattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
    replacedText = inputText.replace(replacePattern1, '<a href="$1" target="_blank">$1</a>');

    //URLs starting with "www." (without // before it, or it'd re-link the ones done above).
    replacePattern2 = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
    replacedText = replacedText.replace(replacePattern2, '$1<a href="http://$2" target="_blank">$2</a>');

    //Change email addresses to mailto:: links.
    replacePattern3 = /(([a-zA-Z0-9\-\_\.])+@[a-zA-Z\_]+?(\.[a-zA-Z]{2,6})+)/gim;
    replacedText = replacedText.replace(replacePattern3, '<a href="mailto:$1">$1</a>');

    return replacedText;
}
	
function isAlpha(str) {

	// check whether @str is alphabetic (letters a-z, A-Z only - no numbers or special characters)

  	return /^[a-zA-Z() ]+$/.test(str);
}

function isNumber(n) {

	// check whether @n is a number or string representing a numeric value (whole or decimal value - no letters or special characters) 

  	return !isNaN(n) && isFinite(n);
}

function isEmail(str) {
	
	// determine whether @str is in a valid email address format
	
	var reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return reg.test(str);
} 

function checkNull(arr){
		
	// check whether element in @arr is null or empty and return it's handle 
		
	var _null = [];
	for(var i=0; i < arr.length; i++) {
		if(arr[i][1]==null || arr[i][1]=='') {
			 _null.push(arr[i][0]);
		}
	}
	return _null;
} 
		
String.prototype.toUpper = function(){
	
	// capitalize first letter of every word
	
	return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

String.prototype.capitalize = function() {
	// capitalize first letter of each word in string. ex: mystr.capitalize()
    return this.charAt(0).toUpperCase() + this.slice(1);
}

function scrapeTags(str,tag){

	/*
	@str (string) - string containing HTML tags/markup
	@tag (string) - tag directive to be scraped (ex. div, span, a, li, .. ) 
	RETURN (string) - content inside tag designated designated by @tag
	*/

	var _root = document.createElement("div");
	_root.innerHTML = str;
	var res = [].map.call( _root.querySelectorAll(tag), function(v){
	    return v.textContent || v.innerText || "";
	});

	return res;	
} 

function cache(key,value) {

	// commit an item to JS localStorage preserving type if item an Object or Array
	// dependencies - JS localStorage

	value = value || null;

	if(value === null){ // get an object

		if(typeof value === 'object'){

			value = JSON.parse(

				localStorage.getItem(key) ? localStorage.getItem(key) : '{}'
			);

			return value;

		} return localStorage.getItem(key);

	} else { 			// set an object

		if(typeof value === 'object'){

			localStorage.setItem(key, JSON.stringify(value));

		} else {

			localStorage.setItem(key, value);
		} 

		return true;
	}
}

function setCookie(cname, cvalue, exhrs) {

    var d = new Date();
    d.setTime(d.getTime() + exhrs * 60 * 60 * 1000);
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {

    var name = cname+"=";
    var carray = document.cookie.split(';');
    for(var i = 0; i < carray.length; i++) {
        var c = carray[i];
		var c_parsed = c.split("=");
		if(c_parsed[0].trim() == cname) return c_parsed[1];
    }
    return false;
} 

function checkCookie(cname) {

    var cook = getCookie(cname);
    return cook !== false ? true : false;    
}

function parseName(fullname){

	/*
		attempts to parse @fullname and returns an object containing title, firstname, middlename, lastname, suffix, 2nd suffix parts
		@fullname (string) - string representing a full name in any format (ex. Dr. John Smith, Sr.)
		return (object) - JSON object containing name data
		** names longer than 6 parts will be truncated to first 6 parts
	*/

    var titles = ['dr','doctor','esq','hon','jr','madam','mr','mister','mrs','ms','miss','messrs','mmes','msgr','mx','prof','rev','rabbi','rt' ,'hon','sir','sr','st'];
    var suffix = ['dds','esq','jr','jd','sr','md','phd','i','ii','iii','iv','v','vi','vii','viii','ix','x'];

    var name = { 'title':'','firstname':'','middlename':'','lastname':'','suffix':'' }; // object to be returned

	var parsed = typeof fullname !== 'undefined' ? fullname.trim().replace(/,/g, ' ').replace(/\s+/g, ' ').toLowerCase().split(' ') : [];
 
    var len = parsed.length;
    
    if(len > 0){
    
		switch(len){
		
            case 1: // single name - assume firstname
				
				if(titles.indexOf(parsed[0]) > -1) name.title = parsed[0];
				else if(suffix.indexOf(parsed[0]) > -1) name.suffix = parsed[0];
				else name.firstname = parsed[0];

				break;

            case 2: // two-part name
	
				if(parsed[0].indexOf('.') < 0 && titles.indexOf(parsed[0]) < 0) name.firstname = parsed[0];
 				else name.title = parsed[0];   

				if(parsed[len-1].indexOf('.') < 0 && suffix.indexOf(parsed[len-1]) < 0) name.lastname = parsed[len-1];
				else name.suffix = parsed[len-1];

				break;	

            case 3: // three-part name

				if(parsed[0].indexOf('.') < 0  && titles.indexOf(parsed[0]) < 0) { 

 					name.firstname = parsed[0];
					name.middlename = (parsed[len-1].indexOf('.') < 0 && suffix.indexOf(parsed[len-1]) < 0) ? parsed[1] : '';

                } else {
					
					name.title = parsed[0]; 
					name.firstname = parsed[1];  
					name.lastname = parsed[1]; 
                }

				if(parsed[len-1].indexOf('.') < 0 && suffix.indexOf(parsed[len-1]) < 0) name.lastname = parsed[len-1];
				else {

					if(parsed[len-2].indexOf('.') < 0 && suffix.indexOf(parsed[len-2]) < 0){

						name.lastname = (parsed[0].indexOf('.') < 0 && titles.indexOf(parsed[0]) < 0) ? parsed[len-2] : parsed[1];
						name.suffix = parsed[len-1];	

					} else { // name has two suffixes

						name.firstname = (parsed[0].indexOf('.') < 0 && titles.indexOf(parsed[0]) < 0) ? parsed[0] : '';
						name.suffix = parsed[len-2];
						name['suffix2'] = parsed[len-1];
					}		
				}

				break;	

            case 4: // four-part name

				if(parsed[0].indexOf('.') < 0 && titles.indexOf(parsed[0]) < 0){ 

 					name.firstname = parsed[0];
 					name.lastname = parsed[1];
					name.middlename = parsed[len-1].indexOf('.') < 0 ? parsed[1] : '';

                } else {
					
					name.title = parsed[0]; 
					name.firstname = parsed[1]; 
					name.middlename = (parsed[len-1].indexOf('.') < 0 && suffix.indexOf(parsed[len-1]) < 0) ? parsed[2] : '';
                }

				if(parsed[len-1].indexOf('.') < 0 && suffix.indexOf(parsed[len-1]) < 0) name.lastname = parsed[len-1];
				else {

					if(parsed[len-2].indexOf('.') < 0 && suffix.indexOf(parsed[len-2]) < 0){ 

						name.middlename = (parsed[0].indexOf('.') < 0 && titles.indexOf(parsed[0]) < 0) ? parsed[len-3] : '';					
						name.lastname = parsed[len-2];
						name.suffix = parsed[len-1];
					
					} else { // name has two suffixes

						name.middlename = '';
						name.firstname = (parsed[0].indexOf('.') < 0 && titles.indexOf(parsed[0]) < 0) ? parsed[0] : '';
						name.lastname = parsed[1];
						name.suffix = parsed[len-2];
						name['suffix2'] = parsed[len-1];
					}
				}
		
				break;	

			case 5: // five part name

				if(parsed[0].indexOf('.') < 0 && titles.indexOf(parsed[0]) < 0){ 

 					name.firstname = parsed[0];
					name.middlename = parsed[len-1].indexOf('.') < 0 ? parsed[1] : '';

                } else {

                	name.title = parsed[0];  
					name.firstname = parsed[1]; 
					name.middlename = parsed[2]; 
                }

				if(parsed[len-1].indexOf('.') < 0 && suffix.indexOf(parsed[len-1]) < 0) name.lastname = parsed[len-1];
				else {

					if(parsed[len-2].indexOf('.') < 0 && suffix.indexOf(parsed[len-2]) < 0){ 
						
						name.lastname = parsed[len-2];
						name.suffix = parsed[len-1];

					} else { // name has two suffixes

						name.lastname = parsed[len-3];
						name.suffix = parsed[len-2];
						name['suffix2'] = parsed[len-1];
					}
				}                

				break;

			case 6: // six part name

				if(parsed[0].indexOf('.') < 0 && titles.indexOf(parsed[0]) < 0){ 

 					name.firstname = parsed[0];
					name.middlename = parsed[len-1].indexOf('.') < 0 ? parsed[1] : '';

                } else {

                	name.title = parsed[0];  
					name.firstname = parsed[1]; 
					name.middlename = parsed[2]; 
                }

				if(parsed[len-1].indexOf('.') < 0 && suffix.indexOf(parsed[len-1]) < 0) name.lastname = parsed[len-1];
				else {

					if(parsed[len-2].indexOf('.') < 0 && suffix.indexOf(parsed[len-2]) < 0){ 
						
						name.lastname = parsed[len-2];
						name.suffix = parsed[len-1];

					} else { // name has two suffixes

						name.lastname = parsed[len-3];
						name.suffix = parsed[len-2];
						name['suffix2'] = parsed[len-1];
					}
				}                

				break;

            default: // truncate to first 6 parts and recurse 

				return parseName(parsed[0]+' '+parsed[1]+' '+parsed[2]+' '+parsed[3]+' '+parsed[4]+' '+parsed[4]);

			break;
		}
 	}

	return name; 
}

function thisHour(){

	var now = new Date();
	return now.getHours();
}

function dayOfWeek(){

	// return the day of the week (sun-mon)

	var weekdays = ['sun','mon','tues','wed','thurs','fri','sat'];
	var now = new Date();
	return weekdays[now.getDay()];
}

function dayOfMonth(){

	// return the day of the month (1-31)

	var now = new Date();
	return now.getDate();
}
		
function todaysDate(){
	
	// return the current date

	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var theDate =
	    ((''+month).length < 2 ? '' : '') + month + '/' +
	    ((''+day).length < 2 ? '0' : '') + day + '/' + d.getFullYear();

	return theDate;	
} 	

function nextWeekDay(dayOfWeek) {

	var weekdays = {'sun':0,'mon':1,'tues':2,'wed':3,'thurs':4,'fri':5,'sat':6};

	var date = new Date();
	date.setDate(date.getDate() + (weekdays[dayOfWeek] + 7 - date.getDay()) % 7);

	return date;
} 

function getWeekDay(dayOfWeek,offset) {

	/* get the data for the weekday @offset number of weeks in the future or past
		@dayOfWeek - weekday as string of abbreviated day ("mon", "tues", ... , "sun")
		@offset - integer value of weeks in past or future (0 is current week, negative values for past weeks, positive values for future weeks)
	*/
	var mod = 0;
	var weekdays = {'sun':0,'mon':1,'tues':2,'wed':3,'thurs':4,'fri':5,'sat':6};
	
	var exp, date = new Date();
	var today = date.getDay();

	var diff = weekdays[dayOfWeek] - today; 
	if(diff<0) mod = 1;
	
	var exp = date.getDate() + (weekdays[dayOfWeek] + (offset+mod)*7 - date.getDay());

	date.setDate(exp);

	return date;
} 

function fromNow(timeStr){

	/* 
	Returns UTCString time string successful, otherwise false
	----------------------------------------------------------
	@timeStr - future date in days (d), hours (h), or combination (3d7h) ** other formats invalid **
	*/

	var invalid_input = false;
	if(timeStr.indexOf('d') > -1) { 

		var exp = timeStr.split('d'); 

		var exp_days = exp[0]; 

		if(isNaN(exp_days) || !isFinite(exp_days) || exp_days=='')  invalid_input = true;

		if(timeStr.indexOf('h') > -1 || exp[1].length>0) {

			var exp_hrs = exp[1].split('h')[0]; 
			if(isNaN(exp_hrs) || !isFinite(exp_hrs) || exp_hrs > 23) invalid_input = true;

		} else var exp_hrs = 0;

	} else if(timeStr.indexOf('h') > -1) {

		var exp = timeStr.split('h'); 
		var exp_hrs = exp[0];

		if(isNaN(exp_hrs) || !isFinite(exp_hrs) || exp_hrs=='') invalid_input = true;
	
	} else invalid_input = true;

	if(invalid_input){
		console.log('fromNow() error: input invalid');
		return(false);
	}
	if(exp_days!==undefined) exp_hrs = Number(exp_hrs) + Number(exp_days*24);

	var D = new Date();

    D.setTime(D.getTime() + (exp_hrs * 60 * 60 * 1000));

	return D.toUTCString();
} 

function daysAgo(date){

	/* ** DEPENDENCIES: moment.js
	@date - text string representing date in almost any format
	RETURN: int representing the number of days that have passed since @date
	*/

    var a = new Date(date);
    var b = moment(a).format();

    var now = moment(); 
    var d = now.diff(b, 'd'); 
    var diff = moment.localeData().relativeTime(d, false, d == 1 ? 'd' : 'dd');
    var days_ago = Number(diff.split(' ')[0]); 
    
    return days_ago;
}

function hasPassed(date){

	/*
		@date - date in question in YYYY-MM-SS HH:MM:SS form
		returns true if @date has passed, false if @date has not passed
	*/
	
	var now = new Date();
	d = new Date(date);
	if(d < now) return true;
	
	return false;
} 

function timeTo24(t){

	/*
		convert time in am/pm format to HH:MM:SS time string
	*/

	var period, T, time24;

	t = t.replace(/\s+/,"").toLowerCase();

	to = t;

	t = t.replace(/[^\d.:-]/g,"");

	T = t.split(':'); 

	if(Number(T[0])>12 || Number(T[1])>=60) return 'invalid input';

	if(inStr('pm',to)) { 

		if(Number(T[0])!==12) T[0] = Number(T[0])+12;

		if(Number(T[0])<=9) T[0] = '0'+String(T[0]);

	} else if(inStr('am',to)) { 

		if(Number(T[0])===12 || Number(T[0])===24) T[0] = '00';

	} else return 'invalid format';

	T[0] = String(T[0]);

	time24 = T[0]+':'+T[1]+':00';

	return time24;
} 
	
function checkAgent() {
		
 	// use regex to check user agent (mobile or desktop)
	
	var check = false;
	(function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
	return check;
} 

function stripNonNum(str){
	/* strip all non-numeric characters from str (leaves "." for float values) */
	return str.replace(/[^\d.-]/g, '');
}
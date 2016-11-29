export function androidVersion() {
	var u = window.navigator.userAgent;
	var num;
	if (u.indexOf('Trident') > -1) {
		//IE
		return "IE";
	} else if (u.indexOf('Presto') > -1) {
		//opera
		return "Opera";
	} else if (u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1) {
		//firefox
		return "Firefox";
	} else if (u.indexOf('AppleWebKit' && u.indexOf('Safari') > -1) > -1) {
		//苹果、谷歌内核
		if (u.indexOf('Chrome') > -1) {
			//chrome
			return "Chrome";
		} else if (u.indexOf('OPR')) {
			//webkit Opera
			return "Opera_webkit"
		} else {
			//Safari
			return "Safari";
		}
	} else if (u.indexOf('Mobile') > -1) {
		//移动端
		if (!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
			//ios
			if (u.indexOf('iPhone') > -1) {
				//iphone
				return "iPhone"
			} else if (u.indexOf('iPod') > -1) {
				//ipod
				return "iPod"
			} else if (u.indexOf('iPad') > -1) {
				//ipad
				return "iPad"
			}
		} else if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {
			//android
			num = u.substr(u.indexOf('Android') + 8, 3);
			return {
				"type": "Android",
				"version": num
			};
		} else if (u.indexOf('BB10') > -1) {
			//黑莓bb10系统
			return "BB10";
		} else if (u.indexOf('IEMobile')) {
			//windows phone
			return "Windows Phone"
		}
	}
}

export function isLowerVersion() {
	var r = androidVersion()
	if (r && r.type && r.type == 'Android' && r.version < '4.5') {
		return true;
	}
	return false;
}
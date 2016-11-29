const errorMessage = {
	content: '网络请求异常，请重新尝试！',
	buttonType: 'BUTTON_TYPE_CENTER',
	buttonCenterText: "确定",
	buttonCenterEventMethod: function() {
		//
	},
}

const errorTimeoutMessage = {
	content: '系统开小差，请稍后重试！',
	buttonType: 'BUTTON_TYPE_CENTER',
	buttonCenterText: "确定",
	buttonCenterEventMethod: function() {
		//
	},
}

export function fetchGet(url, data, callback, failed) {
	VH.ui.showLoading()
	$.ajax({
		url: url,
		type: 'get',
		dataType: 'json',
		async: true,
		data: data,//JSON.stringify(data),
		contentType: 'application/json',
		timeout:15000,
		success: function(result) {
			if(result&&result.error){
				if(failed){
					failed(result)
				}else{
					VH.ui.showDialog(errorMessage)
				}
			}else{
				callback(result.data);
			}
		},
		error: function(error,status) {
			if(status =='timeout'){
				VH.ui.showDialog(errorTimeoutMessage)
			}else{
				VH.ui.showDialog(errorMessage)
			}
		},
		complete: function() {
			VH.ui.hideLoading()
		}
	});
}

export function fetchPost(url, data, callback, failed) {
	VH.ui.showLoading()
	$.ajax({
		url: url,
		type: 'post',
		dataType: 'json',
		async: true,
		data:  toQueryString(data),
		timeout:15000,
		contentType: 'application/x-www-form-urlencoded',
		success: function(result) {
			if(result&&result.error){
				if(failed){
					failed(result)
				}else{
					VH.ui.showDialog(errorMessage)
				}
			}else{
				callback(result.data);
			}
		},
		error: function(error,status) {
			if(status =='timeout'){
				VH.ui.showDialog(errorTimeoutMessage)
			}else{
				VH.ui.showDialog(errorMessage)
			}
		},
		complete: function() {
			VH.ui.hideLoading()
		}
	});
}


function toQueryString(obj) {
	return obj ? Object.keys(obj).sort().map(function(key) {
		var val = obj[key];
		if (Array.isArray(val)) {
			return val.sort().map(function(val2) {
				return encodeURIComponent(key) + '=' + encodeURIComponent(val2);
			}).join('&');
		}
		return encodeURIComponent(key) + '=' + encodeURIComponent(val);
	}).join('&') : '';
}
export function getQueryStringByName(name) {
	var result = decodeURIComponent(location.search).match(new RegExp("[\?\&]" + name + "=([^\&]+)", "i"));
	if (result == null || result.length < 1) {
		return "";
	}
	return result[1];
}

//
//{name:'jack',age:18} => name=jack&age=18
export function paramObj2paramStr(url, obj = {}) {
	var newUrl = ''
	var paramStr = ''
	for (var i in obj) {
		paramStr += '&' + i + '=' + obj[i]
	}
	if (url.indexOf('&') > -1) {
		newUrl = url + paramStr
	} else if (url.indexOf('?') > -1) {
		if (url.indexOf('=') > -1) {
			newUrl = url + paramStr
		} else {
			newUrl = url + paramStr.substring(1)
		}

	} else {
		newUrl = url + '?' + paramStr.substring(1)
	}
	return newUrl
}
// name=jack&age=18 => {name:'jack',age:18}
export function paramStr2paramObj(url) {
	var search = decodeURIComponent(url).replace(/^\s+/, '').replace(/\s+$/, '').match(/([^?#]*)(#.*)?$/); //提取location.search中'?'后面的部分 
	if (!search) {
		return {};
	}
	var searchStr = search[1];
	var searchHash = searchStr.split('&');

	var ret = {};
	for (var i = 0, len = searchHash.length; i < len; i++) { //这里可以调用each方法 
		var pair = searchHash[i];
		if ((pair = pair.split('='))[0]) {
			var key = pair.shift();
			var value = pair.length > 1 ? pair.join('=') : pair[0];
			if (value != undefined) {
				value = value;
			}
			ret[key] = value;
			// 删除数组
			// if (key in ret) {
			// 	if (ret[key].constructor != Array) {
			// 		ret[key] = [ret[key]];
			// 	}
			// 	ret[key].push(value);
			// } else {
			// 	ret[key] = value;
			// }
		}
	}
	return ret;
}
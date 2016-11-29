import {
	paramObj2paramStr
}
from '../http.js'

import {
	dateFormat
}
from '../dateFormat.js'

import {
	isScrollBottom
}
from '../../mod/isScrollBottom.js'

import {
	isLowerVersion
}
from '../../mod/androidVersion.js'


class MessageItem {
	constructor() {
		this.adTime = ''
		this.number = 5
	}
	getMessageItemHTML(paramArray) {
		if (paramArray == undefined && paramArray.length == 0) {
			return ''
		}
		var templateStr = ''
		var length = paramArray.length
		for (var i = 0; i < length; i++) {
			var param = paramArray[i]
			var isMarked = param.readFlg == 'Y' ? 'content marked' : 'content'
			var resultParam = {
				msgTitle: param.msgTitle,
				msgTime: dateFormat(param.msgTime, 'yyyy-MM-dd hh:mm:ss'),
				msgContent: param.msgContent,
				messageId: param.id,
				msgBrief: param.msgBrief
			}
			var url = "/h5/messageDetail?messageId=" + resultParam.messageId + "&readFlg=" + param.readFlg
			templateStr += `
				<a class='message-ct' href='${url}'> 
					<div class='${isMarked}'>
						<div class='title'>${resultParam.msgTitle}</div>
						<div class='time'>${resultParam.msgTime}</div>
						<div class='text'>
			               ${resultParam.msgBrief}
			             </div>
					</div>
					<i class="icon-arrow"></i>
				</a>
				`
		}
		return templateStr
	}
	getMessageItemDetailHTML(param) {
		if (param == undefined) {
			return ''
		}
		param.msgTime = dateFormat(param.msgTime, 'yyyy-MM-dd hh:mm:ss')
		var templateStr = ''
		templateStr = `
			<div class='message-detail-ct' > 
				<div class='content'>
					<div class='title'>${param.msgTitle}</div>
					<div class='time'>${param.msgTime}</div>
					<div class='text'>
		               ${param.msgContent}
		             </div>
				</div>
			</div>
				`
		return templateStr
	}
	hideInfo() {
		$('.message-overlay').remove()
	}
	showInfo(param) {
		if (param == undefined || param.length == 0) {
			return
		}
		var length = param.length
		var itemsStr = ''
		for (var i = 0; i < length; i++) {
			var isRed = param[i].isRed == true || param[i].isRed == 'true' ? 'red' : ''
			itemsStr += `<li index='${i}' class='${isRed}'>${param[i].title}</li>`
		}
		var templateStr = ''
		templateStr = `
			<div class='message-overlay overlay' > 
				<div class='content'>
					<ul>
						${itemsStr}
					</ul>
				</div>
			</div>
				`
		document.body.insertAdjacentHTML('beforeend', templateStr)
		this.param = param
		var self = this
		$('.message-overlay').on('click', function(event) {
			var index = $(event.target).attr('index')
			if (index) {
				self.param[index].event()
			}
			self.hideInfo()
		})
		$('.message-overlay').on('touchmove', (e) => {
			e.preventDefault()
		})
	}
	hideDescription() {
		$('.description-overlay').addClass('hide-animate')
	}
	showDescription(param) {
		if (param == undefined) {
			return
		}
		var templateStr = ''
		templateStr = `
			<div class='description-overlay overlay hide-animate' > 
				<div class='content'>
					<div class='title'>${param.title}</div>
					<div class='text'>${param.text}</div>
					<div class='text-center'>
					<div class='bottom'>${param.bottom}</div>
					</div>
				</div>
			</div>
				`
		if ($('.description-overlay')) {
			$('.description-overlay').remove()
		}
		document.body.insertAdjacentHTML('beforeend', templateStr)
		$('.description-overlay').on('click', '.bottom', () => {
			this.hideDescription()
		})
		$('.description-overlay').on('touchmove', (e) => {
			e.preventDefault()
		})
		$('.description-overlay ').removeClass('hide-animate')
	}
	showLoadingBar(target, status) {
		//status -1:隐藏， 0:上拉加载更多, 1:正在加载, 2:以上是全部内容 3: 暂无消息记录
		if ($('.loading-bar').length || status == -1 || status == 3) {
			$('.loading-bar').remove()
		}
		if (status == -1) {
			return
		}
		var ct = ''
		if (status == 0) {
			ct = `<span class='more-up'>上拉加载更多</span>`
		} else if (status == 1) {
			ct = `<span class='more-loading'>正在加载..</span>`
		} else if (status == 2) {
			ct = `<span class='more-over'>以上是全部内容</span>`
		}
		var str = `
			<div class='loading-bar text-center' id='loading-bar'>
				${ct}
			</div>`
		$(str).insertAfter(target)
	}
	downRefresh(action) {
		var _content = document.body;
		var _start = 0;
		var _end = 0;
		_content.addEventListener("touchstart", _touchStart, false);
		if (isLowerVersion()) {
			document.addEventListener("scroll", _scroll, false)
		} else {
			_content.addEventListener("touchend", _touchEnd, false)
		}

		//touchstart事件监听
		function _touchStart(event) {
			var touch = event.targetTouches[0];
			_start = touch.pageY;
		}
		//touchend事件监听
		function _touchEnd(event) {
			var touch = event.changedTouches[0];
			_end = (touch.pageY - _start);
			//上划
			if (_end < 0) {
				if (isScrollBottom()) {
					action()
				}
			}
		}

		// scorll兼容低版本
		function _scroll(event) {
			if (isScrollBottom()) {
				action()
			}
		}
	}
	hideAd() {
		this.adTime = clearInterval(this.adTime)
		$('.ad-container').remove()
	}
	showAd(event) {
		var templateStr = ''
		templateStr = `
			<div class='ad-container overlay' > 
				<span class='ad-time'>
					<span class='number'>5</span>s 跳过
				</span>
				<div class='ad-content'>
					<div class='ad-img'></div>
					<div class='ad-text'></span>点滴信用 品质生活</div>
				</div>
			</div>
				`
		document.body.insertAdjacentHTML('beforeend', templateStr)
		this.adTime = setInterval(() => {
			if (this.number <= 0) {
				this.hideAd()
				this.adTime = clearInterval(this.adTime)
				if (event) {
					event()
				}
			} else {
				$('.ad-time .number').text(--this.number)
			}
		}, 1000)
		$('.ad-time').on('click', () => {
			this.hideAd()
			if (event) {
				event()
			}
		})
		$('.ad-container').on('touchmove', (e) => {
			e.preventDefault()
		})
	}
}

var selectModalObject = new MessageItem()

export function getMessageItemHTML(param) {
	return selectModalObject.getMessageItemHTML(param)
}

export function getMessageItemDetailHTML(param) {
	return selectModalObject.getMessageItemDetailHTML(param)
}

export function showInfo(param) {
	selectModalObject.showInfo(param)
}

export function hideInfo() {
	selectModalObject.hideInfo()
}

export function hideDescription() {
	selectModalObject.hideDescription()
}

export function showDescription(param) {
	selectModalObject.showDescription(param)
}

export function showLoadingBar(target, status) {
	selectModalObject.showLoadingBar(target, status)
}

export function downRefresh(action) {
	selectModalObject.downRefresh(action)
}

export function showAd(event) {
	selectModalObject.showAd(event)
}
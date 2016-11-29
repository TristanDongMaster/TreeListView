var data = {
	parent: [{
		id: 1,
		name: '基本信息1312',
		sub: [{
			id: 11,
			name: '基本信息11',
		}, {
			id: 1142424242,
			name: '基本信息11',
		}, {
			id: 12,
			name: '基本信息143543512',
			sub: [{
				id: 1124423,
				name: '基本信息13',
				isSelected: true
			}, {
				id: 12345343,
				name: '基本信息1334353534'
			}, {
				id: 42212,
				name: '342基本信息1435435122342',
				sub: [{
					id: 1231245343423,
					name: '基本信34432息13',
					isSelected: true
				}, {
					id: 435453412345343,
					name: '基本信息1334353534'
				}]
			}]
		}]
	}, {
		id: 12234231,
		name: '基本信息',
		sub: [{
			id: 42311,
			name: '基本信息11',
		}, {
			id: 1234242342,
			name: '基本信息143543512',
		}]
	}, {
		id: 12234242431,
		name: '基本信息',
		sub: [{
			id: 4223311,
			name: '基本信息324211',
			sub: [{
				id: 1324243423,
				name: '基本信息1243',
				isSelected: true
			}, {
				id: 16743223423,
				name: '基本信息13343',
				isSelected: true
			}]
		}, {
			id: 123424342342,
			name: '基本信息143543512',
			sub: [{
				id: 123434353,
				name: '基本信息13',
				isSelected: true
			}, {
				id: 123422342344223,
				name: '基本信息1334353534',
				isSelected: true
			}]
		}]
	}]
}


// 初始化选择结果
export function isAllSelected(data) {
	var isSelected = true
	if (data.sub != undefined) {
		let sub = data.sub
		for (let length = sub.length, i = 0; i < length; i++) {
			if (isAllSelected(sub[i]) == false) {
				isSelected = false
				break;
			}
		}
	} else if (data.isSelected != true && data.sub == undefined) {
		isSelected = false
	}
	return isSelected
}

// 生成tree view DOM
export function generateTreeByData(dataArray) {
	var str = ''
	for (let length = dataArray.length, i = 0; i < length; i++) {
		let data = dataArray[i]
		if (typeof data == "object") {
			let node = ''
			let isChecked = isAllSelected(data) == true ? 'checked' : ''
			if (data.sub != undefined) {
				node = '<div class="node collapse">'
			}
			let index = 'title' + data.id
			let name = data.name
			let titleClass = "title " + isChecked
			let text = `<div class="node"><span class="${titleClass}" id="${data.id}" >${name}</span></div>`
			str += node + text
			if (data.sub != undefined) {
				let subLine = '<div class="sub line">'
				str += subLine
				let subItem = data.sub
				str += generateTreeByData(subItem)
				str += '</div>'
				str += '</div>'
			}
		}
	}
	return str
}

// 设置子节点选择状态
function selectItem($target, isChecked) {
	if (isChecked) {
		$target.addClass('checked')
	} else {
		$target.removeClass('checked')
	}
	var $sub = $target.closest('.node').next('.sub')
	if ($sub) {
		var $title = $sub.find('.title')
		$title.each(function(index, item) {
			selectItem($(item), isChecked)
		})
	}
}
// 设置父节点选择状态
function selectParent($target, isChecked) {
	var isCheckedParent = true
	var $sub = $target.closest('.sub')
	if ($sub.length == 0) {
		return
	}
	var $titles = $sub.find('.title')
	if ($titles.length == 0) {
		return
	}
	//兄弟节点
	$titles.each(function(index, item) {
		if ($(item).hasClass('checked') == false) {
			isCheckedParent = false
		}
	})
	isCheckedParent = isCheckedParent && isChecked
	var $nodeParent = $sub.siblings('.node')
	if ($nodeParent.length == 0) {
		return
	}
	let $title = $($nodeParent.find('.title')[0])
	if (isCheckedParent) {
		$title.addClass('checked')
	} else {
		$title.removeClass('checked')
	}
	if ($title && $title.closest('.sub')) {
		selectParent($title, isCheckedParent)
	}
}

// 选择，伸展事件
function triggerChecked() {
	$(".tree-ct").on('click', '.title', function(event) {
		var $this = $(this)
		var isChecked = $this.hasClass('checked')
		if (isChecked) {
			selectItem($this, !isChecked)
			selectParent($this, !isChecked)
		} else {
			selectItem($this, !isChecked)
			selectParent($this, !isChecked)
		}
	})
	$(".tree-ct").on('click', '.node', function(event) {
		var $this = $(this)
		var isChecked = $this.hasClass('collapse') || $this.hasClass('expand')
		if (isChecked) {
			$this.toggleClass('collapse')
			$this.toggleClass('expand')
		}
	})
}


Zepto(function($) {
	var str = generateTreeByData(data.parent);
	$(".tree-ct").append(str)
	triggerChecked()
});
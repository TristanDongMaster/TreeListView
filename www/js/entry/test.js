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
		id: 12234223413131,
		name: '基本信息',
		sub: [{
			id: 44322132132311,
			name: '基本信息11',
			isSelected: true
		}, {
			id: 1234231314242342,
			name: '基本信息143543512',
			isSelected: true
		}]
	}, {
		id: 12234242431,
		name: '基本信息',
		sub: [{
			id: 145351,
			name: '基本信息11',
		}, {
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
				isSelected: false
			}]
		}]
	}]
}


$.fn.extend({
	generateTree: function(dataArray) {
		// 生成tree view DOM
		function _generateTreeByData(dataArray) {
			var str = ''
			for (let length = dataArray.length, i = 0; i < length; i++) {
				let data = dataArray[i]
				if (typeof data == "object") {
					let node = ''
					let checkedFlag = _isAllSelected(data)
					let isChecked = checkedFlag == 0 ? '' : checkedFlag == 1 ? 'checked-one' : 'checked'
					if (data.sub != undefined) {
						node = '<div class="node"><div  class="collapse icon-toggle"></div>'
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
						str += _generateTreeByData(subItem)
						str += '</div>'
						str += '</div>'
					}
				}
			}
			return str
		}

		function _isAllSelected(data) {
			var isSelected = 0
			if (data.sub != undefined) {
				let sub = data.sub
				var checkedCount = 0
				for (let length = sub.length, i = 0; i < length; i++) {
					var subIsSelected = _isAllSelected(sub[i])
					if (subIsSelected == 2 || subIsSelected == 1) {
						checkedCount++
					}
				}
				if (checkedCount == 0) {
					isSelected = 0
				} else if (checkedCount < sub.length) {
					isSelected = 1
				} else {
					isSelected = 2
				}
			} else if (data.isSelected != true) {
				isSelected = 0
			} else if (data.isSelected == true) {
				isSelected = 2
			}
			return isSelected
		}
		// 设置父节点选择状态
		function _selectParent($target, isChecked) {
			var isCheckedParent = true
			var checkedCount = 0
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
				} else {
					checkedCount++
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
				$title.removeClass('checked-one')
			} else {
				if (checkedCount > 0) {
					$title.removeClass('checked')
					$title.addClass('checked-one')
				} else {
					$title.removeClass('checked')
					$title.removeClass('checked-one')
				}
			}
			if ($title && $title.closest('.sub')) {
				_selectParent($title, isCheckedParent)
			}
		}
		// 设置子节点选择状态
		function _selectItem($target, isChecked) {
			if (isChecked) {
				$target.addClass('checked')
				$target.removeClass('checked-one')
			} else {
				$target.removeClass('checked')
			}
			var $sub = $target.closest('.node').next('.sub')
			if ($sub) {
				var $title = $sub.find('.title')
				$title.each(function(index, item) {
					_selectItem($(item), isChecked)
				})
			}
		}

		this.append(_generateTreeByData(dataArray))
		
		this.on('click', '.title', function(event) {
			var $this = $(this)
			var isChecked = $this.hasClass('checked')
			_selectItem($this, !isChecked)
			_selectParent($this, !isChecked)
		})
		this.on('click', '.icon-toggle', function(event) {
			var $this = $(this)
			var isChecked = $this.hasClass('collapse') || $this.hasClass('expand')
			if (isChecked) {
				$this.toggleClass('collapse')
				$this.toggleClass('expand')
				$($this.closest('.node').find('.sub')[0]).toggleClass('toggle-hide')
			}
		})
		return this
	}
});

jQuery(function($) {
	$(".tree-ct").generateTree(data.parent);
});
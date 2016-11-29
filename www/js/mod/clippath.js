
export default function clippath(){
	$.turntableLottery = function( opts , container ){
		this.settings = opts;
		this.$lottery = container;
		this.init();
	}

	$.extend( $.turntableLottery , {
		defaults : {
			namespace 		: '.turntableLottery',
			isForWebkit    	: true,	 				 
			isForSvg        : true,
			svgDefId        : 'clipPathPolygonGenId',
			points          : null											  
		},
		prototype : {
			init : function(){
				this.initLayout();
			},
			initLayout : function(){
				var _this        = this;	
				var container    = _this.$lottery;
				var isForWebkit  = _this.settings.isForWebkit;
				var isForSvg 	 = _this.settings.isForSvg;
				var svgDefId     = _this.settings.svgDefId;
				var points       = _this.settings.points;

				function hideLoading(){
					$('#loading').hide();
				}

				function createSvgDefs(){
					if ($('#' + svgDefId).size() === 0) {
			        	var $svg = createSvgElement('svg').attr('width', 0).attr('height', 0).css('display','none');
			        	var $defs = createSvgElement('defs');
			        	$svg.append($defs);
			        	var $clippath = createSvgElement('clipPath').attr('id', svgDefId);
			        	$defs.append($clippath);
			        	var $polygon = createSvgElement('polygon');
			        	$clippath.append($polygon);
			        	$('body').append($svg);
			    	}
				}

				function createSvgElement(elementName){
					return $(document.createElementNS('http://www.w3.org/2000/svg', elementName));
				}

				function createWebkitClipPath(points){
					var clipPath = "polygon(" + translatePoints(points, true) + ")";
      				container.css('-webkit-clip-path', clipPath);
				}

				function translatePoints(points, withPxs){
					var result = [];
				    for (var i in points) {
				        var x = handlePxs(points[i][0], withPxs);
				        var y = handlePxs(points[i][1], withPxs);
				        result.push(x + ' ' + y);
				    }
				    return result.join(', ');
				}

				function handlePxs(number, withPxs){
					if (number === 0 || !withPxs) {
				        return number;
				    }
				    return (number*100).toFixed(2) + "%";
				}

				function createSvgBasedClipPath(points){
					$('#' + svgDefId + '').find('polygon').attr('points', translatePoints(points, false));
      				container.css('clip-path', 'url(#' + svgDefId + ')');
				}

				function layoutWheel(points){
					createSvgDefs();
				    if (isForWebkit) {
				        createWebkitClipPath(points);
				    }
				    if (isForSvg) {
				        createSvgBasedClipPath(points);
				    }
					
				}

				layoutWheel(points);
			}
		}
	});


	// lottery是jQuery.fn对象
    var lottery = function(options) {
        var opts = $.extend(true, {}, $.turntableLottery.defaults, options),
            turntableLottery;

        if (this.length === 0) {
            $.error("Nothing element selected");
            return;
        }
        //turntableLottery = $.data(this.eq(0), 'turntableLottery');
        turntableLottery = this.eq(0).attr("data-turntableLottery");

        if (turntableLottery && turntableLottery instanceof $.turntableLottery) {
            return turntableLottery;
        }

        turntableLottery = new $.turntableLottery(opts, this.eq(0));
        //$.data(this.eq(0), "turntableLottery", turntableLottery);
        this.eq(0).attr("data-turntableLottery", turntableLottery);
        return turntableLottery;
    }

    if (typeof define === 'function' && define.cmd) {
        define(function(require, exports, module) {
            $.fn.turntableLottery = lottery;
        });
    }
    else {
        $.fn.turntableLottery = lottery;
    }
}
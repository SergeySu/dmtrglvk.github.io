var carousel = {

	slider: '.slider',
	sliderList: '.slider ul',
	item: '.slider li',
	btnPrev: '.btn-prev',
	btnNext: '.btn-next',
	marginRight: 10,
	visibleItems: 3,
	animationSpeed: 300,
	sliderWidth: 620,
	responsive: {
		breakpoint: 460,
		sliderWidth: '100%',
		marginRight: 0,
		visibleItems: 1
	},

	init: function() {

		var that = this;

		that.resizeHandler();

		jQuery(window).resize(function() {
			that.resizeHandler();
		});

	},

	buildLayout: function(visibleItems, marginRight, sliderWidth) {

		var that = this,
			slider = jQuery(that.slider),
			sliderList = jQuery(that.sliderList),
			totalWidth = 0,
			el;

		if(sliderWidth === '100%') {

			slider.width(jQuery(window).width());

		} else {

			slider.width(sliderWidth);

		}

		if(!jQuery('.slider-wrap').length) {

			sliderList.wrap('<div class="slider-wrap" style="width:calc(100% - ' + marginRight + 'px)">');

		} else {

			jQuery('.slider-wrap').css({

				width: 'calc(100% - ' + marginRight + 'px)'

			})

		}

		jQuery(that.item).each(function(){

			el = jQuery(this);

			el.css({
				width: (slider.width() / visibleItems) - marginRight,
				marginRight: marginRight + 'px'
			})

			totalWidth += el.width() + marginRight;

		})

		sliderList.width(totalWidth + 10);

	},

	animateSlide: function(marginRight) {

		var animateWidth = -jQuery(this.item).width() - marginRight

		return animateWidth;

	},

	attachEvents: function(marginRight) {

		var that = this,
			animateLeft = 0,
			animation = false,
			animateSlide = that.animateSlide(marginRight);

		jQuery(that.btnNext).off().on('click', function(e){

			e.preventDefault();

			if(!animation) {

				animation = true;

				jQuery(that.sliderList).stop().animate({

					marginLeft: animateSlide

				}, that.animationSpeed, function(){
					animation = false;
					jQuery(that.item).first().detach().appendTo(jQuery(that.sliderList));
					jQuery(that.sliderList).css({
						marginLeft: 0
					})
				})

			}

		})

		jQuery(that.btnPrev).off().on('click', function(e){

			e.preventDefault();

			if(!animation) {

				animation = true;

				jQuery(that.item).last().detach().prependTo(jQuery(that.sliderList));

				jQuery(that.sliderList).css({

					marginLeft: animateSlide

				})

				jQuery(that.sliderList).stop().animate({

					marginLeft: 0

				}, that.animationSpeed, function(){

					animation = false;

				})

			}

		})

		that.swipeHandler();

		jQuery(that.sliderList).swipe({

			swipeLeft: function() {

				jQuery(that.btnNext).click();

			},
			swipeRight: function() {

				jQuery(that.btnPrev).click();

			}

		})

	},

	resizeHandler: function() {

		var that = this;

		if($(window).width() < that.responsive.breakpoint) {

			that.buildLayout(that.responsive.visibleItems, that.responsive.marginRight, that.responsive.sliderWidth);
			that.animateSlide(that.responsive.marginRight);
			that.attachEvents(that.responsive.marginRight);

		} else {

			that.buildLayout(that.visibleItems, that.marginRight, that.sliderWidth);
			that.animateSlide(that.marginRight);
			that.attachEvents(that.marginRight);

		}

	},

	swipeHandler: function() {

		$.fn.swipe = function(options) {
			var defaults = {
				threshold: {
					x: 30,
					y: 100
				},
				swipeLeft: function() {},
				swipeRight: function() {},
				preventDefaultEvents: true
			};

			var options = $.extend(defaults, options);

			if (!this) return false;

			return this.each(function() {

				var me = $(this)

				var originalCoord = { x: 0, y: 0 }
				var finalCoord = { x: 0, y: 0 }

				function touchStart(event) {
					originalCoord.x = event.targetTouches[0].pageX
					originalCoord.y = event.targetTouches[0].pageY
				}

				function touchMove(event) {
					if (defaults.preventDefaultEvents)
						event.preventDefault();
					finalCoord.x = event.targetTouches[0].pageX
					finalCoord.y = event.targetTouches[0].pageY
				}

				function touchEnd(event) {
					var changeY = originalCoord.y - finalCoord.y
					if(changeY < defaults.threshold.y && changeY > (defaults.threshold.y*-1)) {
						changeX = originalCoord.x - finalCoord.x

						if(changeX > defaults.threshold.x) {
							defaults.swipeLeft()
						}
						if(changeX < (defaults.threshold.x*-1)) {
							defaults.swipeRight()
						}
					}
				}

				this.addEventListener("touchstart", touchStart, false);
				this.addEventListener("touchmove", touchMove, false);
				this.addEventListener("touchend", touchEnd, false);

			});
		};

	}

};

jQuery(window).on('load', function(){
	carousel.init();
});

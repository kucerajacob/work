const locoScroll = new LocomotiveScroll({
	el: document.querySelector(".scroll-container"),
	smooth: true,
	lerp: 0.07
});

locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy(".scroll-container", {
	scrollTop(value) {
		return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
	},
	getBoundingClientRect() {
		return {
			top: 0,
			left: 0,
			width: window.innerWidth,
			height: window.innerHeight
		};
	},
	pinType: document.querySelector(".scroll-container").style.transform ? "transform" : "fixed"
});

ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

ScrollTrigger.refresh();

locoScroll.on('scroll', (position) => {
	var bgOpacity = 0 + position.scroll.y / 800;

	if (bgOpacity >= 0.75) {
		bgOpacity = 0.75;
	}

	$(".bottom-container").css("opacity", 1 - position.scroll.y / 800);
	$("#bg").css("opacity", 0.7 - position.scroll.y / 800);
	$("#top-nav-container").css("backgroundColor", "rgba(7, 9, 14," + bgOpacity + ")");
});

$(document).ready(function () {
	$("#loading-wrap").fadeOut();

	var contentSections = $(".cd-section"),
		navigationItems = $("#cd-vertical-nav a"),
		downArrow = $("#bottom-arrow");

	locoScroll.on('scroll', (position) => {
		updateNavigation();
	});

	navigationItems.on("click", function (event) {
		event.preventDefault();

		locoScroll.scrollTo($(this).attr("href"), -60);
	});

	function updateNavigation() {
		contentSections.each(function () {
			$this = $(this);
			var activeSection =
				$('#cd-vertical-nav a[href="#' + $this.attr("id") + '"]').data(
					"number"
				) - 1;
			if (
				$this.offset().top - $(window).height() / 2 <
				$(window).scrollTop() &&
				$this.offset().top + $this.height() - $(window).height() / 2 >
				$(window).scrollTop()
			) {
				navigationItems.eq(activeSection).addClass("is-selected");
			} else {
				navigationItems.eq(activeSection).removeClass("is-selected");
			}
		});
	}
});

function smoothScroll(target) {
	locoScroll.scrollTo(target.offset().top - 60);
}

locoScroll.on('call', func => {
	$(func).animate({
		'opacity': '1',
		'top': '0px',
	}, 800);
});

// -----------------------------------------------------

var headline = $(".landing-text, .landing-text-red");
var char = '[class*="char"]';
var char2 = '[class*="khar"]';
var tl = new TimelineLite();
var tl2 = new TimelineLite();

// Using lettering.js to wrap a <span> around each word and a <span> around each character.
// headline.lettering("words").children("span").lettering();

tl.staggerFrom(char, 0.4, {
	y: "100%",
	ease: "inOutCubic"
}, 0.03);

$.wait = function(ms) {
    var defer = $.Deferred();
    setTimeout(function() { defer.resolve(); }, ms);
    return defer;
};

tl2.staggerFrom(char2, 0.4, {
	y: "100%",
	ease: "inOutCubic"
}, 0.03);
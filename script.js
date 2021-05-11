// var html = document.documentElement;
// var body = document.body;

// var scroller = {
// 	target: document.querySelector("#scroll-container"),
// 	ease: 0.08, // <= scroll speed
// 	endY: 0,
// 	y: 0,
// 	resizeRequest: 1,
// 	scrollRequest: 0,
// };

// var requestId = null;

// TweenLite.set(scroller.target, {
// 	rotation: 0.01,
// 	force3D: true
// });

// window.addEventListener("load", onLoad);

// function onLoad() {
// 	updateScroller();
// 	window.focus();
// 	window.addEventListener("resize", onResize);
// 	document.addEventListener("scroll", onScroll);
// }

// function updateScroller() {

// 	var resized = scroller.resizeRequest > 0;

// 	if (resized) {
// 		var height = scroller.target.clientHeight;
// 		body.style.height = height + "px";
// 		scroller.resizeRequest = 0;
// 	}

// 	var scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

// 	scroller.endY = scrollY;
// 	scroller.y += (scrollY - scroller.y) * scroller.ease;

// 	if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
// 		scroller.y = scrollY;
// 		scroller.scrollRequest = 0;
// 	}

// 	TweenLite.set(scroller.target, {
// 		y: -scroller.y
// 	});

// 	requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
// }

// function onScroll() {
// 	scroller.scrollRequest++;
// 	if (!requestId) {
// 		requestId = requestAnimationFrame(updateScroller);
// 	}
// }

// function onResize() {
// 	scroller.resizeRequest++;
// 	if (!requestId) {
// 		requestId = requestAnimationFrame(updateScroller);
// 	}
// }

// $('*').on('focus', function () {
// 	scroller.resizeRequest++;
// 	if (!requestId) {
// 		requestId = requestAnimationFrame(updateScroller);
// 	}
// });

const locoScroll = new LocomotiveScroll({
	el: document.querySelector(".scroll-container"),
	smooth: true,
	lerp: 0.07
});

// each time Locomotive Scroll updates, tell ScrollTrigger to update too (sync positioning)

locoScroll.on("scroll", ScrollTrigger.update);

// tell ScrollTrigger to use these proxy methods for the ".smooth-scroll" element since Locomotive Scroll is hijacking things
ScrollTrigger.scrollerProxy(".scroll-container", {
	scrollTop(value) {
		return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
	}, // we don't have to define a scrollLeft because we're only scrolling vertically.
	getBoundingClientRect() {
		return {
			top: 0,
			left: 0,
			width: window.innerWidth,
			height: window.innerHeight
		};
	},
	// LocomotiveScroll handles things completely differently on mobile devices - it doesn't even transform the container at all! So to get the correct behavior and avoid jitters, we should pin things with position: fixed on mobile. We sense it by checking to see if there's a transform applied to the container (the LocomotiveScroll-controlled element).
	pinType: document.querySelector(".scroll-container").style.transform ? "transform" : "fixed"
});

// each time the window updates, we should refresh ScrollTrigger and then update LocomotiveScroll. 
ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// after everything is set up, refresh() ScrollTrigger and update LocomotiveScroll because padding may have been added for pinning, etc.
ScrollTrigger.refresh();

locoScroll.on('scroll', (position) => {
	$(".bottom-container").css("opacity", 1 - position.scroll.y / 800);
});

$(document).ready(function () {
	var contentSections = $(".cd-section"),
		navigationItems = $("#cd-vertical-nav a"),
		downArrow = $("#bottom-arrow");

	locoScroll.on('scroll', (position) => {
		updateNavigation();
	});

	//smooth scroll to the section
	navigationItems.on("click", function (event) {
		event.preventDefault();
		// smoothScroll($(this.hash));

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
	// $("body, html").animate({
	// 	scrollTop: target.offset().top
	// }, 600);
	locoScroll.scrollTo(target.offset().top - 60);
}

locoScroll.on('call', func => {
	$(func).animate({
		'opacity': '1',
		'top': '0px',
	}, 800);
});

// -----------------------------------------------------

init = () => {
	wait(250).then(() => {
		clearText();
		typeText(" ").then(typeLoop);
	});

	typeLoop = () => {
		typeText("HI, I'M JACOB. \n")
			.then(() => wait(800))
			.then(() => typeText("A UI/UX DESIGNER."))
		// .then(() => removeText("HI, I'M JACOB. \n A UI/UX DESIGNER."))
		// .then(typeLoop);
	}
}

const elementNode = document.getElementById("landing-text");
let text = "";

updateNode = () => {
	elementNode.innerText = text;
}

pushCharacter = (character) => {
	text += character;
	updateNode();
}

popCharacter = () => {
	text = text.slice(0, text.length - 1);
	updateNode();
}

clearText = () => {
	text = "";
	updateNode();
}

wait = (time) => {
	if (time === undefined) {
		const randomMsInterval = 100 * Math.random();
		time = randomMsInterval < 50 ? 10 : randomMsInterval;
	}

	return new Promise((resolve) => {
		setTimeout(() => {
			requestAnimationFrame(resolve);
		}, time);
	});
}

typeCharacter = (character) => {
	return new Promise((resolve) => {
		pushCharacter(character);
		wait().then(resolve);
	});
}

removeCharacter = () => {
	return new Promise((resolve) => {
		popCharacter();
		wait().then(resolve);
	});
};

typeText = (text) => {
	return new Promise((resolve) => {
		function type([character, ...text]) {
			typeCharacter(character).then(() => {
				if (text.length) type(text);
				else resolve();
			});
		}

		type(text);
	});
}

removeText = ({
	length: amount
}) => {
	return new Promise((resolve) => {
		function remove(count) {
			removeCharacter().then(() => {
				if (count > 1) {
					remove(count - 1);
				} else {
					resolve();
				}
			});
		}

		remove(amount);
	});
}

init();
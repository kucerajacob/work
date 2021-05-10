var html = document.documentElement;
var body = document.body;

var scroller = {
	target: document.querySelector("#scroll-container"),
	ease: 0.05, // <= scroll speed
	endY: 0,
	y: 0,
	resizeRequest: 1,
	scrollRequest: 0,
};

var requestId = null;

TweenLite.set(scroller.target, {
	rotation: 0.01,
	force3D: true
});

window.addEventListener("load", onLoad);

function onLoad() {
	updateScroller();
	window.focus();
	window.addEventListener("resize", onResize);
	document.addEventListener("scroll", onScroll);
}

function updateScroller() {

	var resized = scroller.resizeRequest > 0;

	if (resized) {
		var height = scroller.target.clientHeight;
		body.style.height = height + "px";
		scroller.resizeRequest = 0;
	}

	var scrollY = window.pageYOffset || html.scrollTop || body.scrollTop || 0;

	scroller.endY = scrollY;
	scroller.y += (scrollY - scroller.y) * scroller.ease;

	if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
		scroller.y = scrollY;
		scroller.scrollRequest = 0;
	}

	TweenLite.set(scroller.target, {
		y: -scroller.y
	});

	requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
}

function onScroll() {
	scroller.scrollRequest++;
	if (!requestId) {
		requestId = requestAnimationFrame(updateScroller);
	}
}

function onResize() {
	scroller.resizeRequest++;
	if (!requestId) {
		requestId = requestAnimationFrame(updateScroller);
	}
}

$('*').on('focus', function () {
	scroller.resizeRequest++;
	if (!requestId) {
		requestId = requestAnimationFrame(updateScroller);
	}
});

$(window).scroll(function () {
	$(".bottom-container").css("opacity", 1 - $(window).scrollTop() / 850);
});

$(document).ready(function () {
	var contentSections = $(".cd-section"),
		navigationItems = $("#cd-vertical-nav a"),
		downArrow = $("#bottom-arrow");

	updateNavigation();

	$(window).on("scroll", function () {
		updateNavigation();
	});

	//smooth scroll to the section
	navigationItems.on("click", function (event) {
		event.preventDefault();
		smoothScroll($(this.hash));
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

	$(window).scroll(function () {
		$('.fade').each(function (i) {
			var bottomOfObject = $(this).position().top + 150;
			var bottomOfWindow = $(window).scrollTop() + $(window).height();

			if (bottomOfWindow > bottomOfObject) {
				$(this).animate({
					'opacity': '1',
					'top': '0px',
				}, 900);
			}
		});
	});
});

function smoothScroll(target) {
	$("body, html").animate({
		scrollTop: target.offset().top - 58
	}, 600);
}

// asdkfljhasdkfjhaklsjdfhalksdjhfkaljsdhfalskjfhakjlsdfh

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

removeText = ({ length: amount }) => {
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
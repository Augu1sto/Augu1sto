/**
 * 导航栏滑动效果
 */
// requestAnimationFrame节流函数
function throttle (func) {
	let flag = true;
	return function () {
		let context = this;
		let args = arguments;
		if (!flag) return;
		flag = false;
		window.requestAnimationFrame(() => {
			func.apply(context, args);
			flag = true;
		});
	};
}
// 防抖函数
function debounce (func, wait) {
	let timeout;
	return function () {
		let context = this;
		let args = [...arguments];
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(() => {
			func.apply(context, args);
			firstTime = true;
		}, wait);
	};
}

/**
 * navigator 滑块
 */
var tabitems = document.querySelectorAll(".nav-list>li");
var hoverBox = document.querySelector(".nav-list .hover-box");
var navList = document.querySelector(".nav-list");

/**
 * 鼠标离开导航栏
 * hoverBox回到activeBox处
 */
function leaveNav () {
	let activeItem = document.querySelector(".nav-list>li.active");
	let hoverLeft = activeItem.offsetLeft;
	hoverBox.style = `
			left: ${hoverLeft}px;
			opacity: 0;
			transition: left 0.8s ease;
		`;

	activeItem.style = `
			--active-color: var(--highlight-color);
		`;
}
// 绑定鼠标离开事件
navList.onmouseleave = debounce(leaveNav, 300);

/**
 * 鼠标在导航栏上滑动
 *
 */

function move (e) {
	let activeItem = document.querySelector(".nav-list>li.active");
	if (
		!e.target.closest(".nav-list>li").classList.contains("active") ||
		activeItem.style["--active-color"] == "transparent" // 证明已经在导航栏移动了
	) {
		activeItem.style = `
			--active-color: transparent;
		`;
		let hoverLeft = e.target.closest("li").offsetLeft;
		// console.log(hoverLeft);
		let hoverWidth = window.getComputedStyle(activeItem).width;
		hoverBox.style = `
			width: ${hoverWidth};
			left: ${hoverLeft}px;
			transition: all 0.3s ease;
		`;
	}
}

tabitems.forEach((item) => {
	// 绑定事件
	item.onmouseover = function (e) {
		if (e.target.className !== 'nav-submenu' && e.target.closest('ul').className !== 'nav-submenu') {
			throttle(move)(e);
		}
	};
	item.onclick = function () {
		let activeItem = document.querySelector(".nav-list>li.active");
		if (activeItem !== item) {
			activeItem.classList.toggle("active");
			item.classList.toggle("active");
			// item = document.querySelector(".nav-list>li.active");
			item.style = `
				--active-color: var(--highlight-color);
				transition: all 0.3s ease;
			`;
			let hoverLeft = activeItem.offsetLeft;
			let hoverWidth = window.getComputedStyle(activeItem).width;
			hoverBox.style = `
				width: ${hoverWidth};
				left: ${hoverLeft}px;
				opacity: 0;
			`;
		}
	};
});


/**
 * 页面滚动100px时导航栏改变样式，显示回到顶部按钮
 */
function onscroll () {
	let top = document.documentElement.scrollTop;
	// console.log(top);
	if (top > 0) {
		document.querySelector('.navbar').style['background-color'] = '#2b8375d6';
		document.querySelector('.navbar').style['box-shadow'] = '2px 0 5px #333';
		document.querySelector('.totop').style.display = 'block';
	} else {
		document.querySelector('.navbar').style['background-color'] = 'transparent';
		document.querySelector('.navbar').style['box-shadow'] = 'none';
		document.querySelector('.totop').style.display = 'none';
	}
}

window.addEventListener('scroll', debounce(onscroll, 100));

/**
 * 滚动 动态给menu添加样式
 */
let sectionList = ["#welcome-section","#function-section","#develop-section","#tech-section","#contact-section"];
function spyonScroll() {
	tabitems.forEach((item, index) => {
		// console.log(index);
		let sectionItem = document.querySelector(sectionList[index]);
		if (Math.abs(window.pageYOffset - sectionItem.offsetTop) < 100) {
			item.click();
			// item.querySelector('li>a').click();
		}
	}); 
}

window.addEventListener('scroll', throttle(spyonScroll));



/**
 * 点击涟漪特效
 */
const btns = document.querySelectorAll(".btn");
btns.forEach((btn) => {
	btn.addEventListener("click", (e) => {
		// 创建span元素，并设置其为鼠标点击的位置
		let span = document.createElement("span");
		span.style.left = e.offsetX + "px";
		span.style.top = e.offsetY + "px";
		// 将span元素添加到按钮标签里
		btn.appendChild(span);
		// 1s后删除元素
		setTimeout(() => {
			span.remove();
		}, 1000);
	});
});



/**
 * sub-section展开
 */
const wrapper = document.querySelector(".sub-section");

wrapper.addEventListener("click", function (e) {
	console.log(e.target.closest("div").className)
	if (e.target.closest("div").className!=='sub__content') {
		//   获取当前展开的节点
		let currActiveAccordion = document.querySelector(".sub.open") || null;
		//   获取当前点击的节点
		activeAccordion = e.target.closest(".sub");
		//   关闭当前展开的节点
		if (currActiveAccordion) {
			currActiveAccordion.classList.remove("open");
		}
		//   如果当前点击的节点没有展开，则进行展开操作
		if (activeAccordion !== currActiveAccordion) {
			let innerContentHeight = 0;

			let test = activeAccordion.querySelector(".sub__content");
			innerContentHeight = window.getComputedStyle(test).getPropertyValue("height"); // 包含px的字符串

			activeAccordion.style.setProperty("--max-height", innerContentHeight);
			activeAccordion.classList.add("open");
		}
	}

});

/**
 * 点击submenu
 */
const subs = document.querySelector("ul.nav-submenu");

subs.addEventListener("click", function (e) {
	// e.stopPropagation();
	// console.log(e.target.href.split('#')[1]);
	let eid = e.target.href.split('#')[1];
	let accordion = document.querySelector(`#${eid}`);
	accordion.click();
});
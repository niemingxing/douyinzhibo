let currentDomain = window.location.hostname;
let autoReplyText = '';
let isAutoReply = false;
/**
 * 初始化弹层
 */
function initToolButton() {
	const html = '<div class="gpt-sr-container">\n' +
		'    <div class="gpt-sr-sidebar">\n' +
		'      <button id="dylive-sr-toggleButton">开启自动回复</button>\n' +
		'    </div>\n' +
		'  </div>\n' +
		'  \n' +
		'  <div id="dylive-sr-popup" class="gpt-sr-popup">\n' +
		'    <button class="gpt-sr-close-btn">&times;</button>\n' +
		'	 <button class="gpt-sr-starting-btn">开始执行</button>\n' +
		'    <div class="gpt-sr-content">\n' +
		'      <h2 class="gpt-sr-title">关键词列表</h2>\n' +
		'      <ul class="gpt-sr-list">\n' +
		'      </ul>\n' +
		'    </div>\n' +
		'  </div>';
	const popupElement = document.createElement("div");
	popupElement.innerHTML = html;
	document.body.appendChild(popupElement);
	document.querySelector("#dylive-sr-toggleButton").addEventListener("click", function() {
		if(this.innerText.includes("开启自动回复"))
		{
			this.disabled = true;
			isAutoReply = true;
			this.style.backgroundColor = 'red';
			this.innerText = this.innerText.replace("开启自动回复","关闭自动回复");
			chrome.runtime.sendMessage({"type":"check_mkey"}, function (response) {
				console.log(response.farewell)
			});
		}
		else if(this.innerText.includes("关闭自动回复"))
		{
			this.disabled = false;
			isAutoReply = false;
			this.style.backgroundColor = '#00bebd';
			this.innerText = this.innerText.replace("关闭自动回复","开启自动回复");
		}
	});
}

function activiteToolButton()
{
	document.querySelector("#dylive-sr-toggleButton").disabled = false;
}

/**
 * 初始化提示窗
 */
function initPromptMessagePopup()
{
	let html = "<div id=\"nmx_dylive_popup\" class=\"custom-popup\">\n" +
		"\t\t<div class=\"custom-popup-overlay\"></div>\n" +
		"\t\t<div class=\"custom-popup-content\">\n" +
		"\t\t\t<span id=\"nmx_dylive_popup_message\" class=\"custom-popup-question\"></span>\n" +
		"\t\t\t<button id=\"nmx_dylive_close_popupbtn\" class=\"custom-popup-close-btn\">确认</button>\n" +
		"\t\t</div>\n" +
		"\t</div>";
	const popupElement = document.createElement("div");
	popupElement.innerHTML = html;
	document.body.appendChild(popupElement);
	// 获取弹窗元素
	const popup = document.getElementById('nmx_dylive_popup');
	// 获取关闭按钮元素
	const closeButton = document.getElementById('nmx_dylive_close_popupbtn');

	// 点击关闭按钮关闭弹窗
	closeButton.addEventListener('click', function (){
		popup.style.display = 'none';
	});
}


// 显示弹窗并设置错误提示文字
function showPromptMessagePopup(message,type =1) {
	// 获取弹窗元素
	const popup = document.getElementById('nmx_dylive_popup');
	// 获取错误提示元素
	const errorText = document.getElementById('nmx_dylive_popup_message');
	errorText.textContent = message;
	popup.style.display = 'block';
	if(type == 2)
	{
		// 获取关闭按钮元素
		const closeButton = document.getElementById('nmx_dylive_close_popupbtn');
		closeButton.style.display = 'none';
		setTimeout(function (){
			closeButton.click();
		},3000);
	}
}

/**
 * 引入css文件
 * @param url
 */
function addStylesheet(url) {
	const linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	linkElement.type = "text/css";
	linkElement.href = chrome.runtime.getURL(url);
	document.head.appendChild(linkElement);
}

function startAutoReply()
{
	let chatTextArea = document.querySelector("textarea.webcast-chatroom___textarea");
	let sendButton = document.querySelector("button.webcast-chatroom___send-btn");
	const minDelay = 1000; // 最小等待时间，单位毫秒
	const maxDelay = 3000; // 最大等待时间，单位毫秒

	let intervalId = setInterval(() => {
		if(!isAutoReply) clearInterval(intervalId);
		const delay = getRandomDelay(minDelay, maxDelay);
		setTimeout(() => {
			inputDispatchEventEvent(chatTextArea,autoReplyText);
			setTimeout(function (){
				sendButton.click();
			},500);
		}, delay);
	}, 5000); // 这里设置 setInterval 的时间间隔为最大等待时间
}

function getRandomDelay(min, max) {
	// 生成一个[min, max]之间的随机数，单位是毫秒
	return Math.floor(Math.random() * (max - min + 1)) + min;
}


/**
 * input对象输入、改变、键盘事件分发
 * @param obj
 * @param value
 */
function inputDispatchEventEvent(obj,value)
{
	let inputEvent = new InputEvent('input', {
		bubbles: true,
		cancelable: true,
		inputType: 'insertText',
		data:value
	});
	let changeEvent = new Event('change', {
		bubbles: true,
		cancelable: true
	});
	let keyUpEvent = new KeyboardEvent('keyup', {
		key: '',
		bubbles: true,
		cancelable: true
	});
	obj.value = value;
	obj.focus();
	obj.dispatchEvent(inputEvent);
	obj.dispatchEvent(changeEvent);
	obj.dispatchEvent(keyUpEvent);
}

function initSetting(callback)
{
	// 获取存储的值
	chrome.storage.local.get('nmx_dylive_setting', function (data) {
		autoReplyText = (data.hasOwnProperty("nmx_dylive_setting") && data.nmx_dylive_setting.hasOwnProperty("autoReply")) ? data.nmx_dylive_setting.autoReply : '';
		// 在这里使用存储的值
		console.log(autoReplyText);
		if(callback) callback();
	});
}
// 在页面加载完成后插入弹层和引入CSS文件
window.onload = function() {
	if(currentDomain.includes("live.douyin.com"))
	{
		initSetting(function (){
			initPromptMessagePopup();
			initToolButton();
			addStylesheet("css/page_layer.css");
		});
	}
};
/**
 * 事件监听
 */
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
	window.focus();
	console.log(message.type);
	if(message.type == 'open_auto_reply')
	{
		isAutoReply = true;
		startAutoReply();
	}
	else if(message.type == 'close_auto_reply')
	{
		isAutoReply = false;
	}
	else if(message.type == 'check_mkey_complete')
	{
		activiteToolButton();
		if(message.data.hasOwnProperty("code") && message.data.code !=0)
		{
			showPromptMessagePopup(message.data.message);
		}
		else
		{
			startAutoReply();
		}
	}
});

document.documentElement.setAttribute("state", "idling");

var noScriptCss = document.createElement("link");
noScriptCss.rel = "stylesheet";
noScriptCss.href = window.location.origin + "/assets/noscript.css";
document.head.appendChild(noScriptCss);

var ieWarningShim = document.createElement("div");
ieWarningShim.style.cssText =
	'display:flex; justify-content:center; flex-direction:column; align-items:center; height:100vh; width:100vw; background-color:white; position:fixed; top:0; left:0; z-index:9999999999; overflow:hidden; font-family: "Arial", serif;';
var browsers = [
	{
		name: "Chrome",
		downloadLink: "https://www.google.com/chrome/",
		icon: window.location.origin + "/static/images/ie-warning/chrome.png",
	},
	{
		name: "Firefox",
		downloadLink: "https://www.mozilla.org/en-US/firefox/new/",
		icon: window.location.origin + "/static/images/ie-warning/firefox.png",
	},
	{
		name: "Safari",
		downloadLink: "https://support.apple.com/downloads/safari",
		icon: window.location.origin + "/static/images/ie-warning/safari.png",
	},
	{
		name: "Microsoft Edge",
		downloadLink: "https://www.microsoftedgeinsider.com/en-us/download",
		icon: window.location.origin + "/static/images/ie-warning/edge.png",
	},
];

var logoShim = document.createElement("div");
logoShim.style.cssText = "display:flex; flex-direction:row; align-items:center; justify-content:center; width:auto; height:auto;";

for (var i = 0; i < browsers.length; i++) {
	var browserLink = document.createElement("a");
	browserLink.href = browsers[i].downloadLink;
	browserLink.target = "_blank";
	browserLink.style.cssText = "margin:20px; background-size:contain; background-position:center; background-repeat:no-repeat;transition:all 150ms ease-in-out;";
	browserLink.addEventListener("mouseenter", function(e) {
		e.currentTarget.style.transform = "translateY(-0.5rem)";
	});
	browserLink.addEventListener("mouseleave", function(e) {
		e.currentTarget.style.transform = "translateY(0rem)";
	});
	var broswerLogo = document.createElement("img");
	broswerLogo.src = browsers[i].icon;
	broswerLogo.alt = `${browsers[i].name} logo`;
	broswerLogo.style.cssText = "width:80px;height:80px;";
	browserLink.appendChild(broswerLogo);
	logoShim.appendChild(browserLink);
}
ieWarningShim.appendChild(logoShim);

var warningTextShim = document.createElement("p");
warningTextShim.style.cssText = "font-size:20px; max-width:500px; text-align:center; padding-top:.5rem; line-height:1.4;";
warningTextShim.innerHTML = "Your current browser is not support by this website. Please download one of the modern broswers above.";
ieWarningShim.appendChild(warningTextShim);

var closeWarningShim = document.createElement("div");
var closeWarningButton = document.createElement("button");
closeWarningButton.style.cssText =
	"line-height: 48px; height: 48px; padding: 0 2rem; margin:2rem 0 0; border-radius: 0.125rem; font-size: 0.875rem; text-decoration: none; color: #fff; background-color: #55acee; box-shadow: 0 1px 3px rgba(51,51,51,0.1), 0 2px 8px rgba(51,51,51,0.1);text-transform:uppercase;font-weight:600;";
closeWarningButton.innerHTML = "Continue anyways";
closeWarningShim.appendChild(closeWarningButton);
closeWarningButton.addEventListener("click", function() {
	document.documentElement.removeChild(ieWarningShim);
});
ieWarningShim.appendChild(closeWarningShim);

document.documentElement.appendChild(ieWarningShim);
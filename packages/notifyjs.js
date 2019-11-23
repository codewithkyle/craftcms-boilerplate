// @ts-nocheck

export const NotificationManager = (function() {
	function NotificationManager() {
		this.handleCloseClickEvent = this.removeNotification.bind(this);
		this.handleActionButtonClick = this.activateButton.bind(this);
		this._queue = [];
		this._callback = function() {};
		this._isRunning = false;
		this._time = 0;
	}
	NotificationManager.prototype.activateButton = function(e) {
		var buttonEl = e.currentTarget;
		var button = this._queue[0].buttons[parseInt(buttonEl.dataset.index)];
		button.callback();
		this.removeNotification();
	};
	NotificationManager.prototype.createNotification = function(notification) {
		var el = document.createElement('snackbar-component');
		el.setAttribute('position', notification.position);
		var message = document.createElement('p');
		message.innerText = notification.message;
		el.appendChild(message);
		if (notification.closeable || notification.buttons.length) {
			var actionsWrapper = document.createElement('snackbar-actions');
			if (notification.buttons.length) {
				for (var i = 0; i < notification.buttons.length; i++) {
					var button = document.createElement('button');
					button.innerText = notification.buttons[i].label;
					button.dataset.index = '' + i;
					if (notification.buttons[i].ariaLabel) {
						button.setAttribute('aria-label', notification.buttons[i].ariaLabel);
					}
					button.addEventListener('click', this.handleActionButtonClick);
					actionsWrapper.appendChild(button);
				}
			}
			if (notification.closeable) {
				var closeButton = document.createElement('close-button');
				closeButton.setAttribute('aria-label', 'close notification');
				closeButton.setAttribute('aria-pressed', 'false');
				closeButton.setAttribute('role', 'button');
				closeButton.innerHTML =
					'<svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="times" class="svg-inline--fa fa-times fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M207.6 256l107.72-107.72c6.23-6.23 6.23-16.34 0-22.58l-25.03-25.03c-6.23-6.23-16.34-6.23-22.58 0L160 208.4 52.28 100.68c-6.23-6.23-16.34-6.23-22.58 0L4.68 125.7c-6.23 6.23-6.23 16.34 0 22.58L112.4 256 4.68 363.72c-6.23 6.23-6.23 16.34 0 22.58l25.03 25.03c6.23 6.23 16.34 6.23 22.58 0L160 303.6l107.72 107.72c6.23 6.23 16.34 6.23 22.58 0l25.03-25.03c6.23-6.23 6.23-16.34 0-22.58L207.6 256z"></path></svg>';
				closeButton.addEventListener('click', this.handleCloseClickEvent);
				actionsWrapper.appendChild(closeButton);
			}
			el.appendChild(actionsWrapper);
		}
		document.body.appendChild(el);
		notification.element = el;
	};
	NotificationManager.prototype.removeNotification = function() {
		var closeButton = this._queue[0].element.querySelector('close-button');
		if (closeButton) {
			closeButton.removeEventListener('click', this.handleCloseClickEvent);
		}
		var buttons = Array.from(this._queue[0].element.querySelectorAll('button'));
		if (buttons.length) {
			for (var i = 0; i < buttons.length; i++) {
				buttons[i].removeEventListener('click', this.activateButton);
			}
		}
		this._queue[0].element.remove();
		this._queue.splice(0, 1);
		if (this._queue.length !== 0) {
			this.createNotification(this._queue[0]);
		} else {
			this.stopCallback();
		}
	};
	NotificationManager.prototype.startCallback = function() {
		if (this._isRunning) {
			return;
		}
		this._isRunning = true;
		this._callback = this.animationFrameCallback.bind(this);
		this._time = performance.now();
		this._callback();
		this.createNotification(this._queue[0]);
	};
	NotificationManager.prototype.stopCallback = function() {
		this._isRunning = false;
		this._callback = function() {};
	};
	NotificationManager.prototype.animationFrameCallback = function() {
		var _this = this;
		if (this._queue.length === 0 || !this._isRunning) {
			this.stopCallback();
			return;
		}
		var newTime = performance.now();
		var deltaTime = (newTime - this._time) / 1000;
		this._time = newTime;
		if (document.hasFocus() && this._queue[0].duration !== Infinity) {
			this._queue[0].duration -= deltaTime;
			if (this._queue[0].duration <= 0) {
				this.removeNotification();
			}
		}
		window.requestAnimationFrame(function() {
			_this._callback();
		});
	};
	NotificationManager.prototype.validateNotification = function(notification) {
		return new Promise(function(resolve, reject) {
			var newNotification = {};
			var warnings = [];
			if (notification.element) {
				reject('Notifications create their own HTMLElement, do not provide one.');
			}
			if (!notification.message) {
				reject('Notifications require a message.');
			} else {
				newNotification.message = notification.message;
			}
			if (notification.closeable) {
				newNotification.closeable = notification.closeable;
			} else {
				newNotification.closeable = false;
			}
			if (notification.duration) {
				if (notification.duration > 30) {
					newNotification.duration = 30;
				} else if (notification.duration < 10) {
					newNotification.duration = 10;
				} else {
					newNotification.duration = notification.duration;
				}
				if (notification.duration === Infinity && newNotification.closeable) {
					newNotification.duration = Infinity;
				}
			} else {
				newNotification.duration = 10;
			}
			if (notification.position) {
				if (notification.position.match('top')) {
					newNotification.position = 'top';
				} else if (notification.position.match('bottom')) {
					newNotification.position = 'bottom';
				} else {
					newNotification.position = 'bottom';
				}
				if (notification.position.match('left')) {
					newNotification.position += ' left';
				} else if (notification.position.match('right')) {
					newNotification.position += ' right';
				} else if (notification.position.match('center')) {
					newNotification.position += ' center';
				} else {
					newNotification.position += ' center';
				}
			} else {
				newNotification.position = 'bottom center';
			}
			if (notification.buttons) {
				var buttons = [];
				for (var i = 0; i < notification.buttons.length; i++) {
					var button = {};
					var newWarnings = [];
					if (notification.buttons[i].label) {
						button.label = notification.buttons[i].label;
					} else {
						newWarnings.push('Buttons require a label.');
					}
					if (notification.buttons[i].callback) {
						if (typeof notification.buttons[i].callback === 'function') {
							button.callback = notification.buttons[i].callback;
						} else {
							newWarnings.push('Buttons callbacks must be a function.');
						}
					} else {
						newWarnings.push('Buttons require a callback function.');
					}
					if (notification.buttons[i].ariaLabel) {
						button.ariaLabel = notification.buttons[i].ariaLabel;
					}
					warnings = warnings.concat(newWarnings);
					if (newWarnings.length === 0) {
						buttons.push(button);
					}
				}
				if (buttons.length) {
					newNotification.buttons = buttons;
				}
			} else {
				newNotification.buttons = [];
			}
			if (notification.force) {
				newNotification.force = notification.force;
			} else {
				newNotification.force = false;
			}
			resolve({ validNotification: newNotification, warnings: warnings });
		});
	};
	NotificationManager.prototype.notify = function(notification) {
		var _this = this;
		this.validateNotification(notification)
			.then(function(response) {
				if (_this._queue.length === 0 || !response.validNotification.force) {
					_this._queue.push(response.validNotification);
				} else if (_this._queue.length > 0 && response.validNotification.force) {
					_this._queue.splice(1, 0, response.validNotification);
					_this.removeNotification();
				}
				_this.startCallback();
				if (response.warnings.length !== 0) {
					for (var i = 0; i < response.warnings.length; i++) {
						console.warn(response.warnings[i]);
					}
				}
			})
			.catch(function(error) {
				console.error(error);
			});
	};
	return NotificationManager;
})();

const globalManager = new NotificationManager();
export const notify = globalManager.notify.bind(globalManager);

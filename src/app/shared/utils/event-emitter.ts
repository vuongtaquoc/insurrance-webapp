import isArray from 'lodash/isArray';
import pull from 'lodash/pull';
import forEach from 'lodash/forEach';
import isFunction from 'lodash/isFunction';

export class EventEmitter {
	private handlers: any = {};

	on(event, handler) {
		if (!event || !isFunction(handler)) {
			return this.createDehandler();
		}

		this.handlers[event] = this.handlers[event] || [];

		this.handlers[event].push(handler);

		return this.createDehandler(event, handler);
	}

	emit(event, data?) {
		const handlers = this.handlers[event];

		forEach(handlers, (handler) => {
			handler.call(this, data);
		});

		return !!handlers;
	}

	destroyAll() {
		forEach(this.handlers, (value) => {
			value.length = 0;
		});

		this.handlers = null;
	}

	destroy(handlers) {
		while (handlers.length > 0) {
			const handler = handlers.pop();

			handler();
		}
	}

	private createDehandler(event?, handler?) {
		return () => {
			let handlers = this.handlers[event];

			if (isArray(handlers)) {
				pull(handlers, handler);

				if (handlers.length === 0) {
					delete this.handlers[event];
				}
			}

			event = null;
			handlers = null;
			handler = null;
		};
	}
}

export const eventEmitter = new EventEmitter();

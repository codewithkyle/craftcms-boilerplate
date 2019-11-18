class PjaxWorker {
	constructor() {
		self.onmessage = this.handleMessage.bind(this);
	}

	private handleMessage(e: MessageEvent): void {
		const { type } = e.data;
		switch (type) {
			case 'revision-check':
				this.checkRevision(e.data.pageId, e.data.revision, e.data.url);
				break;
			default:
				console.error(`Unknown Pjax Worker message type: ${type}`);
				break;
		}
	}

	private async checkRevision(pageId: string, revision: string, url: string) {
		try {
			const request = await fetch(`${self.origin}/pwa/revision-check&id=${pageId}`);
			if (request.ok) {
				const response = await request.json();
				if (response.success) {
					if (response.revision !== revision) {
						// @ts-ignore
						self.postMessage({
							type: 'revision-check',
							status: 201,
						});
					}
				} else {
					throw `Failed to get revision number from CMS. Make sure the entries section, category, or single supports revisions.`;
				}
			} else {
				throw `Failed to get revision from CMS. Server respond with: ${request.status}: ${request.statusText}`;
			}
		} catch (error) {
			console.error(error);
		}
	}
}
new PjaxWorker();

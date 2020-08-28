import type { example } from "@models/example";

class ExampleController {
	private example: example;

	constructor() {
		this.example = {
			foo: "test",
		};
	}
}
const exampleController = new ExampleController();
export { exampleController };

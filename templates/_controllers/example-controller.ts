import type { example } from "types/example";

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

export type PassiveModalSettings = {
	heading: string;
	message: string;
	size?: "small" | "medium" | "large";
	className?: string;
};

export type ConfirmModalSettings = {
	heading: string;
	message: string;
	size?: "small" | "medium" | "large";
	rejectLabel?: string;
	confirmLabel?: string;
	dangerous?: boolean;
	className?: string;
};

export type FormModalSettings = {
	heading?: string;
	message?: string;
	size?: "small" | "medium" | "large";
	form: HTMLFormElement;
	className?: string;
};

export type RawModalSettings = {
	heading?: string;
	message?: string;
	size?: "small" | "medium" | "large";
	el: HTMLElement | string;
	className?: string;
};

declare const passive: (settings: Partial<PassiveModalSettings>) => void;
declare const confirm: (settings: Partial<ConfirmModalSettings>) => Promise<void>;
declare const form: (settings: Partial<FormModalSettings>) => Promise<FormData>;
declare const raw: (settings: Partial<RawModalSettings>) => void;
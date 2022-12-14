export type NamedWizardSeed = WizardParts & { background: WizardBgColors };

export type WizardSeed = { [T in keyof NamedWizardSeed]: number };
export type RLEWizardSeed = { [T in keyof NamedWizardSeed]: number | string };

export type WizardBgColors = "#c5a3e2" | "#a4addd" | "#e0a4ad";
export type WizardParts = {
	skin: SkinPart;
	cloth: ClothPart;
	eye: EyePart;
	mouth: MouthPart;
	acc: AccPart;
	item: ItemPart;
	hat: HatPart;
	one: OnePart;
};

export type SkinPart =
	| "skin_1"
	| "skin_2"
	| "skin_3"
	| "skin_4"
	| "skin_5"
	| "skin_6"
	| "skin_7"
	| "skin_8"
	| "skin_9"
	| "skin_10"
	| "skin_11"
	| "skin_12"
	| "skin_13";

export type ClothPart =
	| "cloth_1"
	| "cloth_2"
	| "cloth_3"
	| "cloth_4"
	| "cloth_5"
	| "cloth_6"
	| "cloth_7"
	| "cloth_8"
	| "cloth_9"
	| "cloth_10"
	| "cloth_11"
	| "cloth_12"
	| "cloth_13"
	| "cloth_14"
	| "cloth_15"
	| "cloth_16"
	| "cloth_17"
	| "cloth_18"
	| "cloth_19"
	| "cloth_20";

export type EyePart =
	| "eye_1"
	| "eye_2"
	| "eye_3"
	| "eye_4"
	| "eye_5"
	| "eye_6"
	| "eye_7";

export type MouthPart =
	| "mouth_1"
	| "mouth_2"
	| "mouth_3"
	| "mouth_4"
	| "mouth_5"
	| "mouth_6"
	| "mouth_7"
	| "mouth_8"
	| "mouth_9"
	| "mouth_10"
	| "mouth_11"
	| "mouth_12"
	| "mouth_13"
	| "mouth_14"
	| "mouth_15"
	| "mouth_16";

export type AccPart =
	| "acc_1"
	| "acc_2"
	| "acc_3"
	| "acc_4"
	| "acc_5"
	| "acc_6"
	| "acc_7"
	| "acc_8";

export type ItemPart =
	| "item_1"
	| "item_2"
	| "item_3"
	| "item_4"
	| "item_5"
	| "item_6"
	| "item_7"
	| "item_8"
	| "item_9";

export type HatPart =
	| "hat_1";

export type OnePart =
	| "one_1"
	| "one_2"
	| "one_3"
	| "one_4"
	| "one_5"
	| "one_6"
	| "one_7"
	| "one_8"
	| "one_9"
	| "one_10"
	| "one_11"
	| "one_12"
	| "one_13"
	| "one_14"
	| "one_15"
	| "one_16"
	| "one_17"
	| "one_18"
	| "one_19"
	| "one_20";

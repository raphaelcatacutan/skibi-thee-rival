export type Card = {
    cardTitle?: string,
    hpValue?: number,
    damageValue?: number,
    critRateValue?: number,
    skillNames?: string[],
    description?: string,
    borderColor?: string,
    overlay?: string,
    imageSrc?: string,
    score: number,
    name: string
}

export type LogInformation = {
    chosenAnimalFruit: string;
    reasonForChosenAnimalFruit: string;
    referencedName: string;
    reasonForReferencedName: string;
};

export type CardPrompt = {
    cardTitle: string;
    hpValue: number;
    damageValue: number;
    critRateValue: number;
    skillNames: string[];
    description: string;
    borderColor: string;
    overlay: string;
    imageSrc: string;
};

export type CharacterCardData = {
    logInformation: LogInformation;
    imagePrompt: string;
    cardPrompt: CardPrompt;
};

export type ImageOutputResponse = {
    success: boolean;
    outputPath: string;
};


export type FileUserInfo = {
    fileName: string;
    username: string;
};
export type ScoreResult = {
    success: boolean;
    score: number;
};

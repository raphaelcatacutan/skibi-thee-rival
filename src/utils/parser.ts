import * as types from "./types";

export function jsonToCards(
    rawData: Record<string, any>
): Record<string, types.Card> {
    return Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => {
            const card: types.Card = {
                cardTitle: value.cardTitle,
                hpValue: value.hpValue ? parseInt(value.hpValue) : undefined,
                damageValue: value.damageValue ? parseInt(value.damageValue) : undefined,
                critRateValue: value.critRateValue
                    ? parseFloat(value.critRateValue.replace("x", ""))
                    : undefined,
                skillNames: value.skillNames,
                description: value.description,
                borderColor: value.borderColor,
                overlay: value.overlay,
                imageSrc: value.imageSrc,
                score: value.score,
                name: value.name,
            };

            return [key, card];
        })
    );
}

export function jsonToExtraction(
    raw: Record<string, any>
): Record<string, types.CharacterCardData> {
    return Object.fromEntries(
        Object.entries(raw).map(([name, data]) => {
            const log = data["log_information"];

            const logInfo: types.LogInformation = {
                chosenAnimalFruit: log["chosen_animal/fruit"],
                reasonForChosenAnimalFruit: log["reason_for_chosen_animal/fruit"],
                referencedName: log["referenced_name"],
                reasonForReferencedName: log["reason_for_referenced_name"]
            };

            const card = data["card_prompt"];

            const cardPrompt: types.CardPrompt = {
                cardTitle: card.cardTitle,
                hpValue: parseInt(card.hpValue),
                damageValue: parseInt(card.damageValue),
                critRateValue: parseFloat(card.critRateValue.replace("x", "")),
                skillNames: card.skillNames,
                description: card.description,
                borderColor: card.borderColor,
                overlay: card.overlay,
                imageSrc: card.imageSrc
            };

            return [
                name,
                {
                    logInformation: logInfo,
                    imagePrompt: data.image_prompt,
                    cardPrompt
                }
            ];
        })
    );
}

export function jsonToImageOutput(
    raw: any
): types.ImageOutputResponse {
    return {
        success: Boolean(raw.success),
        outputPath: String(raw.outputPath)
    };
}

export function jsonToFileUser(raw: any): types.FileUserInfo {
    return {
        fileName: String(raw.fileName),
        username: String(raw.username)
    };
}

export function jsontoScore(raw: any): types.ScoreResult {
    return {
        success: Boolean(raw.success),
        score: Number(raw.score)
    };
}

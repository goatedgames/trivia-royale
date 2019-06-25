interface Question {
    question?: string
    imgURL?: string
    choices?: [string]
    correct?: [number]
}

interface QuestionSet {
    gameTitle?: string
    description?: string
    titleImg?: string
    questions?: [Question]
}

export { QuestionSet, Question }
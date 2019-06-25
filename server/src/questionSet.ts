interface Question {
    question?: string
    imgURL?: string
    timeLimit?: number
    choices?: string[]
    correct?: number[]
}

interface QuestionSet {
    gameTitle?: string
    description?: string
    titleImg?: string
    questions?: Question[]
}

export { QuestionSet, Question }
//@ts-check

/**
 * @typedef {Object} Answer
 * @property {string} text
 * @property {boolean} isRight
 */

/**
 * @typedef {Object} QuestionJSON
 * @property {string} text
 * @property {Answer[]} answers
 * @property {boolean} isMultiAnswer 
 */

/**
 * @typedef {Object} Question
 * @property {string} text
 * @property {Answer[]} answers
 * @property {boolean} isMultiAnswer 
 * @property {number} selectedAnswersCount
 * @property {number} rightAnswersCount
 */

/**@type {Question[]|undefined} */
let questionsData;
/**@type {HTMLDivElement|HTMLElement} */
let questionsContainer;
/**@type {HTMLDivElement|HTMLElement} */
let resultsContainer;
/**@type {number} */
let totalScore;
/**@type {number} */
let userScore;


/**
 * @returns {Promise<QuestionJSON[]|undefined>}
 */
const getQuestions = async () => {
    try {
        const response = await fetch('./questions.json');
        const json = await response.json();
        return json['questions'];
    } catch (error) {
        console.error('There is an error in fetching... Problem: Разраб доблаёб! Details: ' + error)
    };
};

/**
 * @param {string} answerId 
 * @returns {boolean}
 */
const isCorrectAnswer = answerId => {
    const questionInfo = answerId.split('-');
    if (!questionsData) return false;
    return questionsData[Number(questionInfo[1])].answers[Number(questionInfo[3])].isRight;
};

/**
 * @param {HTMLDivElement} answerElement
 * @param {number} questionIndex
 * @param {number} answerIndex
 */
const checkAnswer = (answerElement, questionIndex, answerIndex) => {
    if (!questionsData) {
        console.error('There is an error in checking answer... Problem: Manm разраба курила гашик во время беременности! ' +
            'Details: Idk how, but question data is undefined!');
        return;
    }

    const isRight = questionsData[questionIndex].answers[answerIndex].isRight;
    if (answerElement.classList.contains('selected-answer')) {
        questionsData[questionIndex].selectedAnswersCount--;
        answerElement.className = 'answer';
        if (isRight) 
            userScore--;
        answerElement.textContent = answerElement.textContent.slice(3,);
        return;
    }

    if (questionsData[questionIndex].selectedAnswersCount == questionsData[questionIndex].rightAnswersCount) {
        alert('Sie haben bereits genügend Antworten für diese Frage ausgewählt! Entfernen Sie die Auswahl einer anderen Antwort, um eine neue auszuwählen.');
        return;
    }

    if (isRight)
        userScore++;
    answerElement.textContent = '✏️ ' + answerElement.textContent;
    answerElement.classList.add('selected-answer');
    questionsData[questionIndex].selectedAnswersCount++;
};

/**
 * @param {HTMLDivElement|HTMLElement} container 
 * @param {Question[]|undefined} questionsData
 */
const fillQuestionsContainer = (container, questionsData) => {
    if (!questionsData) {
        const errorMessage = document.createElement('h2');
        errorMessage.textContent = 'Es ist ein Fehler aufgetreten. Problem: Разраба уронили в роддоме!';
        container.appendChild(errorMessage);
        return;
    }
    questionsData.forEach((question, questionIndex) => {
        const questionContainer = document.createElement('div');
        questionContainer.className = 'question-container';
        questionContainer.id = `question-${questionIndex}`;

        const questionNumber = document.createElement('h3');
        questionNumber.textContent = `№ ${questionIndex + 1}`;
        questionNumber.className = 'question-number';
        questionContainer.appendChild(questionNumber);

        const questionText = document.createElement('h2');
        questionText.textContent = question.text;
        questionContainer.appendChild(questionText);

        const questionAnswerComment = document.createElement('p');
        questionAnswerComment.className = 'answer-comment';
        questionAnswerComment.textContent = question.isMultiAnswer
            ? `Mehrere richtige Antworten (${question.rightAnswersCount})!` 
            : 'Nur eine richtige Antwort!';
        questionContainer.appendChild(questionAnswerComment);

        const answersContainer = document.createElement('div');
        answersContainer.className = 'answers-container';
        question.answers.forEach((answer, answerIndex) => {
            const answerContainer = document.createElement('div');
            answerContainer.textContent = answer.text;
            answerContainer.className = 'answer';
            answerContainer.id = `question-${questionIndex}-answer-${answerIndex}`;
            answerContainer.onclick = () => checkAnswer(answerContainer, questionIndex, answerIndex);
            answersContainer.appendChild(answerContainer);
        });
        questionContainer.appendChild(answersContainer);

        container.appendChild(questionContainer);
    });
};


document.addEventListener('DOMContentLoaded', async () => {
    totalScore = 0;
    userScore = 0;
    questionsContainer = document.getElementById('quiz-container')||document.documentElement;
    resultsContainer = document.getElementById('results-container')||document.documentElement;
    resultsContainer.style.visibility = 'collapse';
   
    questionsData = (await getQuestions())?.map(question => {
        let rightAnswersCount = 0;
        question.answers.forEach(answer => {
            if (answer.isRight) rightAnswersCount++;
        });
        totalScore += rightAnswersCount;
        return Object.assign(question, {selectedAnswersCount: 0, rightAnswersCount: rightAnswersCount});
    });
    fillQuestionsContainer(questionsContainer, questionsData);

    const endQuizButton = document.createElement('button');
    endQuizButton.textContent = 'Quiz beenden';
    endQuizButton.className = 'end-quiz-button';
    endQuizButton.onclick = () => {
        for (const answerContainer of document.getElementsByClassName('answer')) {
            if (isCorrectAnswer(answerContainer.id))
                answerContainer.classList.add('correct-answer');
            else if (answerContainer.classList.contains('selected-answer'))
                answerContainer.classList.add('wrong-answer')
            //@ts-expect-error
            answerContainer.onclick = null;
        }

        const userScorePercentage = (userScore / totalScore) * 100;
        const userScoreContainer = document.createElement('div');
        userScoreContainer.textContent = `Ihre Punktzahl beträgt ${userScore} von ${totalScore}. Es ist ${Math.round(userScorePercentage)}%`;
        userScoreContainer.id = 'user-score';
        userScoreContainer.onclick = () => {
            resultsContainer.style.visibility = 'visible';
            resultsContainer.scrollIntoView({behavior: 'smooth'});
        };

        const userResultsText = document.createElement('h2');
        userResultsText.textContent = `Sie haben ${userScore} von ${totalScore} Antworten richtig.`;
        userResultsText.id = 'user-results-text';
        resultsContainer.appendChild(userResultsText);

        const userResultsPercentage = document.createElement('h1');
        userResultsPercentage.textContent = `Sie haben ${Math.round(userScorePercentage)}% richtig geschafft.`;
        userResultsPercentage.id = 'user-results-percentage';
        resultsContainer.appendChild(userResultsPercentage);

        const emojiElement = document.createElement('h1');
        emojiElement.id = 'emoji';
        const filledBlocks = Math.round(userScorePercentage / 10);
        emojiElement.textContent = '🍎'.repeat(filledBlocks) + '⚪'.repeat(10 - filledBlocks);
        resultsContainer.appendChild(emojiElement);

        const closeResultContainerButton = document.createElement('button');
        closeResultContainerButton.textContent = 'Schau mir die richtigen und meine Antworten an!';
        closeResultContainerButton.id = 'close-result-container-button';
        closeResultContainerButton.onclick = () => {
            resultsContainer.style.visibility = 'collapse';
            questionsContainer.scrollIntoView({behavior: 'smooth'});
        };
        resultsContainer.appendChild(closeResultContainerButton);


        questionsContainer.appendChild(userScoreContainer);
        questionsContainer.removeChild(endQuizButton);
        resultsContainer.style.visibility = 'visible';
        resultsContainer.scrollIntoView({behavior: 'smooth'});
    };
    questionsContainer.appendChild(endQuizButton);
});
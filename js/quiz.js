// Función Question para representar cada pregunta.
function Question(text, options, correctOption) {
    this.text = text;
    this.options = options;
    this.correctOption = correctOption;
}

Question.prototype.isCorrect = function(answer) {
    return this.correctOption === answer;
};

// Función Quiz para manejar el juego.
function Quiz(questions) {
    this.questions = questions;
    this.score = 0;
    this.currentQuestionIndex = 0;
}

Quiz.prototype.getCurrentQuestion = function() {
    return this.questions[this.currentQuestionIndex];
};

Quiz.prototype.answerCurrentQuestion = function(answer) {
    if (this.getCurrentQuestion().isCorrect(answer)) {
        this.score++;
    }
    this.currentQuestionIndex++;
};

Quiz.prototype.hasEnded = function() {
    return this.currentQuestionIndex >= this.questions.length;
};

// Definir preguntas.
const questions = [
    new Question("¿Cuál no es un ingrediente de las migas?", ["Leche", "Pan", "Ajo", "Panceta adobada", "Pimientos"], 0),
    new Question("¿Cuál es el plato típico que se describe como \"preparación sencilla\"?", ["Cochinillo asado", "Migas", "Caldereta de Cordero", "Jamón ibérico", "Queso de la Serena"], 1),
    new Question("¿Cuál de los siguientes productos no es de origen animal?", ["Jamón Ibérico", "Queso de la Serena", "Vinos de la Ribera del Guadiana","Matanza","Gazpacho Extremeño"], 2),
    new Question("¿En qué consiste el proceso de la \"Matanza\"?", ["Elaboración de quesos", "Cosecha de uvas para vino", "Sacrificio tradicional del cerdo","Preparación de migas","Asado de cochinillo"], 2),
    new Question("¿Cuál es la denominación de origen del \"Queso de la Serena\"?", ["DOP", "IGP", "ETG","Marca de Calidad","No tiene denominación"], 0),
    new Question("¿Cuál es el ingrediente principal de las \"Migas\"?", ["Jamón", "Queso de la Serena", "Pan","Uvas","Carne de cordero"], 2),
    new Question("¿Cómo se cocina tradicionalmente el \"Cochinillo Asado\"?", ["En olla a presión", "Al vapor", "A la plancha","En horno de leña","Frito"], 3),
    new Question("¿Qué tipo de archivo multimedia se utiliza para mostrar la \"Preparación del Cochinillo Asado\"?", ["Imagen", "Audio", "Texto","Enlace web","Video"], 4),
    new Question("¿Cuál es el tema principal de la sección \"Términos Gastronómicos\"?", ["Recetas de cocina extremeña", "Ingredientes típicos de Extremadura", "Definiciones de términos culinarios extremeños","Origen de la gastronomía extremeña","Influencias en la cocina extremeña"], 2),
    new Question("¿Cuál es el autor de la página web?", ["Escuela de Ingeniería Informática", "Universidad de Oviedo", "Junta de Extremadura","Mario Pérez Fernández","Denominación de Origen Queso de la Serena"], 3)
];

const quiz = new Quiz(questions);

const quizContainer = document.querySelector('[data-quiz-container]');
const questionContainer = document.querySelector('[data-question-container]');
const submitBtn = document.querySelector('[data-submit-btn]');
const resultContainer = document.querySelector('[data-result]');

function showQuestion() {
    if (quiz.hasEnded()) {
        showResult();
    } else {
        const currentQuestion = quiz.getCurrentQuestion();
        questionContainer.innerHTML = `
            <div data-question-container>
                <div data-question>${currentQuestion.text}</div>
                <ul data-options>
                    ${currentQuestion.options.map((option, index) => `
                        <li>
                            <input type="radio" name="option" value="${index}" id="option${index}">
                            <label for="option${index}">${option}</label>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;
        submitBtn.removeAttribute('data-hidden');
    }
}

function showResult() {
    questionContainer.setAttribute('data-hidden', true);
    submitBtn.setAttribute('data-hidden', true);
    resultContainer.removeAttribute('data-hidden');
    resultContainer.innerHTML = `Tu puntuación es: ${quiz.score} / 10`;
}

submitBtn.addEventListener('click', () => {
    const selectedOption = document.querySelector('input[name="option"]:checked');
    if (selectedOption) {
        const answer = parseInt(selectedOption.value, 10);
        quiz.answerCurrentQuestion(answer);
        showQuestion();
    } else {
        alert('Por favor, selecciona una respuesta.');
    }
});

showQuestion();

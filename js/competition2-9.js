/* =========================================
   TUG & WAR — IX კლასი
   შეჯიბრი 2
========================================= */

if (!document.querySelector(".game")) {

    console.warn(
        "competition2-9.js ჩაიტვირთა არასწორ გვერდზე."
    );

} else {


    /* =========================================
       GAME SETTINGS
    ========================================= */

    const QUESTION_TIME = 15;

    const TOTAL_QUESTIONS = 6;


    /* =========================================
       GAME STATE
    ========================================= */

    let currentQuestion = null;

    let currentQuestionIndex = 0;

    let remainingQuestions = [];

    let scoreLeft = 0;

    let scoreRight = 0;

    let leftAnswered = false;

    let rightAnswered = false;

    let questionFinished = false;

    let timerInterval = null;

    let timeLeft = QUESTION_TIME;

    let repeatTimeout = null;

    let nextQuestionTimeout = null;


    /* =========================================
       ELEMENTS
    ========================================= */

    const questionText =
        document.getElementById(
            "question-text"
        );

    const questionNumber =
        document.getElementById(
            "question-number"
        );

    const timerElement =
        document.getElementById(
            "timer"
        );

    const answersLeft =
        document.getElementById(
            "answers-left"
        );

    const answersRight =
        document.getElementById(
            "answers-right"
        );

    const scoreLeftElement =
        document.getElementById(
            "score-left"
        );

    const scoreRightElement =
        document.getElementById(
            "score-right"
        );

    const statusLeft =
        document.getElementById(
            "status-left"
        );

    const statusRight =
        document.getElementById(
            "status-right"
        );

    const roundStatus =
        document.getElementById(
            "round-status"
        );

    const resultMessage =
        document.getElementById(
            "result-message"
        );

    const ropeMarker =
        document.getElementById(
            "rope-marker"
        );

    const fullscreenButton =
        document.getElementById(
            "fullscreen-btn"
        );

    const teamLeft =
        document.querySelector(
            ".team-left"
        );

    const teamRight =
        document.querySelector(
            ".team-right"
        );


    /* =========================================
       START GAME
    ========================================= */

    function startGame() {

        clearInterval(timerInterval);

        clearTimeout(repeatTimeout);

        clearTimeout(nextQuestionTimeout);


        scoreLeft = 0;

        scoreRight = 0;

        currentQuestionIndex = 0;

        currentQuestion = null;


        remainingQuestions =
            [...questions9_2];


        leftAnswered = false;

        rightAnswered = false;

        questionFinished = false;


        scoreLeftElement.textContent = "0";

        scoreRightElement.textContent = "0";


        teamLeft.classList.remove(
            "winner",
            "loser"
        );

        teamRight.classList.remove(
            "winner",
            "loser"
        );


        resultMessage.textContent =
            "უპასუხეთ კითხვას რაც შეიძლება სწრაფად";


        ropeMarker.style.transform =
            "translateX(-50%) translateY(-50%)";


        /*
           თუ თამაში თავიდან იწყება,
           ძველი დასასრულის ღილაკები წაიშალოს.
        */

        const oldEndButtons =
            document.querySelector(
                ".end-buttons"
            );

        if (oldEndButtons) {

            oldEndButtons.remove();
        }


        loadNextQuestion();
    }


    /* =========================================
       LOAD NEXT QUESTION
    ========================================= */

    function loadNextQuestion() {

        clearInterval(timerInterval);

        clearTimeout(repeatTimeout);

        clearTimeout(nextQuestionTimeout);


        questionFinished = false;

        leftAnswered = false;

        rightAnswered = false;


        statusLeft.textContent =
            "მზად ხართ?";

        statusRight.textContent =
            "მზად ხართ?";


        statusLeft.className =
            "answer-status";

        statusRight.className =
            "answer-status";


        roundStatus.textContent =
            "ორივე ჯგუფი მზად არის";


        /*
           6 განსხვავებული კითხვა
           სწორად უნდა დასრულდეს.
        */

        if (
            remainingQuestions.length === 0
        ) {

            finishGame();

            return;
        }


        /*
           შემთხვევითი კითხვა
        */

        const randomIndex =
            Math.floor(
                Math.random() *
                remainingQuestions.length
            );


        currentQuestion =
            remainingQuestions[randomIndex];


        /*
           ნომერი ითვლის მხოლოდ
           უნიკალურად მოგებულ კითხვებს.
        */

        currentQuestionIndex =
            TOTAL_QUESTIONS -
            remainingQuestions.length +
            1;


        questionNumber.textContent =
            currentQuestionIndex;


        displayQuestion();

        startTimer();
    }


    /* =========================================
       DISPLAY QUESTION
    ========================================= */

    function displayQuestion() {

        questionText.textContent =
            currentQuestion.question;


        answersLeft.innerHTML = "";

        answersRight.innerHTML = "";


        currentQuestion.answers.forEach(
            (answer, index) => {

                const leftButton =
                    createAnswerButton(
                        answer,
                        index,
                        "left"
                    );


                const rightButton =
                    createAnswerButton(
                        answer,
                        index,
                        "right"
                    );


                answersLeft.appendChild(
                    leftButton
                );


                answersRight.appendChild(
                    rightButton
                );

            }
        );
    }


    /* =========================================
       CREATE ANSWER BUTTON
    ========================================= */

    function createAnswerButton(
        answer,
        index,
        team
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "answer-btn";


        button.type =
            "button";


        button.textContent =
            answer;


        button.dataset.answer =
            index;


        button.addEventListener(
            "click",
            () => {

                handleAnswer(
                    team,
                    index,
                    button
                );

            }
        );


        return button;
    }


    /* =========================================
       HANDLE ANSWER
    ========================================= */

    function handleAnswer(
        team,
        selectedIndex,
        button
    ) {

        /*
           თუ კითხვა უკვე დასრულებულია,
           ახალი პასუხი აღარ მიიღება.
        */

        if (questionFinished) {

            return;
        }


        /*
           თუ გუნდმა უკვე უპასუხა,
           მეორედ პასუხი აღარ შეუძლია.
        */

        if (
            team === "left" &&
            leftAnswered
        ) {

            return;
        }


        if (
            team === "right" &&
            rightAnswered
        ) {

            return;
        }


        /*
           პასუხის დაფიქსირება
        */

        if (team === "left") {

            leftAnswered = true;


            disableTeamAnswers(
                answersLeft
            );


            statusLeft.textContent =
                "პასუხი დაფიქსირდა";


            statusLeft.classList.add(
                "answered"
            );

        } else {

            rightAnswered = true;


            disableTeamAnswers(
                answersRight
            );


            statusRight.textContent =
                "პასუხი დაფიქსირდა";


            statusRight.classList.add(
                "answered"
            );
        }


        /*
           პასუხის შემოწმება
        */

        const isCorrect =
            selectedIndex ===
            currentQuestion.correct;


        /*
           სწორი პასუხი
        */

        if (isCorrect) {

            button.classList.add(
                "correct"
            );


            handleCorrectAnswer(
                team
            );


            return;
        }


        /*
           არასწორი პასუხი
        */

        button.classList.add(
            "wrong"
        );


        if (team === "left") {

            statusLeft.textContent =
                "არასწორია — II ჯგუფს შეუძლია პასუხი";

        } else {

            statusRight.textContent =
                "არასწორია — I ჯგუფს შეუძლია პასუხი";
        }


        /*
           ორივე გუნდმა უპასუხა
           და ორივე შეცდა.
        */

        if (
            leftAnswered &&
            rightAnswered
        ) {

            roundStatus.textContent =
                "ორივე პასუხი არასწორია — კითხვა განმეორდება";


            repeatTimeout =
                setTimeout(
                    () => {

                        if (
                            !questionFinished
                        ) {

                            repeatCurrentQuestion();
                        }

                    },
                    1200
                );
        }
    }


    /* =========================================
       CORRECT ANSWER
    ========================================= */

    function handleCorrectAnswer(
        team
    ) {

        /*
           ამ მომენტიდან
           კითხვა დასრულებულია.
        */

        questionFinished = true;


        clearInterval(
            timerInterval
        );


        clearTimeout(
            repeatTimeout
        );


        if (team === "left") {

            scoreLeft++;


            scoreLeftElement.textContent =
                scoreLeft;


            statusLeft.textContent =
                "✓ სწორი პასუხი";


            statusLeft.classList.add(
                "correct-status"
            );


            statusRight.textContent =
                "კითხვა დასრულდა";


            roundStatus.textContent =
                "I ჯგუფმა მოასწრო!";


        } else {

            scoreRight++;


            scoreRightElement.textContent =
                scoreRight;


            statusRight.textContent =
                "✓ სწორი პასუხი";


            statusRight.classList.add(
                "correct-status"
            );


            statusLeft.textContent =
                "კითხვა დასრულდა";


            roundStatus.textContent =
                "II ჯგუფმა მოასწრო!";
        }


        /*
           თოკის გადაადგილება
        */

        updateRope();


        /*
           კითხვა ამოვიღოთ სიიდან.
           ამიტომ აღარ განმეორდება.
        */

        removeCurrentQuestion();


        /*
           შემდეგი კითხვა.
        */

        nextQuestionTimeout =
            setTimeout(
                () => {

                    loadNextQuestion();

                },
                1500
            );
    }


    /* =========================================
       REMOVE CURRENT QUESTION
    ========================================= */

    function removeCurrentQuestion() {

        const index =
            remainingQuestions.indexOf(
                currentQuestion
            );


        if (index !== -1) {

            remainingQuestions.splice(
                index,
                1
            );
        }
    }


    /* =========================================
       REPEAT CURRENT QUESTION
    ========================================= */

    function repeatCurrentQuestion() {

        clearInterval(
            timerInterval
        );


        clearTimeout(
            repeatTimeout
        );


        leftAnswered = false;

        rightAnswered = false;

        questionFinished = false;


        statusLeft.className =
            "answer-status";


        statusRight.className =
            "answer-status";


        statusLeft.textContent =
            "მეორე შანსი";


        statusRight.textContent =
            "მეორე შანსი";


        roundStatus.textContent =
            "იგივე კითხვა — კიდევ ერთი შანსი";


        displayQuestion();

        startTimer();
    }


    /* =========================================
       DISABLE TEAM ANSWERS
    ========================================= */

    function disableTeamAnswers(
        container
    ) {

        const buttons =
            container.querySelectorAll(
                ".answer-btn"
            );


        buttons.forEach(
            (button) => {

                button.disabled = true;

            }
        );
    }


    /* =========================================
       TIMER
    ========================================= */

    function startTimer() {

        clearInterval(
            timerInterval
        );


        timeLeft =
            QUESTION_TIME;


        timerElement.textContent =
            timeLeft;


        timerElement.classList.remove(
            "danger"
        );


        timerInterval =
            setInterval(
                () => {

                    timeLeft--;


                    timerElement.textContent =
                        timeLeft;


                    if (
                        timeLeft <= 5
                    ) {

                        timerElement.classList.add(
                            "danger"
                        );
                    }


                    if (
                        timeLeft <= 0
                    ) {

                        clearInterval(
                            timerInterval
                        );


                        handleTimeOut();
                    }

                },
                1000
            );
    }


    /* =========================================
       TIME OUT
    ========================================= */

    function handleTimeOut() {

        if (
            questionFinished
        ) {

            return;
        }


        /*
           კითხვა არ ითვლება მოგებულად.
           ამიტომ დარჩება remainingQuestions-ში.
        */

        questionFinished = true;


        roundStatus.textContent =
            "დრო ამოიწურა";


        statusLeft.textContent =
            "დრო ამოიწურა";


        statusRight.textContent =
            "დრო ამოიწურა";


        repeatTimeout =
            setTimeout(
                () => {

                    repeatCurrentQuestion();

                },
                1200
            );
    }


    /* =========================================
       ROPE
    ========================================= */

    function updateRope() {

        /*
           II ჯგუფის უპირატესობა
           დადებითი მნიშვნელობაა.

           I ჯგუფის უპირატესობა
           უარყოფითი მნიშვნელობაა.
        */

        const difference =
            scoreRight -
            scoreLeft;


        /*
           თითო სწორი პასუხი
           თოკს 40px-ით წევს.
        */

        const position =
            difference * 40;


        ropeMarker.style.transform =
            `translateX(${position}px) translateY(-50%)`;
    }


    /* =========================================
       FINISH GAME
    ========================================= */

    function finishGame() {

        clearInterval(
            timerInterval
        );


        clearTimeout(
            repeatTimeout
        );


        clearTimeout(
            nextQuestionTimeout
        );


        questionFinished = true;


        answersLeft.innerHTML = "";

        answersRight.innerHTML = "";


        questionText.textContent =
            "შეჯიბრი დასრულდა";


        timerElement.textContent =
            "—";


        timerElement.classList.remove(
            "danger"
        );


        roundStatus.textContent =
            "საბოლოო შედეგი";


        if (
            scoreLeft >
            scoreRight
        ) {

            showWinner(
                "left"
            );


        } else if (
            scoreRight >
            scoreLeft
        ) {

            showWinner(
                "right"
            );


        } else {

            showDraw();
        }
    }


    /* =========================================
       WINNER
    ========================================= */

    function showWinner(
        team
    ) {

        if (
            team === "left"
        ) {

            teamLeft.classList.add(
                "winner"
            );


            teamRight.classList.add(
                "loser"
            );


            resultMessage.textContent =
                `🏆 I ჯგუფი იმარჯვებს! ${scoreLeft} : ${scoreRight}`;


        } else {

            teamRight.classList.add(
                "winner"
            );


            teamLeft.classList.add(
                "loser"
            );


            resultMessage.textContent =
                `🏆 II ჯგუფი იმარჯვებს! ${scoreRight} : ${scoreLeft}`;
        }


        showEndButtons();
    }


    /* =========================================
       DRAW
    ========================================= */

    function showDraw() {

        teamLeft.classList.add(
            "winner"
        );


        teamRight.classList.add(
            "winner"
        );


        resultMessage.textContent =
            `⚡ ფრე! ${scoreLeft} : ${scoreRight}`;


        showEndButtons();
    }


    /* =========================================
       END BUTTONS
    ========================================= */

    function showEndButtons() {

        const existing =
            document.querySelector(
                ".end-buttons"
            );


        if (existing) {

            return;
        }


        const container =
            document.createElement(
                "div"
            );


        container.className =
            "end-buttons";


        /*
           IX კლასში დაბრუნება
        */

        const backButton =
            document.createElement(
                "button"
            );


        backButton.className =
            "end-btn back-btn";


        backButton.type =
            "button";


        backButton.textContent =
            "← IX კლასი";


        backButton.addEventListener(
            "click",
            () => {

                window.location.href =
                    "grade9.html";

            }
        );


        /*
           თავიდან დაწყება
        */

        const restartButton =
            document.createElement(
                "button"
            );


        restartButton.className =
            "end-btn restart-btn";


        restartButton.type =
            "button";


        restartButton.textContent =
            "↻ განმეორება";


        restartButton.addEventListener(
            "click",
            () => {

                container.remove();

                startGame();

            }
        );


        container.appendChild(
            backButton
        );


        container.appendChild(
            restartButton
        );


        document
            .querySelector(".game")
            .appendChild(
                container
            );
    }


    /* =========================================
       FULLSCREEN
    ========================================= */

    fullscreenButton.addEventListener(
        "click",
        async () => {

            const gameElement =
                document.querySelector(
                    ".game"
                );


            try {

                if (
                    !document.fullscreenElement
                ) {

                    await gameElement.requestFullscreen();


                    fullscreenButton.textContent =
                        "⛶ სრულ ეკრანზე გასვლა";


                } else {

                    await document.exitFullscreen();


                    fullscreenButton.textContent =
                        "⛶ სრულ ეკრანზე";
                }

            } catch (error) {

                console.warn(
                    "Fullscreen ვერ ჩაირთო:",
                    error
                );
            }
        }
    );


    /* =========================================
       FULLSCREEN STATE CHANGE
    ========================================= */

    document.addEventListener(
        "fullscreenchange",
        () => {

            if (
                document.fullscreenElement
            ) {

                fullscreenButton.textContent =
                    "⛶ სრულ ეკრანზე გასვლა";

            } else {

                fullscreenButton.textContent =
                    "⛶ სრულ ეკრანზე";
            }
        }
    );


    /* =========================================
       START
    ========================================= */

    startGame();

}
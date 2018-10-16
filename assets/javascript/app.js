let gameQuestions = {
    listOfQuestions: {},
    currentIndex: 0,
    totalQuestions: 10,

    generateQuestions: function(gameCategory) {
        // Found a terrific API for generating trivia questions
        let endPointforTriviaAPI = 'https://opentdb.com/api.php?amount=' + gameQuestions.totalQuestions + '&category=' + gameCategory + '&difficulty=easy&type=multiple';

        $.ajax({
            url: endPointforTriviaAPI,
            type: 'post',
            beforeSend: function(){
                gamePlay.showGameLoadingScreen();
            },
            success: function(response){
                let responseQuestions = response.results;
                gameQuestions.listOfQuestions = responseQuestions;

                gamePlay.showGameQuestionScreen();
            }
        });
    },

    returnQuestion: function() {
        let gameIndex = gameQuestions.currentIndex;
        let triviaQuestion = gameQuestions.listOfQuestions[gameIndex].question;

        return triviaQuestion;
    },

    returnOptions: function() {
        let gameOptions = [];
        let gameIndex = gameQuestions.currentIndex;
        gameOptions = gameQuestions.listOfQuestions[gameIndex].incorrect_answers;
        gameOptions.push(gameQuestions.listOfQuestions[gameIndex].correct_answer);

        return gameOptions;
    },

    returnAnswer: function() {
        let gameIndex = gameQuestions.currentIndex;
        let gameAnswer = gameQuestions.listOfQuestions[gameIndex].correct_answer;

        return gameAnswer;
    },

    iterateQuestionIndex: function() {
        gameQuestions.currentIndex++;
    }
}

let gamePlay = {
    overallWinTotal: 0,
    overallLossTotal: 0,
    categoryIcon: "",
    roundTimer: "",
    intervalTimer: "",
    overallTime: 10000,
    overallTimeLeft: 0,

    startGame: function(gameCategoryString) {
        let gameCategoryID = 0;

        switch(gameCategoryString) {
            case 'icon-film':
                gameCategoryID = 11;
                gamePlay.categoryIcon = "fa-film";
                break;
            case 'icon-music':
                gameCategoryID = 12;
                gamePlay.categoryIcon = "fa-music";
                break;          
            case 'icon-games':
                gameCategoryID = 15;
                gamePlay.categoryIcon = "fa-gamepad";
                break;
            case 'icon-geo':
                gameCategoryID = 22;
                gamePlay.categoryIcon = "fa-map-signs";
                break;
            default:
                gameCategoryID = 9;
        }

        gameQuestions.generateQuestions(gameCategoryID);
    },

    showGameLoadingScreen: function() {
        $('.screen-category').hide();
        $('.screen-loading').show();
    },

    showGameQuestionScreen: function() {
        if (gameQuestions.currentIndex < gameQuestions.totalQuestions) {
            gamePlay.overallTimeLeft = gamePlay.overallTime;
            let gameChoicesElement = $(".game-choices");
            $('.game-bar-status').css('width', '100%');
            $('.game-seconds').text('10');
            gameChoicesElement.empty();

            $('.game-question').html('<i class="fa ' + gamePlay.categoryIcon + '" id="Geography" aria-hidden="true"></i> ' + gameQuestions.returnQuestion());

            for (i in gameQuestions.returnOptions()) {
                let inputFieldElement = $('<input type="radio" id="game-' + i + '" name="g-group">');
                let labelFieldElement = $('<label class="button selected-answer" for="game-' + i + '" value="' + stringReplaceSpecialCharacters(gameQuestions.returnOptions()[i]) + '">' + gameQuestions.returnOptions()[i] + '</label>');  
                
                gameChoicesElement.append(inputFieldElement);
                gameChoicesElement.append(labelFieldElement);
            }

            $('.screen-round-over').hide();
            $('.screen-loading').hide();
            $('.screen-game').show();

            gamePlay.roundTimer = setTimeout(function() { gamePlay.showRoundOverScreen('timeup'); }, gamePlay.overallTime);
            gamePlay.intervalTimer = setInterval(() => gamePlay.incrementTimerBar(), 1000);
            $('.game-bar-status').css('width', '0%');

            $('.selected-answer').click(function() {
                clearTimeout(gamePlay.roundTimer);
                clearTimeout(gamePlay.intervalTimer);
                let playerAnswer = $(this).attr("value");
                roundResult = gamePlay.checkSelection(playerAnswer);

                gamePlay.showRoundOverScreen(roundResult);
            });
        } else {
            gamePlay.showGameOverScreen();
        }
    },

    incrementTimerBar: function() {
        const incrementalTime = 1000;
        let incrementalTimeNumber = 10;
        gamePlay.overallTimeLeft = gamePlay.overallTimeLeft - incrementalTime;
        incrementalTimeNumber = gamePlay.overallTimeLeft / 1000;
        $('.game-seconds').text(incrementalTimeNumber);
    },

    showRoundOverScreen: function(result) {
        clearTimeout(gamePlay.intervalTimer);

        if(result === 'winner') {
            $('.round-over').html('<div class="cell-center"><img src="assets/images/winner-logo.png" width="400" /></div>')
            gamePlay.overallWinTotal++;
        } else if (result === 'loser') {
            $('.round-over').html('<div class="cell-center"><img src="assets/images/failed-logo.png" width="400" /><div><div class="cell-center"><h3>Correct Answer: ' + gameQuestions.returnAnswer() + '</h3></div>')
            gamePlay.overallLossTotal++;
        } else if (result === 'timeup') {
            $('.round-over').html('<div class="cell-center"><img src="assets/images/time-logo.png" width="400" /></div><div><h3 class="cell-center">Correct Answer: ' + gameQuestions.returnAnswer() + '</h3></div>')
            gamePlay.overallLossTotal++;
        } else {
            console.log('How did you get here?');
        }

        $('.screen-game').hide();
        $('.screen-round-over').show();

        setTimeout(function() { gamePlay.showGameQuestionScreen(); }, 3000);
        gameQuestions.iterateQuestionIndex();
    },

    showGameOverScreen: function() {
        $('.round-wins').text('Wins: ' + gamePlay.overallWinTotal);
        $('.round-losses').text('Losses: ' + gamePlay.overallLossTotal);

        $('.screen-round-over').hide();
        $('.screen-loading').hide();
        $('.screen-game-over').show();

        $('.restart-game').click(function() {
            console.log('restart');
            location.reload();
        });
    },

    checkSelection: function(answer) {
        let checkResult = ""

        if (answer === stringReplaceSpecialCharacters(gameQuestions.returnAnswer())) {
            checkResult = 'winner';
        } else {
            checkResult = 'loser';
        }

        return checkResult;
    }
}

// Loads when the document started
$( document ).ready(function() {
    $(document).foundation();

    $('.icons').click(function() {
        let gameCategoryString = $(this).attr("id");
        gamePlay.startGame(gameCategoryString);
    });    
});

// Special characters suck - quick function to strip those and only used for the comparison
function stringReplaceSpecialCharacters(stringInput) {
    stringInput = stringInput.replace(/[^a-zA-Z0-9]/g,'_');

    return stringInput;
}
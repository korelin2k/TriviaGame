// Question object
// All questions from the game are pulled here, along with the associated methods
let gameQuestions = {
    listOfQuestions: {},
    currentIndex: 0,
    totalQuestions: 10,

    // Calls the API and generates the appropriate questions based on the category selected
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

    // Returns the current question
    returnQuestion: function() {
        let gameIndex = gameQuestions.currentIndex;
        let triviaQuestion = gameQuestions.listOfQuestions[gameIndex].question;

        return triviaQuestion;
    },

    // Returns the available options for the current question
    returnOptions: function() {
        let gameOptions = [];
        let gameIndex = gameQuestions.currentIndex;
        gameOptions = gameQuestions.listOfQuestions[gameIndex].incorrect_answers;
        gameOptions.push(gameQuestions.listOfQuestions[gameIndex].correct_answer);

        return gameOptions;
    },

    // Returns the current answer
    returnAnswer: function() {
        let gameIndex = gameQuestions.currentIndex;
        let gameAnswer = gameQuestions.listOfQuestions[gameIndex].correct_answer;

        return gameAnswer;
    },

    // Iterate over the list of questions
    iterateQuestionIndex: function() {
        gameQuestions.currentIndex++;
    }
}

// Gameplay object
// Used for all aspects of the game, and is heavily integrated in calling the question object above
let gamePlay = {
    overallWinTotal: 0,
    overallLossTotal: 0,
    categoryIcon: "",
    roundTimer: "",
    intervalTimer: "",
    overallTime: 10000,
    overallTimeLeft: 0,

    // Initiates the game by finding out the category selected and calling the generateQuestions API
    startGame: function(gameCategoryString) {
        let gameCategoryID = 0;

        // Iterate over the categories and set the appropriate parameters.
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

        // Call the generateQuestions function, which calls the API
        gameQuestions.generateQuestions(gameCategoryID);
    },

    // Shows the game loading screen
    showGameLoadingScreen: function() {
        $('.screen-category').hide();
        $('.screen-loading').show();
    },

    // Shows the game question screen (primary screen)
    showGameQuestionScreen: function() {
        if (gameQuestions.currentIndex < gameQuestions.totalQuestions) {

            // Set & Reset data
            gamePlay.overallTimeLeft = gamePlay.overallTime;
            let gameChoicesElement = $(".game-choices");
            $('.game-bar-status').css('width', '100%');
            $('.game-seconds').text('10');

            // Empty out what was set before
            gameChoicesElement.empty();

            // Set the "icon"
            $('.game-question').html('<i class="fa ' + gamePlay.categoryIcon + '" id="Geography" aria-hidden="true"></i> ' + gameQuestions.returnQuestion());

            // Define the questions and append them to the selection
            for (i in gameQuestions.returnOptions()) {
                let inputFieldElement = $('<input type="radio" id="game-' + i + '" name="g-group">');
                let labelFieldElement = $('<label class="button selected-answer" for="game-' + i + '" value="' + stringReplaceSpecialCharacters(gameQuestions.returnOptions()[i]) + '">' + gameQuestions.returnOptions()[i] + '</label>');  
                
                gameChoicesElement.append(inputFieldElement);
                gameChoicesElement.append(labelFieldElement);
            }

            // Hide the previous screens and show the game screen
            $('.screen-round-over').hide();
            $('.screen-loading').hide();
            $('.screen-game').show();

            // Define and set timers
            gamePlay.roundTimer = setTimeout(function() { gamePlay.showRoundOverScreen('timeup'); }, gamePlay.overallTime);
            gamePlay.intervalTimer = setInterval(() => gamePlay.incrementTimerBar(), 1000);

            // Slow crawl down to 0 with the transition parameter in the CSS (simple!)
            $('.game-bar-status').css('width', '0%');

            // Once the answer is selected, get the value and then send it over to the compare function
            $('.selected-answer').click(function() {
                clearTimeout(gamePlay.roundTimer);
                clearTimeout(gamePlay.intervalTimer);
                let playerAnswer = $(this).attr("value");
                roundResult = gamePlay.checkSelection(playerAnswer);

                // Show round over screen
                gamePlay.showRoundOverScreen(roundResult);
            });
        } else {

            // All questions used, show game over screen
            gamePlay.showGameOverScreen();
        }
    },

    // Increment the timer on the bar
    incrementTimerBar: function() {
        const incrementalTime = 1000;
        let incrementalTimeNumber = 10;
        gamePlay.overallTimeLeft = gamePlay.overallTimeLeft - incrementalTime;
        incrementalTimeNumber = gamePlay.overallTimeLeft / 1000;
        $('.game-seconds').text(incrementalTimeNumber);
    },

    // Show the round over screen based on the type of result
    showRoundOverScreen: function(result) {
        clearTimeout(gamePlay.intervalTimer);

        // Set the proper screen based off the result passed in
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

        // Show the round over screen
        $('.screen-game').hide();
        $('.screen-round-over').show();

        // Timeout is used for how long do you wait before you jump to the next question
        setTimeout(function() { gamePlay.showGameQuestionScreen(); }, 3000);

        // Add 1 to the current index of the question
        gameQuestions.iterateQuestionIndex();
    },

    // Show the game over screen with the associated data
    showGameOverScreen: function() {
        $('.round-wins').text('Wins: ' + gamePlay.overallWinTotal);
        $('.round-losses').text('Losses: ' + gamePlay.overallLossTotal);

        $('.screen-round-over').hide();
        $('.screen-loading').hide();
        $('.screen-game-over').show();

        $('.restart-game').click(function() {
            gamePlay.restartGame();
        });
    },

    // Couldn't use the reload function (boo), so had to reset all the values and then start back on the screen category
    // Actually much easier than expected
    restartGame: function() {
        gameQuestions.listOfQuestions = {};
        gameQuestions.currentIndex = 0;
        gamePlay.overallLossTotal = 0;
        gamePlay.overallWinTotal = 0;

        $('.screen-game-over').hide();
        $('.screen-category').show();
    },

    // Check the answer to see if it matches. Some of these answers had special characters in them, so created a quick
    // replace function to replace those then it can be compared safely.
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
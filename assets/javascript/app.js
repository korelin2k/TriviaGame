var gameQuestions = {
    listOfQuestions: {},
    currentIndex: 0,

    generateQuestions: function(gameCategory) {
        // Found a terrific API for generating trivia questions
        let endPointforTriviaAPI = 'https://opentdb.com/api.php?amount=10&category=' + gameCategory + '&difficulty=easy&type=multiple';

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
            },
            complete:function(data){
                // game.generateBoard();
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

var gamePlay = {
    overallWinTotal: 0,
    overallLossTotal: 0,
    categoryIcon: "",

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

    endGame: function() {

    },

    showGameLoadingScreen: function() {
        $('.screen-category').hide();
        $('.screen-loading').show();
    },

    showGameQuestionScreen: function() {
        let gameChoicesElement = $(".game-choices");

        $('.game-question').html(gameQuestions.returnQuestion());

        for (i in gameQuestions.returnOptions()) {
            console.log(i);
            console.log(gameQuestions.returnOptions()[i]);
            let inputFieldElement = $('<input type="radio" id="game-' + i + '" name="g-group">');
            let labelFieldElement = $('<label class="button" for="game-' + i + '">' + gameQuestions.returnOptions()[i] + '</label>');  
            
            gameChoicesElement.append(inputFieldElement);
            gameChoicesElement.append(labelFieldElement);
        }

        $('.screen-loading').hide();
        $('.screen-game').show();
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
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
                $("#loader").show();
            },
            success: function(response){
                let responseQuestions = response.results;
                gameQuestions.listOfQuestions = responseQuestions;
            },
            complete:function(data){
                // game.generateBoard();
                $("#show-game").show();
                console.log(gameQuestions.returnQuestion());
                console.log(gameQuestions.returnOptions());
                console.log(gameQuestions.returnAnswer());
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
    }


}

var gamePlay = {
    overallWinTotal: 0,
    overallLossTotal: 0,

    showGameCategoryScreen: function() {
        gameQuestions.generateQuestions('11');
    },

    showGameLoadingScreen: function() {

    },

    showGameQuestionScreen: function() {

    }
}

// Loads when the document started
$( document ).ready(function() {
    gamePlay.showGameCategoryScreen();

    $(document).foundation();
});
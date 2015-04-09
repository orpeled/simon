'use strict';

/**
 * @ngdoc function
 * @name simonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the simonApp,
 * Using wiki info.
 */


angular.module('simonApp')
  .controller('MainCtrl', function ($timeout, ngAudio, $scope) {
    
    var MAX_ARRAY_SIZE = 5;
    var currentMoveIndex = 0;
    var maximumStepsAchievedIndex = 0;
    var speedOfTimeOut = 50;
    var expectedComputerMovesStack = [];
    
    // Generate random array with values 0-3
    function returnRandomizedArray() {
            
        var arrayToRandomize = [];
        
        for (var i=0; i < MAX_ARRAY_SIZE; i++) {
            arrayToRandomize.push(Math.floor((Math.random() * 4) + 0)); 
        }
        return arrayToRandomize;
    }
    
    // Play next computer pattern
    function computerStepsPlayed(){
            
        // The user finished this challange
        maximumStepsAchievedIndex++;
        currentMoveIndex = 0;
        
        var i = 0;
        (function playStepsPlusOne() {
            setTimeout(function() {
                $scope.simulateClickEvent(expectedComputerMovesStack[i]);
                i++;
                if (i < maximumStepsAchievedIndex) {
                    playStepsPlusOne();
                }
            }, speedOfTimeOut + 500);
        })();
    }
    
    // Resetting the game using start button
    $scope.clickReset = function () {
        
        // Removing animation
        angular.element('.btn-game').removeClass('hinge');
        angular.element('.win').removeClass('fadeInUpBig show');
        
        // Getting a new randomized array
        expectedComputerMovesStack = returnRandomizedArray();
        currentMoveIndex = 0;
        maximumStepsAchievedIndex = 0;
        
        // Play first pattern
        computerStepsPlayed();
    };
    
    // If a user clicked color, omit sound, match, and push to queue
    $scope.clickColor = function (button) {
        
        var buttonColorValue = button.target.attributes.data.value;
        // If the user got this one right, continue
        if (expectedComputerMovesStack[currentMoveIndex].toString() === buttonColorValue) {
            currentMoveIndex++;
            
            // Check if user finished the game
            if (currentMoveIndex === MAX_ARRAY_SIZE) {
                //User Won
                angular.element('.win').addClass('fadeInUpBig show');
                return;
            }
            // Check if user finished this challange
            if (currentMoveIndex === maximumStepsAchievedIndex) {
                computerStepsPlayed();
            }
        } else {
            // User failed
            angular.element('.btn-game').addClass('hinge');
        }   
    };
    
    // Function to simulate clicking to indicate player what to do
    $scope.simulateClickEvent = function (id) {
        $timeout(function() {

            // Play as if clicked
            $scope.audio = ngAudio.load('sounds/' + (id + 1) + '.mp3');
            $scope.audio.play();        

            // Click animation
            var btnAnimationName = 'bounce';
            var btnAnimationEndedEvents = 
                'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            
            // Adding animation and removing it once finished
            angular.element('#' + id).addClass(btnAnimationName)
                .one(btnAnimationEndedEvents, function () {
                angular.element('#' + id).removeClass(btnAnimationName);                                      
            });
        }, 2000);
    };
    });
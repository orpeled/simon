'use strict';

/**
 * @ngdoc function
 * @name simonApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the simonApp,
 * Taking wikipedia info.
 */


angular.module('simonApp')
  .controller('MainCtrl', function ($animate, $q, $timeout, ngAudio, $scope) {
    var MAX_ARRAY_SIZE = 2;
    var currentMoveIndex = 0;
    var maximumStepsAchievedIndex = 1;
    $scope.expectedComputerMovesStack = [];
    var speedOfTimeOut = 50;
    
    
    // Generate random array with values 0-3
    function returnRandomizedArray() {
        var arrayToRandomize = [];
        for (var i=0; i < MAX_ARRAY_SIZE; i++) {
            arrayToRandomize.push(Math.floor((Math.random() * 4) + 0)); 
        }
        return arrayToRandomize;
    
    }
    
    
    function computerStepsPlayed(){
            // The user finished this challange.
            maximumStepsAchievedIndex++;
            currentMoveIndex = 0;
            var i = 0;
        (function play() {
            setTimeout(function() {
                console.log($scope.expectedComputerMovesStack[i]);
                $scope.simulateClickEvent($scope.expectedComputerMovesStack[i]);
                i++;
                if (i < maximumStepsAchievedIndex) {
                    play();
                }
            }, speedOfTimeOut + 500);
        })();
    }
    
    // Reset the game
    $scope.clickReset = function () {
        // Removing animation.
        angular.element('.btn-game').removeClass('hinge');
        angular.element('.win').removeClass('animated fadeInUpBig show');
        $scope.expectedComputerMovesStack = returnRandomizedArray();
        currentMoveIndex = 0;
        maximumStepsAchievedIndex = 0;
        computerStepsPlayed();
        
    };
    
    // If a user clicked color, omit sound, match, and push to queue.
    $scope.clickColor = function (button) {
        // If the user got this one right, continue.
            if ($scope.expectedComputerMovesStack[currentMoveIndex].toString() === button.target.attributes.data.value) {
                console.log('User succeeded this step. Clicked on ' + button.target.attributes.data.value);
                currentMoveIndex++;
            
                // Check if user finished the game.
                if (maximumStepsAchievedIndex === MAX_ARRAY_SIZE) {
                    //User Won
                    console.log('User won!!');
                    angular.element('.win').addClass('animated fadeInUpBig show');
                    return;
                }
                // Check if user finished this challange.
                if (currentMoveIndex === maximumStepsAchievedIndex) {
                    computerStepsPlayed();
                }

            } else {
                console.log('User failed! Resetting.');
                angular.element('.btn-game').addClass('hinge');
                
            }   
    };
    
    // Function to simulate clicking to indicate player what to do.
    $scope.simulateClickEvent = function (id) {
        $timeout(function() {
            
            // Play as if clicked.
            $scope.audio = ngAudio.load('sounds/' + (id + 1) + '.mp3');
            $scope.audio.play();        
            
            // Adding click animation and removing classes when done.
            var animationName = 'bounce';
            var animationEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
            angular.element('#' + id).addClass(animationName)
                .one(animationEvents, function () {
                angular.element('#' + id).removeClass(animationName);                                      
            });
            console.log('Simulated a clicked on ' + id);
        }, 2000);
        //angular.element('#' + id).removeClass('bounce');
    };
    
    });

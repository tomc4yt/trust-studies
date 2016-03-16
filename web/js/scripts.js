$(function(){
    $.ajax({
        'async': false,
        'global': false,
        type:'GET',
        dataType:'json',
        url:'board.json',
        success:function(data){
            map = data;
            loadBoard();
        }
    });
    $('.unanswered').click(function(){
        var category = $(this).parent().data('category');
        var question = $(this).data('question');
        var value = map[category].questions[question].value;
        var answers = $('#answers');
        var ct = countdown( "question-modal-countdown", 0, 60 );
        //var ct_value = $('#question-modal-countdown').val();
        //if (ct_value == 0)

        // Survey
        $('.modal-title').empty().text(map[category].name);
        $('#question').empty().text(map[category].questions[question].question);
        answers.empty();
        $.each(map[category].questions[question].answers, function(i, answer){
            answers.append(
                '<button class="btn btn-danger answer" ' +
                    'data-category="'+category+'"' +
                    'data-question="'+question+'"' +
                    'data-value="'+value+'"' +
                    'data-correct="'+answer.correct+'"' +
                    '>'+ answer.text+'</button><br><br>'
            )
        });
        $('#survey-modal').modal('show');


        // Question
        $('#question').empty().text(map[category].questions[question].question);
        answers.empty();
        $.each(map[category].questions[question].answers, function(i, answer){
            answers.append(
                '<button class="btn btn-danger answer" ' +
                    'data-category="'+category+'"' +
                    'data-question="'+question+'"' +
                    'data-value="'+value+'"' +
                    'data-correct="'+answer.correct+'"' +
                    '>'+ answer.text+'</button><br><br>'
            )
        });
        $('#question-modal').modal('show');    

        // $('#question-modal').on('hidden.bs.modal', function () {
        //     var confirmation = confirm('You will not be able to return to the question once exited! Do you still want to exit?');
            
        //     if (confirmation == true){
        //         $('#question-modal').modal('show');
        //         var tile= $('div[data-category="'+$(this).data('category')+'"]>[data-question="'+$(this).data('question')+'"]')[0];
        //         $(tile).empty().rgemoveClass('unanswered').unbind().css('cursor','not-allowed');
        //         $('#question-modal').modal('hide');
        //         updateScore();
        //     } else {
        //         $('#question-modal').modal('show');
        //     }
          
        // })




        console.log(category, question);
        console.log(map[category].questions[question]);
        handleAnswer();
    });




});
var score = 0;
var map;
function loadBoard(){
    var board = $('#main-board');
    var columns = map.length;
    var column_width = parseInt(12/columns);
    console.log(columns);
    $.each(map, function(i,category){
        //load category name
        var header_class = 'text-center col-xs-' + column_width;
        if (i === 0 && columns % 2 != 0){
            header_class += ' col-xs-offset-1';
        }
        $('.panel-heading').append(
            '<div class="'+header_class+'"><h4>'+category.name+'</h4></div>'
        );
        //add column
        var div_class = 'category col-xs-' + column_width;
        if (i === 0 && columns % 2 != 0){
            div_class += ' col-xs-offset-1';
        }
        board.append('<div class="'+div_class+'" id="cat-'+i+'" data-category="'+i+'"></div>');
        var column = $('#cat-'+i);
        $.each(category.questions, function(n,question){
            //add questions
            column.append('<div class="well question unanswered" data-question="'+n+'">'+question.value+'</div>')
        });
    });
    $('.panel-heading').append('<div class="clearfix"></div>')

}

function updateScore(){
    $('#score').empty().text(score);
}

function handleAnswer(){
    $('.answer').click(function(){
        var tile= $('div[data-category="'+$(this).data('category')+'"]>[data-question="'+$(this).data('question')+'"]')[0];
        $(tile).empty().removeClass('unanswered').unbind().css('cursor','not-allowed');
        if ($(this).data('correct')){
            score += parseInt($(this).data('value'));
        } else if ( score < parseInt($(this).data('value'))) {
            score = 0;
        } else {
            score -= parseInt($(this).data('value'));
        }
        $('#question-modal').modal('hide');
        updateScore();
    })
}

function countdown( elementName, minutes, seconds )
{
    var element, endTime, hours, mins, msLeft, time;

    function twoDigits( n )
    {
        return (n <= 9 ? "0" + n : n);
    }

    function updateTimer()
    {
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            var tile= $('div[data-category="'+$(this).data('category')+'"]>[data-question="'+$(this).data('question')+'"]')[0];
            $(tile).empty().removeClass('unanswered').unbind().css('cursor','not-allowed');
            if ($(this).data('correct')){
                score += parseInt($(this).data('value'));
            } else if ( score < parseInt($(this).data('value'))) {
                score = 0;
            } else {
                score -= parseInt($(this).data('value'));
            }
            $('#question-modal').modal('hide');
            updateScore();
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
    }

    element = document.getElementById( elementName );
    endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
    updateTimer();
}
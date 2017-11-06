var registerLabel = $("#register-label");
var lowerArrow = $("#lower-arrow");

var intro = $("#intro");

var searchBackground = $("#search-background");

var inputSchoolName = $("#input-school-name");
var searchSchoolButton = $("search-school-button");
var search = $(".fa-search");
var loaderWheel = $(".loader-wheel");

var resultContainer = $(".result-container");
var startButton = $(".start-button");

var main = $("#main");

var monthLabel = $('.month');
var dateDayLabel = $('.date-day');

var b1 = $('#b1 .meal-content');
var b2 = $('#b2 .meal-content');
var b3 = $('#b3 .meal-content');

var currentDate = new Date();
var month;
var date;
var day;
var days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

$(document).ready(function () {
    if (localStorage.getItem('main') === "true")
        main.css('display', 'inherit');

    /// Disable parsing
    //initialize main
    // month = (currentDate.getMonth() + 1).toString();
    // date = currentDate.getDate().toString();
    // day = days[currentDate.getDay()];

    // monthLabel.html(month);
    // dateDayLabel.html(date + ' ' + day);

    // currentDate.setDate(currentDate.getDate() - 1);
    // getMeal(currentDate, b1);
    // currentDate.setDate(currentDate.getDate());
    // getMeal(currentDate, b2);
    // currentDate.setDate(currentDate.getDate() + 1);
    // getMeal(currentDate, b3);

    registerLabel.hover(
        function () {
            $(lowerArrow).css('transform', 'translateY(30%)');
        },
        function () {
            $(lowerArrow).css('transform', 'translateY(0%)');
        }
    )

    lowerArrow.hover(
        function () {
            $(this).css('transform', 'translateY(30%)');
        }, function () {
            $(this).css('transform', 'translateY(0%)');
        }
    );

    registerLabel.click(function (e) {
        e.preventDefault();
        $('body').css('transform', 'translateY(-100vh)');
    });

    inputSchoolName.keyup(function (e) {
        if (e.keyCode == 13) {
            searchSchool();
        }
    });

    searchSchoolButton.click(function (e) {
        e.preventDefault();
        searchSchool();
    });

    resultContainer.on('click', 'input:radio', function (e) {
        // e.preventDefault();
        $('input:radio').each(function () {
            $(this).prop('checked', false);
        });

        $(e.target).prop('checked', true);
    });

    startButton.click(function (e) {
        e.preventDefault();
        $('body').css('transform', 'translateY(0)');
        main.css('display', 'inherit');

        localStorage.setItem('main', true);
        localStorage.setItem('code', $('.school-name').attr('id'));
    });

    var carousel = $('#carousel'),
        threshold = 150,
        slideWidth = 390,
        dragStart,
        dragEnd;

    $('#next').click(function () {
        currentDate.setDate(currentDate.getDate() - 1);
        getMeal(currentDate);
        shiftSlide(-1);
    });

    $('#prev').click(function () {
        currentDate.setDate(currentDate.getDate() + 1);
        shiftSlide(1);
    });

    carousel.on('mousedown', function () {
        if (carousel.hasClass('transition')) return;
        dragStart = event.pageX;
        $(this).on('mousemove', function () {
            dragEnd = event.pageX;
            $(this).css('transform', 'translateX(' + dragPos() + 'px)')
        })
        $(document).on('mouseup', function () {
            if (dragPos() > threshold) { return shiftSlide(1) }
            if (dragPos() < -threshold) { return shiftSlide(-1) }
            shiftSlide(0);
        })
    });

    function dragPos() {
        return dragEnd - dragStart;
    }

    function shiftSlide(direction) {
        if (carousel.hasClass('transition')) return;
        dragEnd = dragStart;
        $(document).off('mouseup')
        carousel.off('mousemove')
            .addClass('transition')
            .css('transform', 'translateX(' + (direction * slideWidth) + 'px)');
        setTimeout(function () {
            if (direction === 1) {
                $('.slide:first').before($('.slide:last'));
            } else if (direction === -1) {
                $('.slide:last').after($('.slide:first'));
            }
            carousel.removeClass('transition')
            carousel.css('transform', 'translateX(0px)');

            // currentDate.setDate(currentDate.getDate() + direction);
            // getMeal(currentDate);
        }, 700)
    }
});

function getMeal(day, target) {
    var requestUrl = "http://52.79.134.200:5959/meal/" + localStorage.getItem('code') + "?date=" + day.toISOString().slice(0, 10);
    console.log(requestUrl);
    $.ajax({
        url: requestUrl,
        beforeSend: function (xhrObj) {
            xhrObj.setRequestHeader("Content-Type", "application/json");
            xhrObj.setRequestHeader("Accept", "application/json");
        },
        contentType: "application/json;charset=utf-8",
        type: "GET",
    }).then(function (data, responseText, jqXHR) {
        var regExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi;
        if (jqXHR.status == 200) {
            target[0].innerText = data.breakfast.replace(regExp, '');
            target[1].innerText = data.lunch.replace(regExp, '');
            target[2].innerText = data.dinner.replace(regExp, '');
        }
    });
}

function searchSchool() {
    search.css('display', 'none');
    loaderWheel.css('display', 'inherit');

    $.ajax({
        url: "http://52.79.134.200:5959/school-search?key=" + inputSchoolName.val(),
        statusCode: {
            200: function (data) {
                resultContainer.empty();

                var count = '<p class="describe-school-count"><span class="school-count">' + data.length + '</span>개의 학교를 찾았습니다</p>'
                resultContainer.prepend(count);

                var container = '<div class="school-list">';
                data.forEach(function (element) {
                    var content = '<div class="school-item">'
                        + '<input class="check medium" type="radio">'
                        + '<div>'
                        + '<p class="school-name" id="' + element.code + '">' + element.name + '</p>'
                        + '<p class="region-name">' + element.region + '</p>'
                        + '</div>'
                        + '</div>';

                    container += content;
                    console.log(element);
                }, this);
                container += '</div>';

                resultContainer.append(container);
            },
            error: function () {
            }
        }
    });

    search.css('display', 'inherit');
    loaderWheel.css('display', 'none');
}

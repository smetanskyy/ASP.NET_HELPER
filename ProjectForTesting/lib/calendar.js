"use strict";

let LEFT_EDGE_DATE = 1920;
let RANGE_DATE = 100;
let SELECTED_DATE;
let LOADED_DATE;
let TAG_ID_SELECTED_DATE = null;
let IS_POSITION_ABSOLUTE = false;
let MARGIN_TOP = 0;
let IS_DISPLAY = false;

$(document).ready(function () {
    const transDateStr = $("#trans-data-to-front").attr("datetime");
    console.log("SERVER: " + transDateStr);
    SELECTED_DATE = new Date(transDateStr);
    LOADED_DATE = new Date(transDateStr);
    console.log("LOADED_DATE: " + SELECTED_DATE);
    updateCalendarUseDate(SELECTED_DATE.getFullYear(), SELECTED_DATE.getMonth(), SELECTED_DATE.getDate());

    if (TAG_ID_SELECTED_DATE !== null && TAG_ID_SELECTED_DATE !== '' && IS_DISPLAY === false) {
        $(TAG_ID_SELECTED_DATE).click(function () {
            //$("#calendar-box-id").toggle();
            toggleCalendarBox();
        });
    }

    if (IS_POSITION_ABSOLUTE === true) {
        $("#calendar-box-id").css("position", "absolute");
    }

    if (MARGIN_TOP > 0) {
        $("#calendar-box-id").css("margin-top", MARGIN_TOP);
    }

    if (IS_DISPLAY === true) {
        $("#calendar-box-id").show();
    }

});

$("#arrow-calendar-month-left").click(() => {
    let currentIndex = $(".month-calendar-item").index($(".month-calendar-item-active"));
    $(".month-calendar-item").removeClass("month-calendar-item-active");
    const monthsList = document.getElementsByClassName("month-calendar-item");
    let newindex = currentIndex === 0 ? monthsList.length - 1 : currentIndex - 1;
    if (currentIndex === 0) {
        let currentYear = $("#year-calendar-id").html();
        $("#year-calendar-id").html(+currentYear - 1);
    }
    monthsList.item(newindex).classList.add("month-calendar-item-active");
    $(".current-month-calendar").html(monthsList.item(newindex).innerHTML);
    $("#month-calendar-id").attr("data-month-order", monthsList.item(newindex).getAttribute("data-month-order"));
    updateCalendarUseNav();
});

$("#arrow-calendar-month-right").click(() => {
    let currentIndex = $(".month-calendar-item").index($(".month-calendar-item-active"));
    $(".month-calendar-item").removeClass("month-calendar-item-active");
    const monthsList = document.getElementsByClassName("month-calendar-item");
    let newindex = currentIndex === monthsList.length - 1 ? 0 : currentIndex + 1;
    if (currentIndex === monthsList.length - 1) {
        let currentYear = $("#year-calendar-id").html();
        $("#year-calendar-id").html(+currentYear + 1);
    }
    monthsList.item(newindex).classList.add("month-calendar-item-active");
    $(".current-month-calendar").html(monthsList.item(newindex).innerHTML);
    $("#month-calendar-id").attr("data-month-order", monthsList.item(newindex).getAttribute("data-month-order"));
    updateCalendarUseNav();
});

$(".month-calendar-item").click(function () {
    $(".month-calendar-select-wrap").hide();
    $(".month-calendar-item").removeClass("month-calendar-item-active");
    $(this).addClass("month-calendar-item-active");
    $("#month-calendar-id").html($(this).html());
    $("#month-calendar-id").attr("data-month-order", $(this).attr("data-month-order"));
    updateCalendarUseNav();
});

$("#month-calendar-id").click(() => {
    $(".month-calendar-select-wrap").slideToggle();
});

$("#arrow-calendar-year-left").click(() => {
    const currentYear = $("#year-calendar-id").html();
    if (isYearWithRange(currentYear) === false)
        return;
    let currentYearNum = +currentYear;
    updateYearSelect(--currentYearNum);
});

$("#arrow-calendar-year-right").click(() => {
    const currentYear = $("#year-calendar-id").html();
    if (isYearWithRange(currentYear) === false)
        return;
    let currentYearNum = +currentYear;
    updateYearSelect(++currentYearNum);
});

function updateYearSelect(year, updateCurrentYear = true) {
    if (updateCurrentYear === true) {
        $(".current-year-calendar").html(year);
        updateCalendarUseNav();
    }
    $(".year-calendar-center").removeClass("year-calendar-item-active");

    let yearDec = year - year % 10;

    $(".year-calendar-previous").html(`${yearDec - 10} - ${yearDec}`);
    $(".year-calendar-next").html(`${yearDec + 10} - ${yearDec + 20}`);

    const leftEdge = LEFT_EDGE_DATE - LEFT_EDGE_DATE % 10;
    if (yearDec <= leftEdge) {
        $(".year-calendar-previous").hide();
    } else {
        $(".year-calendar-previous").show();
    }

    const yearNow = new Date().getFullYear();
    const rightEdge = yearNow - yearNow % 10 + RANGE_DATE;

    if (yearDec + 10 >= rightEdge) {
        $(".year-calendar-next").hide();
    } else {
        $(".year-calendar-next").show();
    }

    const yearList = document.getElementsByClassName("year-calendar-center");
    for (let yearIndex = 0; yearIndex < 11; yearIndex++) {
        yearList[yearIndex].innerHTML = yearDec;
        if (yearDec == $(".current-year-calendar").html()) {
            yearList[yearIndex].classList.add("year-calendar-item-active");
        }
        yearDec++;
    }
}

function updateCalendarUseNav() {
    const currentMonth = $("#month-calendar-id").attr("data-month-order");
    const currentYear = $("#year-calendar-id").html();
    if (isYearMonthDay(currentYear, currentMonth, 1) === false) {
        return;
    }
    updateCalendarUseDate(+currentYear, +currentMonth, 1);
    $(".days-item-frame").removeClass("active-day-item");
    $(".days-items-line").removeClass("active-days-items-line");
}

function updateCalendarUseDate(year, month, day, changeTransDate = false) {
    if (changeTransDate === true) {
        SELECTED_DATE = new Date(year, month, day);
        $("#trans-data-to-front").attr("datetime", `${year}/${month + 1}/${day}`);
        const transDateString = $("#trans-data-to-front").attr("datetime");
        console.log(`DATE: ${transDateString}`);
        console.log(`SELECTED_DATE: ${SELECTED_DATE}`);
        $(TAG_ID_SELECTED_DATE).val(transDateString);
        if (IS_DISPLAY === false) {
            $("#calendar-box-id").hide();
        }
    }

    $(".days-items-line").removeClass("active-days-items-line");

    const dateStart = new Date(year, month, 1);
    const days = new Date(year, month + 1, 0).getDate();
    let positionInWeek = dateStart.getDay();

    const daysFrame = document.getElementsByClassName("days-item-frame");
    let dayCount = 1;
    for (let dayIndex = 0; dayIndex < daysFrame.length; dayIndex++) {
        daysFrame[dayIndex].classList.remove("days-item");
        daysFrame[dayIndex].classList.remove("active-day-item");
        daysFrame[dayIndex].classList.remove("days-item");
        daysFrame[dayIndex].textContent = "";

        if (dayIndex >= positionInWeek && dayIndex < days + positionInWeek) {
            daysFrame[dayIndex].classList.add("days-item");
            daysFrame[dayIndex].textContent = dayCount;

            if (dayCount === day) {
                daysFrame[dayIndex].classList.add("active-day-item");
                daysFrame[dayIndex].parentElement.classList.add("active-days-items-line");
            }

            dayCount++;
        }
    }
}

$(".days-item-frame").click(function () {
    if ($(this).hasClass("days-item") === false) {
        return;
    }
    const day = $(this).text();
    const month = $("#month-calendar-id").attr("data-month-order");
    const year = $("#year-calendar-id").html();
    if (isYearMonthDay(year, month, day) === false)
        return;
    updateCalendarUseDate(+year, +month, +day, true);
});

$(".year-calendar-previous").click(() => {
    const currentYear = document.getElementById("year-calendar-previous-id").innerHTML.split(' ').shift();
    if (isYearWithRange(currentYear) === false)
        return;
    updateYearSelect(+currentYear, false);
});

$(".year-calendar-next").click(() => {
    const currentYear = document.getElementById("year-calendar-next-id").innerHTML.split(' ').shift();
    if (isYearWithRange(currentYear) === false)
        return;
    updateYearSelect(+currentYear, false);
});

$(".year-calendar-center").click(function () {
    $(".year-calendar-select-wrap").hide();
    $(".year-calendar-center").removeClass("year-calendar-item-active");
    $(this).addClass("year-calendar-item-active");
    $("#year-calendar-id").html($(this).html());
    updateYearSelect(+$(this).html());
});

$("#year-calendar-id").click(() => {
    $(".year-calendar-select-wrap").slideToggle();
});

function isYearWithRange(year, start = LEFT_EDGE_DATE, range = RANGE_DATE) {
    const leftEdge = start - start % 10;
    if (jQuery.isNumeric(year) === false) {
        alert("Invalid year!");
        return false;
    }
    const yearNum = +year;
    if (yearNum < leftEdge) {
        alert(`Invalid year! Year less than ${leftEdge}`);
        return false;
    }

    const yearNow = new Date().getFullYear();
    const rightEdge = yearNow - yearNow % 10 + range;

    if (yearNum >= rightEdge) {
        alert(`Invalid year! Year more than ${rightEdge}`);
        return false;
    }
    return true;
}

function isYearMonthDay(year, month, day) {
    if (isYearWithRange(year) === false) {
        return false;
    }

    if (jQuery.isNumeric(month) === false) {
        alert("Invalid month!");
        return false;
    }
    if (jQuery.isNumeric(day) === false) {
        alert("Invalid day!");
        return false;
    }

    const monthNum = +month;
    if (monthNum < 0 || monthNum > 11) {
        alert("Invalid month!");
        return false;
    }

    const dayNum = +day;
    const yaerNum = +year;
    const daysInMonth = new Date(yaerNum, monthNum + 1, 0).getDate();

    if (dayNum < 1 || dayNum > daysInMonth) {
        alert("Invalid day!");
        return false;
    }
    return true;
}

$(document).mouseup(function (e) {
    const monthsWrap = $(".month-calendar-select-wrap");
    const yearsWrap = $(".year-calendar-select-wrap");

    const monthsSection = $(".month-calendar");
    const yearsSection = $(".year-calendar");

    const calendarBox = $("#calendar-box-id");
    const selectedTag = $(TAG_ID_SELECTED_DATE);

    if (!monthsSection.is(e.target) && monthsSection.has(e.target).length === 0) {
        monthsWrap.hide();
    }

    if (!yearsSection.is(e.target) && yearsSection.has(e.target).length === 0) {
        yearsWrap.hide();
    }

    if (!calendarBox.is(e.target) && calendarBox.has(e.target).length === 0 && IS_DISPLAY === false) {
        if (TAG_ID_SELECTED_DATE !== null && TAG_ID_SELECTED_DATE !== '') {
            if (!selectedTag.is(e.target) && selectedTag.has(e.target).length === 0) {
                hideCalendarBox();
            }
        } else {
            hideCalendarBox();
        }
    }
});

function hideCalendarBox() {
    const calendarBox = $("#calendar-box-id");
    calendarBox.css("opacity", 1).animate({ opacity: 0.25 }, 250, function () {
        //calendarBox.css("display", "none");
        calendarBox.hide();
    });
}

function showCalendarBox() {
    const calendarBox = $("#calendar-box-id");
    //calendarBox.css("display", "block");
    calendarBox.show();
    calendarBox.css("opacity", 0.25).animate({ opacity: 1 }, 250, function () {
    });
}

function toggleCalendarBox() {
    const calendarBox = $("#calendar-box-id");
    if (calendarBox.css("display") === "block") {
        hideCalendarBox();
    } else {
        showCalendarBox();
    }
}
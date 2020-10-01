document.addEventListener('DOMContentLoaded', function () {

    var calendars = bulmaCalendar.attach('[type="date"]');

    // Loop on each calendar initialized
    for (var i = 0; i < calendars.length; i++) {
        // Add listener to date:selected event
        calendars[i].on('select', date => {
            console.log(date);
        });
    }

    // To access to bulmaCalendar instance of an element
    var element = document.querySelector('#my-element');
    if (element) {
        // bulmaCalendar instance is available as element.bulmaCalendar
        element.bulmaCalendar.on('select', function (datepicker) {
            console.log(datepicker.data.value());
        });
    }

    var mouseX, mouseY, windowWidth, windowHeight;
    var popupLeft, popupTop;
    var popUpContainer = document.querySelector('.eventPop__container');
    var popUp = document.querySelector('.event__popup');
    var calendarEl = document.querySelector('#fullCalendar');
    popUpContainer.addEventListener('click', () => {
        popUpContainer.style.display = 'none';
    })
    calendarEl.onmouseover = (e) => {
        mouseX = e.pageX;
        mouseY = e.pageY;
        if (e.target.offsetLeft != undefined)
            mouseX = e.pageX - e.target.offsetLeft;
        if (e.target.offsetTop != undefined)
            mouseY = e.pageY - e.target.offsetTop;

        if (mouseX < 0)
            mouseX = 0;
        if (mouseY < 0)
            mouseY = 0;
        windowWidth = window.innerWidth + document.body.scrollLeft;
        windowHeight = window.innerHeight + document.body.scrollTop;
    }
    const showPopup = () => {
        // popUp.style.display = 'block';
        popUpContainer.style.display = 'block';
        var popupWidth = popUp.offsetWidth;
        var popupHeight = popUp.offsetHeight;

        if (mouseX + popupWidth > windowWidth)
            popupLeft = mouseX - popupWidth;
        else
            popupLeft = mouseX;

        if (mouseY + popupHeight > windowHeight)
            popupTop = mouseY - popupHeight;
        else
            popupTop = mouseY;

        if (popupLeft < document.body.scrollLeft) {
            popupLeft = document.body.scrollLeft;
        }

        if (popupTop < document.body.scrollTop) {
            popupTop = document.body.scrollTop;
        }

        if (popupLeft < 0 || popupLeft == undefined)
            popupLeft = 0;
        if (popupTop < 0 || popupTop == undefined)
            popupTop = 0;

        console.log('popupLeft,:', popupLeft);
        console.log('popupTop,:', popupTop);
        popUp.style.left = `${popupLeft}px`;
        popUp.style.top = `${popupTop}px`;

    }

    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        selectable: true,
        eventClick: function (info) {
            // console.log(info);
        },
        select: function select(info) {
            console.log(info.jsEvent);
            let currentEvent = {
                id: 'simpleEvent',
                title: '(title)',
                start: info.startStr,
                end: info.endStr,
            };
            calendar.addEvent(currentEvent);
            showPopup();
        },
        editable: true,
        events: [
            {
                title: 'All Day Event',
                start: '2020-09-01'
            },
            {
                title: 'Long Event',
                start: '2020-09-07',
                end: '2020-09-10'
            },
            {
                groupId: '999',
                title: 'Repeating Event',
                start: '2020-09-09T16:00:00'
            },
            {
                groupId: '999',
                title: 'Repeating Event',
                start: '2020-09-16T16:00:00'
            },
            {
                title: 'Conference',
                start: '2020-09-11',
                end: '2020-09-13'
            },
            {
                title: 'Meeting',
                start: '2020-09-12T10:30:00',
                end: '2020-09-12T12:30:00'
            },
            {
                title: 'Lunch',
                start: '2020-09-12T12:00:00'
            },
            {
                title: 'Meeting',
                start: '2020-09-12T14:30:00'
            },
            {
                title: 'Birthday Party',
                start: '2020-09-13T07:00:00'
            },
            {
                title: 'Click for Google',
                url: 'http://google.com/',
                start: '2020-09-28'
            }
        ]
    });
    calendar.render();


});





document.addEventListener('DOMContentLoaded', function () {

    let options = {
        type: 'date',
        dateFormat: 'YYYY/MM/DD',
        isRange: true,
        showFooter: false,
        weekStart: 1,
        startDate: '2019-05-13',
        endDate: '2019-05-26'
    };

    let inputDate= document.querySelector('#inputDateTimeEvent');
    var calendars=bulmaCalendar.attach(inputDate,options);
document.querySelectorAll('.datetimepicker-dummy-input')[1].value='2019-05-26';
document.querySelector('.datetimepicker-dummy-input.is-datetimepicker-range').value='2019-05-13';
    var mouseX, mouseY, windowWidth, windowHeight;
    var popupLeft, popupTop;
    var popUpContainer = document.querySelector('.eventPop__container');
    var popUp = document.querySelector('.event__popup');
    var calendarEl = document.querySelector('#fullCalendar');
    popUpContainer.addEventListener('click', (e) => {
        if(e.target===popUpContainer)
        popUpContainer.style.display = 'none';
        // console.log(e.target)
    })
    calendarEl.onmouseover = (e) => {
        mouseX = e.pageX;
        mouseY = e.pageY;
        if (e.target.offsetLeft !== undefined)
            mouseX = e.pageX - e.target.offsetLeft;
        if (e.target.offsetTop !== undefined)
            mouseY = e.pageY - e.target.offsetTop;

        if (mouseX < 0)
            mouseX = 0;
        if (mouseY < 0)
            mouseY = 0;
        windowWidth = window.innerWidth + document.body.scrollLeft;
        windowHeight = window.innerHeight + document.body.scrollTop;
    }
    const showPopup = (event) => {
        // popUp.style.display = 'block';
        // console.log()
        let eventStartTime=(new Date(event.start)).toTimeString().toString().split(' ',1) .toString();
        let eventEndTime=(new Date(event.end)).toTimeString().toString().split(' ',1) .toString();

        console.log(options)




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
            //start,end,startStr,endStr,allDay,jsEvent,view,resource
            // if()
            let currentEvent = {
                id: 'simpleEvent',
                title: '(title)',
                start: info.startStr,
                end: info.endStr,
            };


            // console.log()
            if(info.allDay){
            if(!(((new Date(info.endStr))-(new Date(info.startStr)))>86400000)){
                let dateNow =new Date(info.startStr);
                let endDate=new Date(info.startStr)
                dateNow.setHours(8);
                endDate.setHours(8);
                endDate.setMinutes(endDate.getMinutes() + 30)

                currentEvent.start=dateNow;
                // dateNow
                currentEvent.end=endDate;
            }
            }
            console.log(currentEvent);
            // console.log(info);

            // let currentEvent = {
            //     id: 'simpleEvent',
            //     title: '(title)',
            //     start: info.startStr,
            //     end: info.endStr,
            // };
            calendar.addEvent(currentEvent);
            showPopup(currentEvent);
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



    dragElement(popUp);

    function dragElement(elmnt) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        if (document.getElementById(elmnt.id + "header")) {

            /* if present, the header is where you move the DIV from:*/
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            /* otherwise, move the DIV from anywhere inside the DIV:*/
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            if(e.target.id==='dragger'){
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
            }
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement() {
            /* stop moving when mouse button is released:*/
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
});


const DEFAULT_EVENT_ID='EVENT_ID';
const Days =['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi']
const EVENTTYPE={  NOTREPEATED:'notRepeated', EVERYDAY:'everyDay', EVERYWEEK:'everyWeek', EVERYMONTH:'evryMonth', EVERYWEEKDAYS:'everyMtoF' };
const TYPES=[
    {  text:'Ne se répète pas',value:'notRepeated'},
    {  text:'tous les jours',value:'everyDay'},
    // {  text:'Chaque semaine le',value:'everyWeek'},
    // {  text:'Chaque mois le premier',value:'evryMonth'},
    // {  text:'Tous les jours de la semaine (du lundi au vendredi)',value:'everyMtoF'}
    ];
var mouseX, mouseY, windowWidth, windowHeight;
var popupLeft, popupTop,popUp,btnEventDelete,btnEventView,btnEventEdit,inputEventId;
var popUpContainer,btnCancelEvent,btnSubmitEvent,calendarEl;
var startHourLabel,endHourLabel,startMinLabel,endMinLabel
var contextMenu=document.querySelector('.event__contextMenu');
var contextMenuWrapper=document.querySelector('.contextMenu__wrapper');
const convertDateString=(date)=>{
    let startDateParts = date.split("/");
     return `${startDateParts[2]}-${startDateParts[1]}-${startDateParts[0]}`
}

inputEventId=document.querySelector('#inputEventId');
btnEventDelete=document.querySelector('#btnEventDelete');
btnEventEdit=document.querySelector('#btnEventEdit');
btnEventView=document.querySelector('#btnEventView');
popUpContainer = document.querySelector('.eventPop__container');
btnCancelEvent = document.querySelector('#cancelEvent');
btnSubmitEvent = document.querySelector('#submitEvent');
popUp = document.querySelector('.event__popup');
calendarEl = document.querySelector('#fullCalendar');
bulmaDateEnd = document.querySelector('.bulmaDateEnd');
bulmaDateEnd.style.display='none';
let inputDate= document.querySelector('#inputDateTimeEvent');
let inputDateEnd= document.querySelector('#inputDateTimeEndEvent');

let inputTime= document.querySelector('#inputTimeEvent');

let selectInputType= document.querySelector('#eventType');

let optionsDateInput = {
    type: 'date',
    dateFormat: 'DD/MM/YYYY',
    isRange: false,
    showFooter: false,
    weekStart: 1,
    showHeader:false,
    showButtons:false
};

let optionsTimeInput = {
    type:'time',
    isRange: true,
    start: this.defaultStart,
    end: this.defaultEnd,
    minuteSteps: 10,
    showFooter: false,
    displayMode: 'inline',
    labelFrom: 'From',
    labelTo: 'To'
};

const showMenuContext=show=>{contextMenuWrapper.style.display=show?'block':'none'}

btnEventDelete.addEventListener('click',()=>{
    let eventId =inputEventId.value;
    if(eventId){
        removeEvent(eventId);
    }
    showMenuContext(false);
})

btnEventEdit.addEventListener('click',(e)=>{
    let eventId =inputEventId.value;
    let event = calendar.getEventById(eventId)
    showPopup(event);
    removeEvent(eventId);
})
selectInputType.addEventListener('change',(e)=>{
    switch (e.target.value) {
        case EVENTTYPE.EVERYDAY:
            bulmaDateEnd.style.display='flex';
            break
        case EVENTTYPE.EVERYMONTH:
            bulmaDateEnd.style.display='flex';
            break
        case  EVENTTYPE.EVERYWEEK:
            bulmaDateEnd.style.display='flex';
            break
        case EVENTTYPE.EVERYWEEKDAYS:
            bulmaDateEnd.style.display='flex';
            break
        case EVENTTYPE.NOTREPEATED:
            bulmaDateEnd.style.display='none';
            break
        default:
            bulmaDateEnd.style.display='none';

    }
})
contextMenuWrapper.addEventListener('click',(e)=>{
    if(e.target===contextMenuWrapper)
        showMenuContext(false)
})
btnSubmitEvent.addEventListener('click',(e)=>{

    let event = {
        title:document.querySelector('#event__title').value,
        startDate: document.querySelector('.bulmaDate .datetimepicker-dummy-input').value,
        endDate:document.querySelector('.bulmaDateEnd .datetimepicker-dummy-input').value,
        type:selectInputType.value,
        startTime: `${startHourLabel.innerHTML}:${startMinLabel.innerHTML}`,
        endTime:`${endHourLabel.innerHTML}:${endMinLabel.innerHTML}`,
        zoomType:document.querySelector('#event__zoomType').value,
        file:document.querySelector('#event__file').value
    }
    if(validateEvent(event)){
        removeEvent(DEFAULT_EVENT_ID);
        console.log(event);
        AddEvent(event);
        hideModal(true);
    }



})
const setSelectTypeValues=(day)=>{
    selectInputType.innerHTML='';
    // ().innerText='test';
    TYPES.forEach(type=>{
        let option = document.createElement("OPTION");
        if(type.value===EVENTTYPE.EVERYWEEK || type.value===EVENTTYPE.EVERYMONTH)
            option.text=type.text +" " +day;
        else
            option.text=type.text;
        option.value=type.value;

        selectInputType.append(option);
    })



}
bulmaCalendar.attach(inputTime,optionsTimeInput);



bulmaCalendar.attach(inputDate,optionsDateInput);
bulmaCalendar.attach(inputDateEnd,optionsDateInput);



const initializeDateInput=(startDate,endDate)=>{

    if((new Date(startDate)) - (new Date(endDate))!==0){
        selectInputType.value=EVENTTYPE.EVERYDAY;
        bulmaDateEnd.style.display='flex';
    }
    if (inputDate) {
        inputDate.bulmaCalendar.startDate=startDate
    }
    if (inputDateEnd) {
        inputDateEnd.bulmaCalendar.startDate=endDate
    }

    document.querySelector('.bulmaDateEnd .datetimepicker-dummy-input').value=endDate;
    document.querySelector('.bulmaDate .datetimepicker-dummy-input').value=startDate;
}
const initializeTimeInput=(startTime,endTime)=>{



    if (inputTime) {
        let time =startTime.split(':');
        let date=new Date(inputTime.bulmaCalendar.startTime);

        date.setHours(time[0]);
        date.setMinutes(time[1]);


        inputTime.bulmaCalendar.startTime=date;
        startHourLabel=document.querySelector('.timepicker-start .timepicker-hours .timepicker-input-number');
        startHourLabel.innerHTML=time[0];
        startMinLabel= document.querySelector('.timepicker-start .timepicker-minutes .timepicker-input-number');
        startMinLabel.innerHTML=time[1];

        time =endTime.split(':');
        date=new Date(inputTime.bulmaCalendar.endTime);
        date.setHours(time[0]);
        date.setMinutes(time[1]);

        inputTime.bulmaCalendar.endTime=date
         endHourLabel= document.querySelector('.timepicker-end .timepicker-hours .timepicker-input-number');
        endHourLabel.innerHTML=time[0];
        endMinLabel= document.querySelector('.timepicker-end .timepicker-minutes .timepicker-input-number');
        endMinLabel.innerHTML=time[1];
    }


}

const showPopup = (event) => {

    console.log(event.allDay);
    document.querySelector('#event__title').value=event.title;


    bulmaDateEnd.style.display='none';
    let eventStartTime;
    let eventEndTime;
    if(event.allDay){

        eventStartTime=(new Date(event.start)).toTimeString().toString().split(' ',1).toString();
        eventEndTime=(new Date(event.start));
        eventEndTime.setMinutes(eventEndTime.getMinutes() + 30);
        eventEndTime=eventEndTime.toTimeString().toString().split(' ',1).toString()
    }else{
        eventStartTime=(new Date(event.start)).toTimeString().toString().split(' ',1).toString();
        eventEndTime=(new Date(event.end)).toTimeString().toString().split(' ',1).toString();
    }

    ;

    let eventStartDate=(new Date(event.start)).toLocaleDateString('fr').toString();
    let eventEndDate=(new Date(event.end)).toLocaleDateString('fr').toString();

    setSelectTypeValues(Days[(new Date(event.start)).getDay()]);
    // console.log(event.end);
    initializeDateInput(eventStartDate,eventEndDate);
    initializeTimeInput(eventStartTime,eventEndTime);

    hideModal(false);
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

    if (popupLeft < 0 || popupLeft === undefined)
        popupLeft = 0;
    if (popupTop < 0 || popupTop === undefined)
        popupTop = 0;


    popUp.style.left = `${popupLeft}px`;
    popUp.style.top = `${popupTop}px`;

}

var calendar = new FullCalendar.Calendar(calendarEl, {

    locale:'fr',
    initialView: 'dayGridMonth',
    editable: true,
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    selectable: true,
    eventChange:function(changeInfo){
      console.log(changeInfo.event._instance.range.start.toISOString());
      console.log(changeInfo.event._instance.range.end.toISOString());
    },
    eventClick: function (info) {
        contextMenu.style.display='block';
        showMenuContext(true)
        inputEventId.value=info.event._def.publicId;
        btnEventView.href=info.event._def.url;
        contextMenu.style.top=`${info.jsEvent.clientY}px`;
        contextMenu.style.left=`${info.jsEvent.clientX}px`;
        console.log(info);
    },
    select: function select(info) {
        //start,end,startStr,endStr,allDay,jsEvent,view,resource


        let currentEvent = {
            id: DEFAULT_EVENT_ID,
            title: '(titre)',
            start:new Date(info.startStr),
            end: new Date(info.endStr),
            allDay:info.allDay
        };



        if(info.allDay){
            if(!(((new Date(info.endStr))-(new Date(info.startStr)))>86400000)){
                let dateNow =new Date(info.startStr);
                let endDate=new Date(info.startStr)
                dateNow.setHours(8);
                endDate.setHours(8);
                endDate.setMinutes(endDate.getMinutes() + 30)
                currentEvent.start=dateNow;
                currentEvent.end=endDate;
                // currentEvent.endTime=endDate;
            }else{
                let endDate=new Date(info.startStr);
                endDate.setMinutes(endDate.getMinutes() + 30)
                // currentEvent.endTime=endDate;
            }
        }else{
            console.log(currentEvent);
            console.log(info.startStr);
        }
        console.log(currentEvent);
        calendar.addEvent(currentEvent);
        showPopup(currentEvent);
    },

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
            id:'test',
            title: 'Click for Google',
            url: 'http://google.com/',
            start: '2020-09-28',
            end: '2020-09-29'
        }
    ]
});
const validateEvent=(event)=>{

        let valide=true;
        if(event.title===''){
            valide=false;
        }
        if(event.type!==EVENTTYPE.NOTREPEATED && (new Date(convertDateString(event.startDate)))>=(new Date(convertDateString(event.endDate))))
            valide =false;

        return valide;
}
const resetModal=()=>{
    document.querySelector('#event__title').value='';
         document.querySelector('.bulmaDate .datetimepicker-dummy-input').value='';
        document.querySelector('.bulmaDateEnd .datetimepicker-dummy-input').value='';
        selectInputType.value='';
        document.querySelector('.bulmaTime .datetimepicker-dummy-input.is-datetimepicker-range').value='';
        document.querySelectorAll('.bulmaTime .datetimepicker-dummy-input')[1].value='';
        document.querySelector('#event__zoomType').value='';
        document.querySelector('#event__file').value='';
}

const AddEvent=(event)=>{
    let calendarEvent={};

    calendarEvent.allDay=false;

    calendarEvent.title=event.title;
    calendarEvent.editable=true;
        // start: '2020-09-12T10:30:00',
        // end: '2020-09-12T12:30:00'

    if(event.type!==EVENTTYPE.NOTREPEATED){
        calendarEvent.groupId='groupId';
        calendarEvent.startRecur=convertDateString(event.startDate);
        calendarEvent.endRecur=convertDateString(event.endDate);
        calendarEvent.startTime=event.startTime;
        calendarEvent.endTime=event.endTime;
    }
    else{
        calendarEvent.start=`${convertDateString(event.startDate)}T${event.startTime}`;
        calendarEvent.end=`${convertDateString(event.endDate)}T${event.endTime}`;
    }

    calendarEvent.id='This';
    calendar.addEvent(calendarEvent);

}
const removeEvent=(id)=>{
    let event =calendar.getEventById(id)
    if(event)
        event.remove();

}
const hideModal=hide=>{
    if(hide){
        popUpContainer.style.display = 'none'
        resetModal();
    }else{
        popUpContainer.style.display = 'block'
    }
}


document.addEventListener('DOMContentLoaded', function () {




     btnCancelEvent.addEventListener('click',()=>{
         removeEvent(DEFAULT_EVENT_ID);
         hideModal(true);
     })


    popUpContainer.addEventListener('click', (e) => {
        if(e.target===popUpContainer){
            hideModal(true);
            removeEvent(DEFAULT_EVENT_ID);
        }

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

    calendar.render();

    document.querySelectorAll('a.fc-event').forEach(el=>el.removeAttribute('href'));

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

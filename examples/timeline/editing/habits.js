
      var isDebug = false;
      var numSleepItems = 5;
      var numMinutesPerStep = 10;
      var animationDurMillis = 750;

      // current date
      var nowDate = new Date();
      var nowYear = nowDate.getFullYear();
      var nowMonth = nowDate.getMonth() + 1; // zero-indexed
      var nowDay = nowDate.getDate();

      // tomorrow
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate()+1);
      var tomYear = tomorrow.getFullYear();
      var tomMonth = tomorrow.getMonth() + 1; // zero-indexed
      var tomDay = tomorrow.getDate();

      // create a dataset with items
      // we specify the type of the fields `start` and `end` here to be strings
      // containing an ISO date. The fields will be outputted as ISO dates
      // automatically getting data from the DataSet via items.get().
      var items = new vis.DataSet({
        type: { start: 'ISODate', end: 'ISODate' }
      });

      // ISO Dates: today & tomorrow
      var isoToday = nowYear + "-" + addZero(nowMonth) + "-" + addZero(nowDay);
      var isoTomorrow = tomYear + "-" + addZero(tomMonth) + "-" + addZero(tomDay);
      logEvent("isoToday: " + isoToday, isDebug);
      logEvent("isoTomorrow: " + isoTomorrow, isDebug);

      // add items to the DataSet
      var sleepLabels = ["", "Bed Time", "Lights Out", "Fall Asleep", "Wake Up", "Out of Bed"];
      items.add(
      [
        {id: 1, content: sleepLabels[1] + ": 9:30 pm", start: isoToday + "T21:30:00"},
        {id: 2, content: sleepLabels[2] + ": 10:00 pm", start: isoToday + "T22:00:00"},
        {id: 3, content: sleepLabels[3] + ": 10:45 pm", start: isoToday + "T22:45:00"},
        {id: 4, content: sleepLabels[4] + ": 7:00 am",  start: isoTomorrow + "T07:00:00"},
        {id: 5, content: sleepLabels[5] + ": 7:55 am",  start: isoTomorrow + "T07:55:00"},
        {id: 'Day1Am', content: "", start: isoToday + "T00:00:00", end: isoToday + "T12:00:00", type: 'background', className: 'am2'},
        {id: 'Day1Pm', content: "", start: isoToday + "T12:00:01", end: isoToday + "T23:59:59", type: 'background', className: 'pm2'},
        {id: 'Day2Am', content: "", start: isoTomorrow + "T00:00:00", end: isoTomorrow + "T12:00:00", type: 'background', className: 'am2'},
        {id: 'Day2Pm', content: "", start: isoTomorrow + "T12:00:01", end: isoTomorrow + "T23:59:59", type: 'background', className: 'pm2'},
      ]);

      // log changes to the console
      items.on('*', function (event, properties) {
        console.log(event, properties.items);
      });

      // not sure how to programatically init the item labels, so just set them in add method, above
      // items.forEach(function (item) {
      //     item.content = `${sleepLabels[item.id]}: ${new Date(item.start).getHours()}:${addZero(new Date(item.start).getMinutes())}`;
      //   });

      var minGlobal = new Date(nowYear, nowMonth-1, nowDay);   // month param expects zero-indexed
      var maxGlobal = new Date(tomYear, tomMonth-1, tomDay+1); // month param expects zero-indexed

      // note: vis event times are ISO times, so we must convert min/max
      var minGlobalIso = minGlobal.toISOString(); // month param expects zero-indexed
      var maxGlobalIso = maxGlobal.toISOString(); // month param expects zero-indexed

      var options =
      {
        // bounds and size props
        min: minGlobal,
        max: maxGlobal,
        zoomMin: 1000 * 60 * 60 * 12, // half day (millis)
        zoomMax: 1000 * 60 * 60 * 48, // two days (millis)
        timeAxis: {scale: 'minute', step: numMinutesPerStep},
        height: '300px',
        width: '100%',

        // self-explanatory settings
        multiselect: false,
        horizontalScroll: true,
        zoomKey: 'ctrlKey',
        showMinorLabels: false,
        showMajorLabels: true,

        // enable/disable individual actions:
        editable: {
          add: false,
          updateTime: true,
          updateGroup: false,
          remove: false,
        },
        showCurrentTime: false,

        // bound items between neighbors, or global min/max
        onMoving: function (item, callback) {
          var prevIdx = item.id - 1;
          var nextIdx = item.id + 1;

          // bound items to global bounds
          if ( item.start < minGlobalIso ) {
            item.start = minGlobalIso;
          }
          if (item.start > maxGlobalIso) {
            item.start = maxGlobalIso;
          }
          if (item.end > maxGlobalIso) {
            item.end   = maxGlobalIso;
          }

          resetValue(item);

          // update time, and send back the (possibly) changed item
          var newTime = new Date(item.start);
          var newHours = newTime.getHours();
          var newMins = addZero(newTime.getMinutes());
          var amPm = newHours >= 12 ? 'pm' : 'am';

          // 12hr clock
          newHours = newHours%12;
          newHours = newHours ? newHours : 12;
          var newTimeLabel = newHours + ":" + newMins + " " + amPm;
          item.content = sleepLabels[item.id] + ": " + newTimeLabel;
          
          // update items to the left
          var leftItem = item;
          while (prevIdx > 0) {
            leftItem = items.get(prevIdx);

            if (item.start < leftItem.start) {
              leftItem.start = item.start;
              leftItem.content = sleepLabels[prevIdx] + ": " + newTimeLabel;
              items.update(leftItem);
            }
            else break;

            prevIdx--;
          }

          // update items to the right
          var rightItem = item;
          while (nextIdx <= numSleepItems) {
            rightItem = items.get(nextIdx);

            if (item.start > rightItem.start) {
              rightItem.start = item.start;
              rightItem.content = sleepLabels[nextIdx] + ": " + newTimeLabel;
              items.update(rightItem);
            }
            else break;

            nextIdx++;
          }

          // debug log
          if ( isDebug == true ) {
            logEvent(item.start, maxGlobalIso, isDebug);
          }

          // continue callback
          callback(item);
        }
      };


      $(document).ready(function() {
	      // create timeline obj
	      var container = document.getElementById('visualization');
	      var timeline = new vis.Timeline(container, items, options);
	      
	      // set visibility explicitly
	      //var timelineDiv = container.firstChild;
	      //timelineDiv.style.visibility = "visible";
	      var timelineDiv = container.childNodes;
	      $('.vis-timeline').css("visibility", "visible");
	      
	      // set window, and first selection
	      timeline.setWindow(isoToday + "T13:00:00", isoTomorrow + "T11:00:00", {animation: {duration: animationDurMillis, easingFunction: "easeInOutQuad"}});
	      timeline.setSelection(1);
      });

      // DEBUG: log all events
      // items.on('*', function (event, properties) {
      //   logEvent(event, properties, isDebug);
      // });

      // helper for logging event/props
      function logEvent(event, properties, isDebug) {
        if ( !isDebug ) return;
        var log = document.getElementById('log');
        var msg = document.createElement('div');
        msg.innerHTML = 'event=' + JSON.stringify(event) + ', ' +
            'properties=' + JSON.stringify(properties);
        log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
      }

      // helper for logging event/props
      function logEvent(event, isDebug) {
        if ( !isDebug ) return;
        var log = document.getElementById('log');
        var msg = document.createElement('div');
        msg.innerHTML = JSON.stringify(event);
        log.firstChild ? log.insertBefore(msg, log.firstChild) : log.appendChild(msg);
      }

      // helper for adding zero to times (e.g. '01' in 12:01)
      function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
      }

$(document).ready(function() {	
	
	//set Limesurvey value  
	var keys = Object.keys(items._data);
	for(var i=0;i<keys.length;i++){
		var key = keys[i];  
		sleep = items._data[key];
		 
		resetValue(sleep);
	} 	
});

var fallAsleep = ''; 
 
function resetValue(sleep){    

	if(sleep.id == 1){//	BedTime 
		$('#answer171981X87X1035').val(getHours(sleep.start));  
		$('#answer171981X87X1035').change();  
		console.log('BedTime ==' + getHours(sleep.start));   
	}else if(sleep.id == 2){// LightsOutTime
		$('#answer171981X87X1185').val(getHours(sleep.start));  
		$('#answer171981X87X1185').change();  
		console.log('LightsOutTime ==' + getHours(sleep.start));  
		howMuchSleep();
	}else if(sleep.id == 3){// Fall asleep
		fallAsleep = getHours(sleep.start);  
		console.log('Fall asleep ==' + getHours(sleep.start));   
		howMuchSleep();
	}else if(sleep.id == 4){ // WakeTime
		$('#answer171981X87X1187').val(getHours(sleep.start));  
		$('#answer171981X87X1187').change();  
		console.log('WakeTime ==' + getHours(sleep.start));   
		howMuchSleep();
	}else if(sleep.id == 5){  // Out of bed
		$('#answer171981X87X1188').val(getHours(sleep.start));
		$('#answer171981X87X1188').change();  
		console.log('Out of bed ==' + getHours(sleep.start));   
	}
}

function getHours (start){   
	var newTime = new Date(start);
	var itemHours = newTime.getHours();
	var itemMins = addZero(newTime.getMinutes());
	return itemHours + ':' + itemMins; 
}

						
function howMuchSleep (){  
	calFallAsleep();
	calHowMuchSleep();
}

function calFallAsleep(){   
	var bed = $('#answer171981X87X1185').val().split(':'); 
	var asleep = fallAsleep.split(':'); 
	var bedMinutes = (bed[0] * 60) + parseInt(bed[1]);
	var sleepMinutes = (asleep[0] * 60) + parseInt(asleep[1]); 
	 
	if(bedMinutes > sleepMinutes){// between midnight 
		sleepMinutes = sleepMinutes + (24 * 60);
	} 
	sleepMinutes = sleepMinutes - bedMinutes; 
	 
	$('#answer171981X87X1186').val(Math.floor(sleepMinutes / 60) + ':' + ('0' + (sleepMinutes % 60)).slice(-2)); 
	$('#answer171981X87X1186').change();  
}

function calHowMuchSleep (){    
	var sleep = $('#answer171981X87X1187').val().split(':'); 
	var sleepMinutes = (sleep[0] * 60) + parseInt(sleep[1]);
	var asleep = fallAsleep.split(':'); 
	var bedMinutes = (asleep[0] * 60) + parseInt(asleep[1]);
	
	if(bedMinutes > sleepMinutes){// between midnight 
		sleepMinutes = sleepMinutes + (24 * 60);
	}
	sleepMinutes = sleepMinutes - bedMinutes; 
	$('#answer171981X87X1189').val(Math.floor(sleepMinutes / 60) + ':' + ('0' + (sleepMinutes % 60)).slice(-2)); 
	$('#answer171981X87X1189').change();  
} 
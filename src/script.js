$(document).ready(function()
{
  let name = getCookie('name');
  let datePicker = getCookie('datePicker');
  
  if(name)
  {
    $('#name').val(name); 
  }
  if(datePicker){
    $('#datePicker').val(datePicker);
    setTimeout(function() 
    {
      populateDates();
    }, 100);
  }

  $('#datePicker').on('change', function() 
  {
    let datePicker = $(this).val();
    setCookie('datePicker', datePicker);
  });       
  $('#name').on('change', function() 
  {
    let name = $(this).val();
    setCookie('name', name);
  });
  
  

  function setCookie(target, value) 
  {
    document.cookie = `${target}=${encodeURIComponent(value)}`;
  }
 
  function getCookie(target) 
  {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) 
    {
      let cookie = cookies[i].trim();
      if (cookie.startsWith(target + '=')) 
      {
        return decodeURIComponent(cookie.substring(target.length + 1));
      }
    }
    return null;
  }
        
  const weekDays = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  
  $('#datePicker').datepicker({ //JQueryUI datepicker
        showAnim: 'fadeIn',
        dateFormat: "mm/dd/yy",
        firstDay: 1,
        beforeShowDay: function(date) 
        {
        // Check if the date is the 1st or 16th of the month
        var day = date.getDate();
        return [day === 1 || day === 16, ""];
        },
        onSelect: function(dateText){
         setCookie('datePicker', dateText); 
         populateDates();
        }
      });
      function getStopVal(date) 
      {
        if(date.getDate() == 1)
        {
          return 15;
        }
        // Get the month and year from the given date
        const month = date.getMonth();
        const year = date.getFullYear();

        // Create a new date object for the next month
        const nextMonth = new Date(year, month + 1, 1);

        // Subtract 1 day from the next month to get the last day of the current month
        const lastDayOfMonth = new Date(nextMonth - 1).getDate();

        // Return the number of days in the current month as an integer
        return lastDayOfMonth - date.getDate() + 1;
      }
      function populateDates() 
      {
        
        $('#tBody').empty(); //clear table
        $('.bottom').removeClass('d-none'); //display total hours worked
        let chosenDate = $('#datePicker').datepicker('getDate'); //get chosen date from datepicker
        let endDate = getStopVal(chosenDate);
        
        let newDate;
        const rowId = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16'];
        for(let i = 0; i < endDate; i++) 
        { //iterate through each day
          newDate = new Date(chosenDate); //create date object
          newDate.setDate(chosenDate.getDate() + i); //increment set date
          //append results to table
          $('#tBody').append( `
          <tr>
            <td class="day">${weekDays[newDate.getDay()].slice(0,3)}</td>
            <td class="date">${newDate.getMonth() + 1} / ${newDate.getDate()}</td>
            <td class="start-time"><input id="startTime${rowId[i]}" class="time ui-timepicker-input" type="text" /></td>
            <td class="finish-time"><input id="finishTime${rowId[i]}" class="time ui-timepicker-input" type="text" /></td></td>
            <td class="break">
              <select id="break${rowId[i]}">
                <option value="0">0 mins</option>
                <option value="0.25">15 mins</option>
                <option value="0.5">30 mins</option>
                <option value="0.75">45 mins</option>
                <option value="1">1 hr</option>
              </select>
            </td>
            <td class="hours-worked" id="hoursWorked${rowId[i]}"></td>
            <td class="hours-overtime" id="overTime${rowId[i]}"></td>
          </tr>
          `);

          //function to calculate hours worked
          let calculateHours = () => 
          {
            let startVal = $(`#startTime${rowId[i]}`).val();
            let finishVal = $(`#finishTime${rowId[i]}`).val();
            let startTime = new Date( `01/01/2007 ${startVal}` );
            let finishTime = new Date( `01/01/2007 ${finishVal}` );
            let breakTime = $(`#break${rowId[i]}`).val();
            let overTime = 0;
            let hoursWorked = (finishTime.getTime() - startTime.getTime()) / 1000;
            hoursWorked /= (60 * 60);
            hoursWorked -= breakTime;
      
            if(hoursWorked > 8)
            {
              overTime = hoursWorked - 8;
            }
            else
            {
              overTime = 0;
            }
            
            if (startVal && finishVal) { //providing both start and finish times are set
              if (hoursWorked >= 0) 
              { //if normal day shift
                if(hoursWorked > 8)
                {
                  $(`#hoursWorked${rowId[i]}`).html(8);
                  $(`#overTime${rowId[i]}`).html(overTime);
                }
                else
                {
                  $(`#hoursWorked${rowId[i]}`).html(hoursWorked);
                }
                $(`#hoursWorked${rowId[i]}`).html(hoursWorked);
              } else 
              { //if night shift
                $(`#hoursWorked${rowId[i]}`).html(24 + hoursWorked);
              }
            }

            updateTotal();
          }
          
          let startTimeCookie = getCookie(`startTime_${i}`);
          if (startTimeCookie) {
            $(`#startTime${rowId[i]}`).val(startTimeCookie);
            calculateHours();
          }
          
          $(`#startTime${rowId[i]}`).on('change', function() {
          let startTimeValue = $(this).val();
            calculateHours();
          setCookie(`startTime_${i}`, startTimeValue);
          });
          
          let finishTimeCookie = getCookie(`finishTime_${i}`);
          if (finishTimeCookie) {
            $(`#finishTime${rowId[i]}`).val(finishTimeCookie);
            calculateHours();
          }
          
          $(`#finishTime${rowId[i]}`).on('change', function() {
          let finishTimeValue = $(this).val();
            calculateHours();
          setCookie(`finishTime_${i}`, finishTimeValue);
          });
          
          let breakCookie = getCookie(`break_${i}`);
          if (breakCookie) {
            $(`#break${rowId[i]}`).val(breakCookie);
            calculateHours();
          }
          
          $(`#break${rowId[i]}`).on('change', function() {
          let breakValue = $(this).val();
            calculateHours();
          setCookie(`break_${i}`, breakValue);
          });
       
          
        }
        $('.start-time input').timepicker({ 'timeFormat': 'h:i A', 'step': 15, 'scrollDefault': '09:00' });
        $('.finish-time input').timepicker({ 'timeFormat': 'h:i A', 'step': 15, 'scrollDefault': '17:00' });

        function updateTotal() 
        { //function to update the total hours worked
          let totalHoursWorked = 0;
          let hrs = document.querySelectorAll('.hours-worked');
          hrs.forEach(function(val) {
            totalHoursWorked += Number(val.innerHTML);
          });
          document.querySelector('#totalHours').innerHTML = totalHoursWorked;
        }
        

      }
// Attach a click event handler to the existing submit button
$('#submit').on('click', function() {
    window.print(); // Print the screen
  });
  
 $('#clear').on('click', function() {

  // Reset input fields to their default or empty values
  $('#name').val('');
  $('#datePicker').val('');
  //clear the table rows
  $('#tBody').empty();
  setTimeout(function() {
    clearAllCookies();
  }, 100);
});

// Function to clear all cookies
function clearAllCookies() {
  let cookies = document.cookie.split(';');
  cookies.forEach(function(cookie) {
    let cookieName = cookie.trim().split('=')[0];
    setCookie(cookieName, '');
    deleteCookie(cookieName);
  });
}

// Function to delete a cookie by setting its expiration to a past date
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

    });
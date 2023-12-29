
  function openCalendar() {
    const inputField = document.getElementById('flatpickrInput');
    const inputField2 = document.getElementById('flatpickrInput2');

    const calendarInstance = flatpickr(inputField, {
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
    });

    calendarInstance.open();
    
     const calendarInstance2 = flatpickr(inputField2, {
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
    });
    // Open the calendar
    
    calendarInstance2.open();
  }

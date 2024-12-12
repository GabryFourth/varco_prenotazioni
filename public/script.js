!function() {
    var today = moment();
  
    function Calendar(selector, events) {
      this.el = document.querySelector(selector);
      this.events = events.map(ev => ({
        ...ev,
        date: moment(ev.date) // Ensure the date is a moment object
      }));
      this.current = moment().date(1);
      this.draw();
      var current = document.querySelector('.today');
      if (current) {
        var self = this;
        window.setTimeout(function() {
          self.openDay(current);
        }, 500);
      }
    }
  
    Calendar.prototype.draw = function() {
      //Create Header
      this.drawHeader();
  
      //Draw Month
      this.drawMonth();
  
      this.drawLegend();
    };
  
    Calendar.prototype.drawHeader = function() {
      var self = this;
      if (!this.header) {
        //Create the header elements
        this.header = createElement('div', 'header');
        this.header.className = 'header';
  
        this.title = createElement('h1');
  
        var right = createElement('div', 'right');
        right.addEventListener('click', function() { self.nextMonth(); });
  
        var left = createElement('div', 'left');
        left.addEventListener('click', function() { self.prevMonth(); });
  
        //Append the Elements
        this.header.appendChild(this.title);
        this.header.appendChild(right);
        this.header.appendChild(left);
        this.el.appendChild(this.header);
      }
  
      this.title.innerHTML = this.current.format('MMMM YYYY');
    };
  
    Calendar.prototype.drawMonth = function() {
      var self = this;
  
      if (this.month) {
        this.oldMonth = this.month;
        this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
        this.oldMonth.addEventListener('webkitAnimationEnd', function() {
          self.oldMonth.parentNode.removeChild(self.oldMonth);
          self.month = createElement('div', 'month');
          self.backFill();
          self.currentMonth();
          self.fowardFill();
          self.el.appendChild(self.month);
          window.setTimeout(function() {
            self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
          }, 16);
        });
      } else {
        this.month = createElement('div', 'month');
        this.el.appendChild(this.month);
        this.backFill();
        this.currentMonth();
        this.fowardFill();
        this.month.className = 'month new';
      }
    };
  
    Calendar.prototype.backFill = function() {
      var clone = this.current.clone();
      var dayOfWeek = clone.day();
  
      if (!dayOfWeek) { return; }
  
      clone.subtract(dayOfWeek + 1, 'days');
  
      for (var i = dayOfWeek; i > 0; i--) {
        this.drawDay(clone.add(1, 'days'));
      }
    };
  
    Calendar.prototype.fowardFill = function() {
      var clone = this.current.clone().add(1, 'months').subtract(1, 'days');
      var dayOfWeek = clone.day();
  
      if (dayOfWeek === 6) { return; }
  
      for (var i = dayOfWeek; i < 6; i++) {
        this.drawDay(clone.add(1, 'days'));
      }
    };
  
    Calendar.prototype.currentMonth = function() {
      var clone = this.current.clone();
  
      while (clone.month() === this.current.month()) {
        this.drawDay(clone);
        clone.add(1, 'days');
      }
    };
  
    Calendar.prototype.getWeek = function(day) {
      if (!this.week || day.day() === 0) {
        this.week = createElement('div', 'week');
        this.month.appendChild(this.week);
      }
    };
  
    Calendar.prototype.drawDay = function(day) {
      var self = this;
      this.getWeek(day);
  
      //Outer Day
      var outer = createElement('div', this.getDayClass(day));
      outer.addEventListener('click', function() {
        self.openDay(this);
      });
  
      //Day Name
      var name = createElement('div', 'day-name', day.format('ddd'));
  
      //Day Number
      var number = createElement('div', 'day-number', day.format('DD'));
  
  
      //Events
      var events = createElement('div', 'day-events');
      this.drawEvents(day, events);
  
      outer.appendChild(name);
      outer.appendChild(number);
      outer.appendChild(events);
      this.week.appendChild(outer);
    };
  
    Calendar.prototype.drawEvents = function(day, element) {
      if (day.month() === this.current.month()) {
        var todaysEvents = this.events.filter(ev => ev.date.isSame(day, 'day'));
  
        todaysEvents.forEach(function(ev) {
          var evSpan = createElement('span', ev.color);
          element.appendChild(evSpan);
        });
      }
    };
  
    Calendar.prototype.getDayClass = function(day) {
      var classes = ['day'];
      if (day.month() !== this.current.month()) {
        classes.push('other');
      } else if (today.isSame(day, 'day')) {
        classes.push('today');
      }
      return classes.join(' ');
    };
  
    Calendar.prototype.openDay = function(el) {
      var details, arrow;
      var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
      var day = this.current.clone().date(dayNumber);
  
      var currentOpened = document.querySelector('.details');
  
      //Check to see if there is an open detais box on the current row
      if (currentOpened && currentOpened.parentNode === el.parentNode) {
        details = currentOpened;
        arrow = document.querySelector('.arrow');
      } else {
        if (currentOpened) {
          currentOpened.addEventListener('animationend', function() {
            currentOpened.parentNode.removeChild(currentOpened);
          });
          currentOpened.className = 'details out';
        }
  
        //Create the Details Container
        details = createElement('div', 'details in');
  
        //Create the arrow
        arrow = createElement('div', 'arrow');
  
        details.appendChild(arrow);
        el.parentNode.appendChild(details);
      }
  
      var todaysEvents = this.events.filter(ev => ev.date.isSame(day, 'day'));
  
      this.renderEvents(todaysEvents, details);
  
      arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
    };

    // Funzione per trovare e aggiornare l'evento
    function updateEvent(eventDateTimestamp, instagramTag) {

        // Converte il timestamp in formato "YYYY-MM-DD" usando il fuso orario locale
        var eventDate = new Date(eventDateTimestamp);
        var eventDateString = eventDate.toLocaleDateString('en-CA'); // formato YYYY-MM-DD

        // Trova l'evento corrispondente nella lista dei dati
        var eventIndex = data.findIndex(event => event.date === eventDateString);

        if (eventIndex !== -1) {
            // Aggiorna l'evento localmente
            data[eventIndex].instaTag = instagramTag;
            data[eventIndex].calendar = 'Occupato';
            data[eventIndex].color = 'orange';
            console.log(`Evento del ${eventDateString} aggiornato localmente:`, data[eventIndex]);

            fetch('http://localhost:3000/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedData => {
                console.log('File JSON aggiornato con successo', updatedData);
            })
            .catch(error => {
                console.error('Errore nell\'aggiornamento del file JSON:', error);
            });
            
            fetch('http://localhost:3000/sendMail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify([
                    {
                        "instaTag": instagramTag,
                        "eventDate": eventDateString
                    }
                ]),
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(updatedData => {
                console.log('File JSON aggiornato con successo', updatedData);
            })
            .catch(error => {
                console.error('Errore nell\'aggiornamento del file JSON:', error);
            });

        } else {
            console.log(`Evento non trovato per la data: ${eventDateString}`);
        }
    }

    // Function to open the overlay and show the event date
    function openReservationOverlay(eventDateTimestamp) {
        // Convert the timestamp to a Date object
        var eventDate = new Date(eventDateTimestamp);

        // Format the date to "12 December 2024"
        var formattedDate = eventDate.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });

        // Create the overlay
        var overlay = createElement('div', 'overlay');
        var overlayContent = createElement('div', 'overlay-content');
        var closeButton = createElement('button', 'close-overlay', 'Close');
        var instagramInputLabel = createElement('label', '', 'Enter Instagram Tag:');
        var instagramInput = createElement('input', 'instagram-tag-input');
        var eventDateLabel = createElement('div', 'event-date', 'Event Date: ' + formattedDate);
        var submitButton = createElement('button', 'submit-reservation', 'Reserve');

        overlayContent.appendChild(eventDateLabel);
        overlayContent.appendChild(instagramInputLabel);
        overlayContent.appendChild(instagramInput);
        overlayContent.appendChild(submitButton);
        overlayContent.appendChild(closeButton);
        overlay.appendChild(overlayContent);

        // Append the overlay to the body
        document.body.appendChild(overlay);

        // Close the overlay when the close button is clicked
        closeButton.addEventListener('click', function() {
            document.body.removeChild(overlay);
        });

        // Handle the reservation submission
        submitButton.addEventListener('click', function() {
            var instagramTag = instagramInput.value.trim();

            // Regular expression to validate Instagram tag
            var instagramTagRegex = /^@([A-Za-z0-9_\.]+)$/;

            if (instagramTag && instagramTagRegex.test(instagramTag)) {
                // Close the current overlay after reservation
                document.body.removeChild(overlay);

                updateEvent(eventDateTimestamp, instagramTag);

                // Create the confirmation overlay
                var confirmationOverlay = createElement('div', 'overlay');
                var confirmationOverlayContent = createElement('div', 'overlay-content');
                var confirmationMessage = createElement('label', '', 'grazie per aver prenotato! la contatteremo subito per i dettagli. se vuoi annullare la prenotazione scrivi a @varcofficial');
                var okButton = createElement('button', 'submit-reservation', 'Continua');

                confirmationOverlayContent.appendChild(confirmationMessage);
                confirmationOverlayContent.appendChild(okButton);
                confirmationOverlay.appendChild(confirmationOverlayContent);

                // Append the confirmation overlay to the body
                document.body.appendChild(confirmationOverlay);

                // Close the confirmation overlay when the OK button is clicked
                okButton.addEventListener('click', function() {
                    document.body.removeChild(confirmationOverlay);
                    window.location.reload(true);
                });


            } else {
                alert('Please enter a valid Instagram tag starting with "@" and containing only allowed characters');
            }
        });
    }
  
    Calendar.prototype.renderEvents = function(events, ele) {
        var currentWrapper = ele.querySelector('.events');
        var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));
      
        events.forEach(function(ev) {
          var div = createElement('div', 'event');
          var span = createElement('span', '', 'prenotato da '+ev.instaTag);
          var button = createElement('button', 'reserve-class', 'Prenota');
      
          if (ev.calendar == "Prenotabile") {
            div.appendChild(button);
          } else {
            div.appendChild(span);
          }
      
          wrapper.appendChild(div);
      
          // Add event listener to the button for opening the overlay
          button.addEventListener('click', function() {
            openReservationOverlay(ev.date);
          });
        });
      
        if (!events.length) {
          var div = createElement('div', 'event empty');
          var span = createElement('span', '', 'No Events');
          div.appendChild(span);
          wrapper.appendChild(div);
        }
      
        if (currentWrapper) {
          currentWrapper.className = 'events out';
          currentWrapper.addEventListener('animationend', function() {
            currentWrapper.parentNode.removeChild(currentWrapper);
            ele.appendChild(wrapper);
          });
        } else {
          ele.appendChild(wrapper);
        }
      };      
  
    Calendar.prototype.drawLegend = function() {
      var legend = createElement('div', 'legend');
      this.events.map(e => `${e.calendar}|${e.color}`)
        .filter((e, i, arr) => arr.indexOf(e) === i)
        .forEach(function(e) {
          var parts = e.split('|');
          var entry = createElement('span', 'entry ' + parts[1], parts[0]);
          legend.appendChild(entry);
        });
      this.el.appendChild(legend);
    };
  
    Calendar.prototype.nextMonth = function() {
      this.current.add(1, 'months');
      this.next = true;
      this.draw();
    };
  
    Calendar.prototype.prevMonth = function() {
      this.current.subtract(1, 'months');
      this.next = false;
      this.draw();
    };
  
    window.Calendar = Calendar;
  
    function createElement(tagName, className, innerText) {
      var ele = document.createElement(tagName);
      if (className) {
        ele.className = className;
      }
      if (innerText) {
        ele.innerText = innerText;
      }
      return ele;
    }
  }();
  
  var data = [];
  
  !function() {
    // Fetch the data from the server
    fetch('http://localhost:3000/data')
      .then(response => response.json())
      .then(jsonData => {
        data = jsonData; // Assign the fetched data to the variable
  
        // Now initialize the calendar with the fetched data
        var calendar = new Calendar('#calendar', data);
      })
      .catch(error => {
        console.error('Error loading data:', error);
      });
  }();
  
let events = JSON.parse(localStorage.getItem('hhEvents')) || [];
const eventGrid = document.getElementById("eventGrid");
const savedEventsContainer = document.getElementById("savedEvents");
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter-button");
const eventModal = document.getElementById("eventModal");
const modalDetails = document.getElementById("modalDetails");
const closeModal = document.getElementById("closeModal");

let selectedCategory = "All";
let savedEventIds = JSON.parse(localStorage.getItem("happnhubSavedEvents")) || [];

function getBannerClass(category) {
  return category.toLowerCase();
}

function createEventCard(event) {
  const isSaved = savedEventIds.includes(event.id);

  return `
    <article class="event-card">
      <div class="event-banner ${getBannerClass(event.category)}">
        <span class="category-tag">${event.category}</span>
        <span class="event-date">${event.date}</span>
      </div>

      <div class="card-content">
        <h3>${event.title}</h3>
        <p class="event-info">🕒 ${event.time}</p>
        <p class="event-info">📍 ${event.venue}</p>

        <div class="card-actions">
          <button class="card-button" onclick="openModal(${event.id})">
            Details
          </button>

          <button
            class="card-button save-button ${isSaved ? "saved" : ""}"
            onclick="toggleSavedEvent(${event.id})"
          >
            ${isSaved ? "Saved ✓" : "Save event"}
          </button>
        </div>
      </div>
    </article>
  `;
}

function renderEvents() {
  const searchText = searchInput.value.toLowerCase().trim();

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategory === "All" || event.category === selectedCategory;

    const matchesSearch =
      event.title.toLowerCase().includes(searchText) ||
      event.venue.toLowerCase().includes(searchText) ||
      event.organizer.toLowerCase().includes(searchText);

    return matchesCategory && matchesSearch;
  });

  if (filteredEvents.length === 0) {
    eventGrid.innerHTML = `<p class="empty-message">No events found. Try another search or category.</p>`;
    return;
  }

  eventGrid.innerHTML = filteredEvents.map(createEventCard).join("");
}

function renderSavedEvents() {
  const savedEvents = events.filter((event) => savedEventIds.includes(event.id));

  if (savedEvents.length === 0) {
    savedEventsContainer.innerHTML = `
      <p class="empty-message">
        You have not saved any events yet. Explore an event and click “Save event”.
      </p>
    `;
    return;
  }

  savedEventsContainer.innerHTML = savedEvents.map(createEventCard).join("");
}

function toggleSavedEvent(eventId) {
  if (savedEventIds.includes(eventId)) {
    savedEventIds = savedEventIds.filter((id) => id !== eventId);
  } else {
    savedEventIds.push(eventId);
  }

  localStorage.setItem("happnhubSavedEvents", JSON.stringify(savedEventIds));

  renderEvents();
  renderSavedEvents();
}

function openModal(eventId) {
  const event = events.find((item) => item.id === eventId);

  modalDetails.innerHTML = `
    <p class="eyebrow">${event.category} · ${event.date}</p>
    <h3>${event.title}</h3>
    <p>${event.description}</p>
    <p><strong>Time:</strong> ${event.time}</p>
    <p><strong>Venue:</strong> ${event.venue}</p>
    <p><strong>Organized by:</strong> ${event.organizer}</p>
  `;

  eventModal.classList.remove("hidden");
}

function closeEventModal() {
  eventModal.classList.add("hidden");
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedCategory = button.dataset.category;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    renderEvents();
  });
});

searchInput.addEventListener("input", renderEvents);

closeModal.addEventListener("click", closeEventModal);

eventModal.addEventListener("click", (event) => {
  if (event.target === eventModal) {
    closeEventModal();
  }
});

renderEvents();
renderSavedEvents();
// --- 1. POPUP OPEN / CLOSE LOGIC ---

// Unga admin panel "Add" button click panna idhu trigger aaganum:
function openAddEventModal() {
    document.getElementById('eventModal').style.display = 'flex';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
    // Reset inputs
    document.getElementById('formEventName').value = '';
    document.getElementById('formVenue').value = '';
    document.getElementById('formStudentLimit').value = '';
    document.getElementById('formHasFee').value = 'No';
    document.getElementById('feeAmountContainer').style.display = 'none';
    document.getElementById('formFeeAmount').value = '0';
}

// Fees select panna matum amount field-ah kaata intha function:
function toggleFeeInput() {
    const hasFee = document.getElementById('formHasFee').value;
    const feeContainer = document.getElementById('feeAmountContainer');
    if (hasFee === 'Yes') {
        feeContainer.style.display = 'block';
    } else {
        feeContainer.style.display = 'none';
        document.getElementById('formFeeAmount').value = '0';
    }
}

// --- 2. DATA SAVE & UPLOAD LOGIC ---

document.getElementById('saveEventBtn').addEventListener('click', function() {
    // Collect values from form
    const name = document.getElementById('formEventName').value;
    const theme = document.getElementById('formEventTheme').value;
    const startTime = document.getElementById('formStartTime').value;
    const endTime = document.getElementById('formEndTime').value;
    const venue = document.getElementById('formVenue').value;
    const hasFee = document.getElementById('formHasFee').value;
    const feeAmount = document.getElementById('formFeeAmount').value;
    const studentLimit = document.getElementById('formStudentLimit').value;

    // Basic validation check
    if(!name || !venue || !studentLimit) {
        alert("Boss! Ella mandatory fields-ayum fill pannunga.");
        return;
    }

    // New event object creation
    const newEvent = {
        id: Date.now(), // Unique ID matching timestamp
        name: name,
        theme: theme,
        startTime: startTime,
        endTime: endTime,
        venue: venue,
        entryFee: hasFee === 'Yes' ? `Rs. ${feeAmount}` : 'Free Entry',
        limit: studentLimit
    };

    // Push new event into our main events array
    events.push(newEvent);

    // Save to browser live local storage
    localStorage.setItem('hhEvents', JSON.stringify(events));

    // Success alert
    alert("Mass boss! New event website la upload aayidichu!");

    // Close popup
    closeEventModal();

    // Call your existing function that displays data on screen (Example: displayEvents())
    if (typeof displayEvents === "function") {
        displayEvents(); 
    } else {
        location.reload(); // Re-render logic illa na page auto reload panni screen update aagum
    }
});
// --- NEW CLEAN EVENT LOGIC ---

function openAddEventModal() {
    document.getElementById('eventModal').style.display = 'flex';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
}

function toggleFeeInput() {
    const hasFee = document.getElementById('formHasFee').value;
    const feeContainer = document.getElementById('feeAmountContainer');
    if (hasFee === 'Yes') {
        feeContainer.style.display = 'block';
    } else {
        feeContainer.style.display = 'none';
    }
}

document.getElementById('saveEventBtn').addEventListener('click', function() {
    const name = document.getElementById('formEventName').value;
    const venue = document.getElementById('formVenue').value;
    const studentLimit = document.getElementById('formStudentLimit').value;

    if(!name || !venue || !studentLimit) {
        alert("Ella fields-um fill pannunga boss!");
        return;
    }

    // Direct push
    const newEvent = {
        name: name,
        theme: document.getElementById('formEventTheme').value,
        venue: venue
    };
    if (typeof events !== 'undefined') { events.push(newEvent); } else { var events = [newEvent]; }
    localStorage.setItem('hhEvents', JSON.stringify(events));
    
    alert("Event saved!");
    location.reload();
});
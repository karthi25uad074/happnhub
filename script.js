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
// --- ADMIN POPUP CONTROL ---
function openAddEventModal() {
    document.getElementById('eventModal').style.display = 'flex';
}

function closeEventModal() {
    document.getElementById('eventModal').style.display = 'none';
}

// --- SAVE LOGIC ---
document.getElementById('saveEventBtn').addEventListener('click', function() {
    const name = document.getElementById('formEventName').value;
    const venue = document.getElementById('formVenue').value;
    const limit = document.getElementById('formStudentLimit').value;

    if(!name || !venue || !limit) {
        alert("Ella fields-um fill pannunga boss!");
        return;
    }

    const newEvent = {
        id: Date.now(),
        title: name,
        venue: venue,
        category: "Technical", // Default
        date: "2026-07-15",
        time: "10:00 AM",
        organizer: "Admin",
        description: "New Event"
    };

    events.push(newEvent); 
    localStorage.setItem('hhEvents', JSON.stringify(events));
    
    alert("Event saved!");
    location.reload();
});
// --- ADMIN POPUP SYSTEM CONTROL ---
function openAddEventModal() {
    const targetModal = document.getElementById('newAddEventModal');
    if (targetModal) targetModal.style.display = 'flex';
}

function closeMyModal() {
    const targetModal = document.getElementById('newAddEventModal');
    if (targetModal) {
        targetModal.style.display = 'none';
        // Reset dynamic elements
        document.getElementById('popupEventName').value = '';
        document.getElementById('popupEventVenue').value = '';
        document.getElementById('popupEventLimit').value = '';
        document.getElementById('popupStartTime').value = '';
        document.getElementById('popupEndTime').value = '';
        document.getElementById('popupHasFee').value = 'No';
        document.getElementById('popupFeeAmount').value = '0';
        document.getElementById('popupFeeAmountContainer').style.display = 'none';
    }
}

// Fees toggle function (Yes sonna amount box varum)
function toggleFeeField() {
    const hasFee = document.getElementById('popupHasFee').value;
    const feeContainer = document.getElementById('popupFeeAmountContainer');
    if (hasFee === 'Yes') {
        feeContainer.style.display = 'block';
    } else {
        feeContainer.style.display = 'none';
        document.getElementById('popupFeeAmount').value = '0';
    }
}

// --- REQUIREMENT BASED DATA EXTRACTION & LIVE INJECTION ---
function saveMyEvent() {
    // Value capturing
    const name = document.getElementById('popupEventName').value.trim();
    const category = document.getElementById('popupEventCategory').value;
    const startTime = document.getElementById('popupStartTime').value;
    const endTime = document.getElementById('popupEndTime').value;
    const venue = document.getElementById('popupEventVenue').value.trim();
    const hasFee = document.getElementById('popupHasFee').value;
    const feeAmount = document.getElementById('popupFeeAmount').value;
    const limit = document.getElementById('popupEventLimit').value;

    // Strict validation verification
    if (!name || !venue || !limit || !startTime || !endTime) {
        alert("Boss! Ella fields-ayum correct-a fill pannunga!");
        return;
    }

    // Process fee formatting string
    const finalFeeStr = (hasFee === 'Yes') ? `Rs. ${feeAmount}` : 'Free Entry';

    // Formulating matching object with your original application state properties
    const structuredEvent = {
        id: Date.now(),
        title: name,
        category: category,
        time: `${startTime} - ${endTime}`,
        venue: venue,
        entryFee: finalFeeStr, 
        limit: limit,
        date: "2026-07-15",   
        organizer: "Admin Controller",
        description: `Theme: ${category} | Max Limit: ${limit} Students | Entry: ${finalFeeStr}`
    };

    // Pushing into runtime global 'events' array structure safely
    if (typeof events !== 'undefined') {
        events.push(structuredEvent);
        localStorage.setItem('hhEvents', JSON.stringify(events));
        
        alert("Mass Boss! Event successfully uploaded to HappnHub!");
        closeMyModal();
        
        // Re-rendering page natively to immediately paint layout cards
        location.reload();
    } else {
        alert("Critical Error: Core application system configuration is missing!");
    }
}
// ==========================================
// SAFE INJECTED DELETE SUBSYSTEM (CRASH-PROOF)
// ==========================================

// Intha variable-ah safe-a function-ku mela define panrom
var mySafeDeleteEventId = null;

function openDeleteEventModal() {
    const deleteModal = document.getElementById('newDeleteEventModal');
    const listContainer = document.getElementById('deleteEventListContainer');
    
    if (!deleteModal || !listContainer) {
        alert("HTML-la Modal div block adiyila illai boss!");
        return;
    }
    
    // Clear previous view state safely
    listContainer.innerHTML = '';
    mySafeDeleteEventId = null;

    // Check application dynamic state reference safely 
    // (Unga script-la variable per 'events' illana 'allEvents'-a nu check panrom)
    let currentActiveEvents = [];
    if (typeof events !== 'undefined') {
        currentActiveEvents = events;
    } else if (typeof allEvents !== 'undefined') {
        currentActiveEvents = allEvents;
    } else {
        listContainer.innerHTML = '<p style="color: red; text-align: center;">Core database array missing!</p>';
        deleteModal.style.display = 'flex';
        return;
    }

    if (currentActiveEvents.length === 0) {
        listContainer.innerHTML = '<p style="color: #666; text-align: center; margin: 10px 0;">No active events found to delete, boss!</p>';
        deleteModal.style.display = 'flex';
        return;
    }

    // Render system cards with robust identification mapping
    currentActiveEvents.forEach(event => {
        const itemRow = document.createElement('div');
        itemRow.style.padding = '10px';
        itemRow.style.borderBottom = '1px solid #eee';
        itemRow.style.display = 'flex';
        itemRow.style.alignItems = 'center';
        itemRow.style.gap = '10px';
        itemRow.style.cursor = 'pointer';
        
        itemRow.onclick = function() {
            const radio = itemRow.querySelector('input[type="radio"]');
            if (radio) {
                radio.checked = true;
                mySafeDeleteEventId = event.id;
                Array.from(listContainer.children).forEach(child => child.style.background = 'transparent');
                itemRow.style.background = '#ffebeb';
            }
        };

        itemRow.innerHTML = `
            <input type="radio" name="deleteTargetEvent" value="${event.id}" style="cursor: pointer;">
            <div style="flex: 1;">
                <strong style="display: block; color: #333;">${event.title || event.name || 'Untitled Event'}</strong>
                <span style="font-size: 12px; color: #666;">📍 Venue: ${event.venue || 'N/A'}</span>
            </div>
        `;
        listContainer.appendChild(itemRow);
    });

    deleteModal.style.display = 'flex';
}

function closeDeleteModal() {
    const deleteModal = document.getElementById('newDeleteEventModal');
    if (deleteModal) deleteModal.style.display = 'none';
    mySafeDeleteEventId = null;
}

function executeEventDeletion() {
    if (!mySafeDeleteEventId) {
        alert("Boss! First ethavathu oru event-ah select pannunga!");
        return;
    }

    if (confirm("Are you sure you want to completely remove this event?")) {
        if (typeof events !== 'undefined') {
            events = events.filter(item => item.id !== mySafeDeleteEventId);
            localStorage.setItem('hhEvents', JSON.stringify(events));
            alert("Done boss! Event removed successfully.");
            closeDeleteModal();
            location.reload();
        } else if (typeof allEvents !== 'undefined') {
            allEvents = allEvents.filter(item => item.id !== mySafeDeleteEventId);
            localStorage.setItem('hhEvents', JSON.stringify(allEvents));
            alert("Done boss! Event removed successfully.");
            closeDeleteModal();
            location.reload();
        } else {
            alert("Error syncing database modifications!");
        }
    }
}
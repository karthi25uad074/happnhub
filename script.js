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
// --- CRASH-PROOF SAVE BUTTON FIX (LINE 174) ---
const saveEventBtnElement = document.getElementById('saveEventBtn');
if (saveEventBtnElement) {
    saveEventBtnElement.addEventListener('click', function() {
        // Collect values from form
        const name = document.getElementById('formEventName').value;
        const theme = document.getElementById('formEventTheme').value;
        const startTime = document.getElementById('formStartTime').value;
        const endTime = document.getElementById('formEndTime').value;
        const venue = document.getElementById('formVenue').value;
        const hasFee = document.getElementById('formHasFee').value;
        const feeAmount = document.getElementById('formFeeAmount').value;
        const studentLimit = document.getElementById('formStudentLimit').value;
        const eventDateVal = document.getElementById('formEventDate').value; 
        const regEndTimeVal = document.getElementById('formRegEndTime').value;
        
        // dynamic local check if you have any logic below
    });
}

// --- 🎟️ AUTOMATIC STUDENT REGISTER BUTTON INJECTOR ---
function injectRegistrationButtonsDirectly() {
    // Screenshot-la buttons "Details" matrum "Save event" pakkathu-la div kulla iruku.
    // So buttons irukra containers-ah target panrom.
    const allCards = document.querySelectorAll('.card, [class*="card"], .event-card, div > button[id*="save"]');
    
    allCards.forEach(element => {
        // Parent card container-ah kandupudikirom
        let parentCard = element;
        if (element.tagName === 'BUTTON') {
            parentCard = element.parentElement;
        }

        // Anti-duplicate layer
        if (parentCard.querySelector('.mass-register-btn')) return;

        // Create new register button style match target
        const registerBtn = document.createElement('button');
        registerBtn.className = 'mass-register-btn';
        registerBtn.innerText = 'Register';
        registerBtn.style.cssText = 'padding: 8px 16px; background: #007bff; color: white; border: 1px solid #007bff; border-radius: 6px; font-weight: 500; cursor: pointer; margin-left: 8px; font-size: 14px;';
        
        registerBtn.onclick = function(e) {
            e.preventDefault();
            // Get title text dynamically from card layout
            let eventTitle = "Campus Event";
            const titleElement = parentCard.parentElement.querySelector('h2, h3, h4, .title');
            if (titleElement) eventTitle = titleElement.innerText;
            
            openRegModal('EVT-DYNAMIC', eventTitle);
        };

        // Screenshot loop-la card button options row target
        const actionRow = parentCard.querySelector('div') || parentCard;
        actionRow.appendChild(registerBtn);
    });
}

// Every 1 sec continuous execution engine
setInterval(injectRegistrationButtonsDirectly, 1000);
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
// ==========================================
// SAFE INJECTED EDIT SUBSYSTEM
// ==========================================
var mySafeEditEventId = null;

function openEditSelectModal() {
    const editModal = document.getElementById('newEditSelectModal');
    const listContainer = document.getElementById('editEventListContainer');
    if (!editModal || !listContainer) return;

    listContainer.innerHTML = '';
    mySafeEditEventId = null;

    let currentEvents = (typeof events !== 'undefined') ? events : ((typeof allEvents !== 'undefined') ? allEvents : []);

    if (currentEvents.length === 0) {
        listContainer.innerHTML = '<p style="color: #666; text-align: center; margin: 10px 0;">No active events found to edit, boss!</p>';
        editModal.style.display = 'flex';
        return;
    }

    currentEvents.forEach(event => {
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
                mySafeEditEventId = event.id;
                Array.from(listContainer.children).forEach(child => child.style.background = 'transparent');
                itemRow.style.background = '#fff9e6'; // Warm yellow tone highlight
            }
        };

        itemRow.innerHTML = `
            <input type="radio" name="editTargetEvent" value="${event.id}" style="cursor: pointer;">
            <div style="flex: 1;">
                <strong style="display: block; color: #333;">${event.title || event.name || 'Untitled'}</strong>
                <span style="font-size: 12px; color: #666;">📍 Venue: ${event.venue || 'N/A'}</span>
            </div>
        `;
        listContainer.appendChild(itemRow);
    });

    editModal.style.display = 'flex';
}

function closeEditSelectModal() {
    const editModal = document.getElementById('newEditSelectModal');
    if (editModal) editModal.style.display = 'none';
}

// TOGGLE FUNCTION FOR EDIT ENTRY FORM FEES
function toggleEditFeeField() {
    const hasFee = document.getElementById('editPopupHasFee').value;
    const feeContainer = document.getElementById('editPopupFeeAmountContainer');
    if (hasFee === 'Yes') {
        feeContainer.style.display = 'block';
    } else {
        feeContainer.style.display = 'none';
        document.getElementById('editPopupFeeAmount').value = '0';
    }
}

// ➡️ NEXT ACTION: RENDER ALREADY POPULATED VALUES
function openActualEditForm() {
    if (!mySafeEditEventId) {
        alert("Boss! First ethavathu oru event-ah select pannunga!");
        return;
    }

    let currentEvents = (typeof events !== 'undefined') ? events : ((typeof allEvents !== 'undefined') ? allEvents : []);
    const targetObj = currentEvents.find(item => item.id === mySafeEditEventId);

    if (!targetObj) {
        alert("Target event object error!");
        return;
    }

    // Load pre-configured data accurately into input boxes
    document.getElementById('editPopupEventName').value = targetObj.title || targetObj.name || '';
    document.getElementById('editPopupEventCategory').value = targetObj.category || 'Technical';
    document.getElementById('editPopupEventVenue').value = targetObj.venue || '';
    document.getElementById('editPopupEventLimit').value = targetObj.limit || '';

    // Split times cleanly from string pattern '09:00 - 17:00'
    if (targetObj.time && targetObj.time.includes(' - ')) {
        const parts = targetObj.time.split(' - ');
        document.getElementById('editPopupStartTime').value = parts[0].trim();
        document.getElementById('editPopupEndTime').value = parts[1].trim();
    } else {
        document.getElementById('editPopupStartTime').value = '';
        document.getElementById('editPopupEndTime').value = '';
    }

    // Auto check if previous registration was a paid model
    const feeStr = targetObj.entryFee || '';
    if (feeStr && (feeStr.includes('Rs.') || parseInt(feeStr) > 0)) {
        document.getElementById('editPopupHasFee').value = 'Yes';
        document.getElementById('editPopupFeeAmountContainer').style.display = 'block';
        document.getElementById('editPopupFeeAmount').value = feeStr.replace(/[^0-9]/g, '');
    } else {
        document.getElementById('editPopupHasFee').value = 'No';
        document.getElementById('editPopupFeeAmountContainer').style.display = 'none';
        document.getElementById('editPopupFeeAmount').value = '0';
    }

    // Modal view swap transitions
    closeEditSelectModal();
    document.getElementById('newEditFormModal').style.display = 'flex';
}

function closeEditFormModal() {
    const formModal = document.getElementById('newEditFormModal');
    if (formModal) formModal.style.display = 'none';
    mySafeEditEventId = null;
}

// 💾 FINAL BACKEND COMPACTION ENGINE ON SAVE
function saveEditedEventChanges() {
    const name = document.getElementById('editPopupEventName').value.trim();
    const category = document.getElementById('editPopupEventCategory').value;
    const startTime = document.getElementById('editPopupStartTime').value;
    const endTime = document.getElementById('editPopupEndTime').value;
    const venue = document.getElementById('editPopupEventVenue').value.trim();
    const hasFee = document.getElementById('editPopupHasFee').value;
    const feeAmount = document.getElementById('editPopupFeeAmount').value;
    const limit = document.getElementById('editPopupEventLimit').value;

    if (!name || !venue || !limit || !startTime || !endTime) {
        alert("Boss! Fields fill pannaama update seiya mudiyathu!");
        return;
    }

    const finalFeeStr = (hasFee === 'Yes') ? `Rs. ${feeAmount}` : 'Free Entry';

    // Map object sync mutations across core configurations arrays
    const mutateHandler = (item) => {
        if (item.id === mySafeEditEventId) {
            item.title = name;
            item.name = name; // dual-property assurance layout mapping
            item.category = category;
            item.time = `${startTime} - ${endTime}`;
            item.venue = venue;
            item.entryFee = finalFeeStr;
            item.limit = limit;
            item.description = `Theme: ${category} | Max Limit: ${limit} Students | Entry: ${finalFeeStr}`;
        }
        return item;
    };

    if (typeof events !== 'undefined') {
        events = events.map(mutateHandler);
        localStorage.setItem('hhEvents', JSON.stringify(events));
    }
    if (typeof allEvents !== 'undefined') {
        allEvents = allEvents.map(mutateHandler);
        localStorage.setItem('hhEvents', JSON.stringify(allEvents));
    }

    alert("Mass boss! Event changes saved successfully.");
    closeEditFormModal();
    location.reload();
}
// =================================================================
// 🔥 UPGRADED ADVANCED MUTATION ENGINE: SEATS & AUTO-DEADLINE LOOKUP
// =================================================================

function forceInjectRegButtons() {
    const allCards = document.querySelectorAll('.event-card, [id^="event-"], .card, .events-container > div, .events-grid > div, [class*="card"]');
    
    allCards.forEach((card) => {
        // Anti-duplicate layers check
        if (card.querySelector('.btn-custom-register') || card.querySelector('.reg-status-badge')) return;

        // 1. EXTRACT DATA PROPERTY VALUES FROM CARD
        let eventTitle = "Campus Event";
        const heading = card.querySelector('h3, h4, .event-title, .title, strong');
        if (heading) {
            eventTitle = heading.innerText.trim();
        } else {
            eventTitle = card.innerText.split('\n')[0].trim();
        }

        let eventId = card.getAttribute('data-id') || card.id || "EVT-" + encodeURIComponent(eventTitle).substring(0, 10);

        // 2. REAL-TIME LOCAL STORAGE SEAT TRACKER
        let allRegs = JSON.parse(localStorage.getItem('hhRegistrations')) || [];
        let currentRegCount = allRegs.filter(reg => reg.eventId === eventId).length;

        // Max limit processing lookup (card attribute-la irundhu edukum, illena 50 limit default)
        let maxLimit = parseInt(card.getAttribute('data-limit')) || 50; 
        let seatsLeft = maxLimit - currentRegCount;

        // 3. REGISTRATION DEADLINE CALCULATOR ENGINE
        let regEndStr = card.getAttribute('data-reg-end') || card.getAttribute('data-event-date'); 
        let isTimeExpired = false;
        
        if (regEndStr) {
            let deadline = new Date(regEndStr);
            let now = new Date();
            if (now > deadline) {
                isTimeExpired = true;
            }
        }

        // 4. DESIGN SEAT COUNTER LABELS Dynamic UI Insertion
        if (!card.querySelector('.seat-counter-lbl')) {
            const seatIndicator = document.createElement('div');
            seatIndicator.className = 'seat-counter-lbl';
            seatIndicator.style.cssText = 'font-size: 13px; font-weight: bold; margin: 8px auto; text-align: center; font-family: sans-serif; width: 90%;';
            
            if (seatsLeft <= 0) {
                seatIndicator.innerHTML = `⚠️ <span style="color: #dc3545;">Seats Full (0/${maxLimit})</span>`;
            } else {
                seatIndicator.innerHTML = `🎟️ <span style="color: #28a745;">Seats Left: ${seatsLeft}/${maxLimit}</span>`;
            }
            card.appendChild(seatIndicator);
        }

        // 5. CONDITIONAL RENDER PIPELINE ACTION ROW
        const existingBtn = card.querySelector('button, .btn, .btn-custom-register');
        
        if (isTimeExpired) {
            // Case A: Timeout scenario -> Injection Closed Warning
            const timeoutBadge = document.createElement('span');
            timeoutBadge.className = 'reg-status-badge';
            timeoutBadge.innerText = '🚫 Registration Closed (Timeout)';
            timeoutBadge.style.cssText = 'width: 90%; margin: 12px auto; padding: 10px; background: #dc3545; color: white; border-radius: 6px; font-weight: bold; font-size: 13px; text-align: center; display: block; font-family: sans-serif;';
            
            if (existingBtn && existingBtn.parentNode) {
                existingBtn.parentNode.insertBefore(timeoutBadge, existingBtn.nextSibling);
            } else {
                card.appendChild(timeoutBadge);
            }
        }
        else if (seatsLeft <= 0) {
            // Case B: Housefull scenario -> Injection Closed Warning
            const fullBadge = document.createElement('span');
            fullBadge.className = 'reg-status-badge';
            fullBadge.innerText = '🚫 Registration Closed (Housefull)';
            fullBadge.style.cssText = 'width: 90%; margin: 12px auto; padding: 10px; background: #6c757d; color: white; border-radius: 6px; font-weight: bold; font-size: 13px; text-align: center; display: block; font-family: sans-serif;';
            
            if (existingBtn && existingBtn.parentNode) {
                existingBtn.parentNode.insertBefore(fullBadge, existingBtn.nextSibling);
            } else {
                card.appendChild(fullBadge);
            }
        }
        else {
            // Case C: Everything fine -> Active Register Interface Button
            const regBtn = document.createElement('button');
            regBtn.className = 'btn-custom-register';
            regBtn.innerText = '🎟️ Register Now';
            regBtn.style.cssText = 'width: 90%; margin: 12px auto; display: block; padding: 10px 15px; background: #007bff; color: #ffffff; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; font-size: 14px; text-align: center; z-index: 999; box-shadow: 0 2px 5px rgba(0,0,0,0.15);';
            
            regBtn.onmouseover = () => regBtn.style.background = '#0056b3';
            regBtn.onmouseout = () => regBtn.style.background = '#007bff';
            
            regBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                openRegModal(eventId, eventTitle);
            };

            if (existingBtn && existingBtn !== regBtn && existingBtn.parentNode) {
                existingBtn.parentNode.insertBefore(regBtn, existingBtn.nextSibling);
            } else {
                card.appendChild(regBtn);
            }
        }
    });
}

// 👁️ MUTATION OBSERVER ENGINE SYSTEM
const observer = new MutationObserver((mutations) => {
    forceInjectRegButtons();
});
observer.observe(document.body, { childList: true, subtree: true });

// Initial Load Check
setTimeout(forceInjectRegButtons, 500);

// --- FORM MODAL CONTROLS ---
function openRegModal(id, title) {
    const modal = document.getElementById('newRegisterFormModal');
    if (!modal) return;
    document.getElementById('regTargetEventId').value = id;
    document.getElementById('regModalEventTitle').innerText = `Register for: ${title}`;
    modal.style.display = 'flex';
}

function closeRegModal() {
    const modal = document.getElementById('newRegisterFormModal');
    if (modal) modal.style.display = 'none';
    document.getElementById('regStudentName').value = '';
    document.getElementById('regStudentRoll').value = '';
    document.getElementById('regStudentClass').value = '';
    document.getElementById('regStudentDept').value = '';
    document.getElementById('regStudentEmail').value = '';
    document.getElementById('regStudentMobile').value = '';
}

// --- SUBMIT COMPILATION DATA ---
function submitStudentRegistration() {
    const id = document.getElementById('regTargetEventId').value;
    const eventTitle = document.getElementById('regModalEventTitle').innerText.replace('Register for: ', '');
    const name = document.getElementById('regStudentName').value.trim();
    const roll = document.getElementById('regStudentRoll').value.trim();
    const sClass = document.getElementById('regStudentClass').value.trim();
    const dept = document.getElementById('regStudentDept').value.trim();
    const email = document.getElementById('regStudentEmail').value.trim();
    const mobile = document.getElementById('regStudentMobile').value.trim();

    if (!name || !roll || !sClass || !dept || !email || !mobile) {
        alert("Boss! All 6 registration fields are mandatory!");
        return;
    }

    let records = JSON.parse(localStorage.getItem('hhRegistrations')) || [];
    const newReg = {
        eventId: id, eventTitle: eventTitle, name: name, roll: roll,
        classSection: sClass, department: dept, email: email, mobile: mobile,
        timestamp: new Date().toLocaleString()
    };

    records.push(newReg);
    localStorage.setItem('hhRegistrations', JSON.stringify(records));
    alert(`Mass Boss! ${name} successfully registered for ${eventTitle}!`);
    
    forceInjectRegButtons(); 
    closeRegModal();
    location.reload(); 
}

// --- CONTROLLER EXCLUSIVE MANAGEMENT VIEWS ---
function openAdminRegModal() {
    const tableBody = document.getElementById('adminRegTableBody');
    if(!tableBody) return;
    tableBody.innerHTML = '';

    let records = JSON.parse(localStorage.getItem('hhRegistrations')) || [];

    if (records.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="padding: 15px; text-align: center; color: #666;">No student registrations recorded yet, boss!</td></tr>`;
        document.getElementById('adminRegistrationViewModal').style.display = 'flex';
        return;
    }

    records.forEach(rec => {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #eee';
        row.innerHTML = `
            <td style="padding: 10px; font-weight: bold;">${rec.eventTitle}</td>
            <td style="padding: 10px;">${rec.name}</td>
            <td style="padding: 10px; color: #555;">${rec.roll}</td>
            <td style="padding: 10px;">${rec.classSection}</td>
            <td style="padding: 10px;">${rec.department}</td>
            <td style="padding: 10px; font-size: 13px;">${rec.email}</td>
            <td style="padding: 10px;">${rec.mobile}</td>
        `;
        tableBody.appendChild(row);
    });

    document.getElementById('adminRegistrationViewModal').style.display = 'flex';
}

function closeAdminRegModal() {
    document.getElementById('adminRegistrationViewModal').style.display = 'none';
}

function exportRegDataToCSV() {
    let records = JSON.parse(localStorage.getItem('hhRegistrations')) || [];
    if (records.length === 0) return alert("No data available to export, boss!");

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Event Name,Student Name,Roll Number,Class & Section,Department,Email,Mobile,Timestamp\n";

    records.forEach(rec => {
        let row = `"${rec.eventTitle}","${rec.name}","${rec.roll}","${rec.classSection}","${rec.department}","${rec.email}","${rec.mobile}","${rec.timestamp}"`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", "HappnHub_Event_Registrations.csv");
    document.body.appendChild(downloadAnchor);
    
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
}
// =================================================================
// 🔗 AUTOMATIC DATA INTERCEPTOR PIPELINE (STEP 2 CORE FIX)
// =================================================================
(function() {
    // 1. Hook into Add Event Logic
    const saveBtn = document.getElementById('saveEventBtn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const dateVal = document.getElementById('formEventDate')?.value || "";
            const regEndVal = document.getElementById('formRegEndTime')?.value || "";
            
            // Temporary log console check layout 
            console.log("Captured Dynamic Form Inputs:", dateVal, regEndVal);
        });
    }

    // 2. Intercept Event Creation to Attach HTML attributes 
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        const element = originalCreateElement.call(document, tagName);
        if (tagName.toLowerCase() === 'div') {
            // dynamic checker hook inject inside Mutation observer system
            setTimeout(() => {
                if (element.classList && (element.classList.contains('event-card') || element.classList.contains('card'))) {
                    const dateInput = document.getElementById('formEventDate')?.value;
                    const regInput = document.getElementById('formRegEndTime')?.value;
                    if (dateInput) element.setAttribute('data-event-date', dateInput);
                    if (regInput) element.setAttribute('data-reg-end', regInput);
                }
            }, 50);
        }
        return element;
    };
})();
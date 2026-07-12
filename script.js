const events = [
  {
    id: 1,
    title: "CodeSprint 2026",
    category: "Technical",
    date: "18 JUL",
    time: "9:00 AM",
    venue: "CSE Block, Lab 3",
    organizer: "Coding Club",
    description: "A 6-hour competitive coding challenge for students who love solving problems.",
  },
  {
    id: 2,
    title: "UI/UX Design Workshop",
    category: "Workshop",
    date: "20 JUL",
    time: "10:30 AM",
    venue: "Innovation Hall",
    organizer: "Design Club",
    description: "Learn how to create simple, user-friendly mobile and web interfaces using Figma.",
  },
  {
    id: 3,
    title: "Rhythm Night",
    category: "Cultural",
    date: "23 JUL",
    time: "5:30 PM",
    venue: "Open Auditorium",
    organizer: "Cultural Committee",
    description: "An evening of music, dance, and student performances from across the campus.",
  },
  {
    id: 4,
    title: "Inter-Department Football",
    category: "Sports",
    date: "25 JUL",
    time: "4:00 PM",
    venue: "College Ground",
    organizer: "Sports Club",
    description: "Cheer for your department in the annual knockout football tournament.",
  },
  {
    id: 5,
    title: "Build Your First Website",
    category: "Workshop",
    date: "27 JUL",
    time: "2:00 PM",
    venue: "IT Seminar Hall",
    organizer: "Web Club",
    description: "A beginner-friendly hands-on session to build and publish your first website.",
  },
  {
    id: 6,
    title: "Hack the Campus",
    category: "Technical",
    date: "30 JUL",
    time: "8:00 AM",
    venue: "Main Block",
    organizer: "Innovation Cell",
    description: "A campus hackathon where teams build solutions for real student problems.",
  },
];

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
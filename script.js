const WEDDING_CONFIG = {
  googleFormUrl: "https://forms.gle/REPLACE_WITH_YOUR_GOOGLE_FORM_LINK",
  googleFormFields: {
    name: "",
    pax: "",
  },
  guests: [
    { name: "Christine Carlos", pax: 2 },
    { name: "Mitch Dee Tan", pax: 1 },
    { name: "Lyndon Las", pax: 4 },
    { name: "Ohana Supplier", pax: 2 },
  ],
};

const form = document.querySelector("#rsvpPanel");
const guestInput = document.querySelector("#guestName");
const result = document.querySelector("#guestResult");
const googleFormLink = document.querySelector("#googleFormLink");
const music = document.querySelector("#weddingMusic");
const musicToggle = document.querySelector("#musicToggle");

function normalizeName(value) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function findGuest(value) {
  const requestedName = normalizeName(value);
  return WEDDING_CONFIG.guests.find((guest) => normalizeName(guest.name) === requestedName);
}

function buildGoogleFormUrl(guestName, pax) {
  const url = new URL(WEDDING_CONFIG.googleFormUrl);
  const fields = WEDDING_CONFIG.googleFormFields;

  if (fields.name) {
    url.searchParams.set(fields.name, guestName);
  }

  if (fields.pax) {
    url.searchParams.set(fields.pax, String(pax));
  }

  return url.toString();
}

function updateGuestResult(guest) {
  if (!guest) {
    result.textContent =
      "We could not find that name yet. Please check the spelling or contact the couple.";
    googleFormLink.href = WEDDING_CONFIG.googleFormUrl;
    return;
  }

  result.textContent = `${guest.name}, we reserved ${guest.pax} pax for your invitation.`;
  googleFormLink.href = buildGoogleFormUrl(guest.name, guest.pax);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateGuestResult(findGuest(guestInput.value));
});

guestInput.addEventListener("input", () => {
  const guest = findGuest(guestInput.value);
  if (guest) {
    updateGuestResult(guest);
  }
});

googleFormLink.addEventListener("click", (event) => {
  if (!guestInput.value.trim()) {
    event.preventDefault();
    guestInput.focus();
    result.textContent = "Please enter your guest name first.";
    return;
  }

  const guest = findGuest(guestInput.value);
  updateGuestResult(guest);

  if (!guest) {
    event.preventDefault();
  }
});

musicToggle.addEventListener("click", async () => {
  try {
    if (music.paused) {
      await music.play();
      musicToggle.classList.add("is-playing");
      musicToggle.setAttribute("aria-label", "Pause background music");
    } else {
      music.pause();
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-label", "Play background music");
    }
  } catch (error) {
    result.textContent = "Add your music file at assets/Palagi - Tj Monterde  Violin Cover by BOJO, then tap play again.";
  }
});

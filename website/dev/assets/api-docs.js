async function loadApiDocs() {
  try {
    const response = await fetch("/assets/_meta.json");
    if (!response.ok) throw new Error("Failed to load _meta.json");
    const meta = await response.json();

    const nav = document.getElementById("nav");
    if (!nav) return;

    // Initialize search functionality
    const searchInput = document.getElementById("search");
    const searchStatus = document.getElementById("searchStatus");

    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        let visible = 0;
        let firstVisible = null;

        document.querySelectorAll(".nav-link").forEach((link) => {
          const text = link.textContent.toLowerCase();
          const match = q ? text.includes(q) : true;
          link.hidden = !match;
          link.style.display = match ? "" : "none";
          if (match) {
            visible++;
            if (!firstVisible) firstVisible = link;
          }
        });

        document.querySelectorAll(".nav-group").forEach((group) => {
          const hasVisible = !!group.querySelector(".nav-link:not([hidden])");
          group.hidden = q ? !hasVisible : false;
          group.style.display = q && !hasVisible ? "none" : "";
        });

        if (searchStatus) {
          searchStatus.textContent = q
            ? visible +
              " symbol" +
              (visible === 1 ? "" : "s") +
              " match '" +
              searchInput.value.trim() +
              "'"
            : "";
        }

        if (firstVisible instanceof HTMLElement)
          firstVisible.scrollIntoView({ block: "nearest" });
      });
    }
  } catch (error) {
    console.error("Failed to load API docs:", error);
  }
}

// Load when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadApiDocs);
} else {
  loadApiDocs();
}

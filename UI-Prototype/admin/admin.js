/** LCC Admin — Dashboard Controller */
document.addEventListener("DOMContentLoaded", () => {

  // Date subtitle
  const el = document.getElementById("pageDate");
  if (el) el.textContent = new Date().toLocaleDateString("en-LK",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // Sidebar collapse
  const sidebar = document.getElementById("sidebar");
  const wrapper = document.getElementById("mainWrapper");
  const overlay = document.getElementById("sidebarOverlay");
  const KEY = "lcc_sidebar_collapsed";

  function applyCollapse(val) {
    const c = val === true || val === "true";
    if (window.innerWidth > 1024) {
      sidebar?.classList.toggle("collapsed", c);
      wrapper?.classList.toggle("sidebar-collapsed", c);
      localStorage.setItem(KEY, c);
    } else {
      sidebar?.classList.toggle("mobile-open", !c);
      overlay?.classList.toggle("active", !c);
    }
  }

  applyCollapse(localStorage.getItem(KEY));

  document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    if (window.innerWidth > 1024) applyCollapse(localStorage.getItem(KEY) !== "true");
    else applyCollapse(sidebar?.classList.contains("mobile-open"));
  });

  overlay?.addEventListener("click", () => {
    sidebar?.classList.remove("mobile-open");
    overlay.classList.remove("active");
  });

  window.addEventListener("resize", () => applyCollapse(localStorage.getItem(KEY)));

  // Sign-out
  document.getElementById("signOutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear(); sessionStorage.clear();
    window.location.href = "../auth/login.html";
  });

  // Active nav
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-item[href]").forEach(l =>
    l.classList.toggle("active", l.getAttribute("href") === page));

});
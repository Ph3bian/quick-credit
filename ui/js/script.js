const ctrl = document.getElementById("menu");
const sidebar = document.getElementById("sidebar");
let isMobile = false
const navControl = () => {
    if (!isMobile) {
        isMobile = true;
        sidebar.style.display = "block";
        sidebar.classList.add("sidebarCanvasMenu");
    }
    else {
        sidebar.style.display = "none";
        isMobile = false;
    }
}


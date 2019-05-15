const ctrl = document.getElementById("menu");
const sidebar = document.getElementById("sidebar");
const defaultTab = document.getElementById("defaultTab");
const tableRow= document.querySelectorAll('.border-table tr')
let isMobile = false
const navControl = () => {
    if (!isMobile) {
        sidebar.style.display = "none";
        isMobile = true;
    }
    else {
        sidebar.style.display = "block";
        sidebar.classList.add("sidebarCanvasMenu");
        isMobile = false;
    }
}
const openAction = (evt, action) => {
    let i, tabItem, tablinks;
    tabItem = document.getElementsByClassName("tab-item");
    for (i = 0; i < tabItem.length; i++) {
        tabItem[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(action).style.display = "block";
    evt.currentTarget.className += " active";
}
if(defaultTab){
defaultTab.click();
}


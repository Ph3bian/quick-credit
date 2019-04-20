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
    console.log(evt)
    evt.currentTarget.className += " active";
}
document.getElementById("defaultTab").click();
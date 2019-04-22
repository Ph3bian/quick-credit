const openSubTab = (evt, action) => {
    let i, subItem, sublinks;
    subItem = document.getElementsByClassName("sub-nav-item");
    for (i = 0; i < subItem.length; i++) {
        subItem[i].style.display = "none";
    }
    sublinks = document.getElementsByClassName("sublinks");
    for (i = 0; i < sublinks.length; i++) {
        sublinks[i].className = sublinks[i].className.replace(" active", "");
    }
    document.getElementById(action).style.display = "block";
    evt.currentTarget.className += " active";
}
document.getElementById("defaultSubTab").click();
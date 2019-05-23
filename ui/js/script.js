/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const ctrl = document.getElementById('menu');
const sidebar = document.getElementById('sidebar');
const defaultTab = document.getElementById('defaultTab');

sidebar.style.display = 'block';
// eslint-disable-next-line no-unused-vars
const navControl = () => {
  if (sidebar.style.display === 'block') {
    sidebar.style.display = 'none';
  } else {
    sidebar.style.display = 'block';
    sidebar.classList.add('sidebarCanvasMenu');
  }
};

// eslint-disable-next-line no-unused-vars
const openAction = (evt, action) => {
  let i;
  const tabItem = document.getElementsByClassName('tab-item');
  // eslint-disable-next-line no-plusplus
  for (i = 0; i < tabItem.length; i++) {
    tabItem[i].style.display = 'none';
  }
  const tablinks = document.getElementsByClassName('tablinks');
  // eslint-disable-next-line no-plusplus
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(' active', '');
  }
  document.getElementById(action).style.display = 'block';
  // eslint-disable-next-line no-param-reassign
  evt.currentTarget.className += ' active';
};
if (defaultTab) {
  defaultTab.click();
}


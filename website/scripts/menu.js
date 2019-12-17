/* Toggle menu functionality */

function checkParent(node, element) {
  while (node.parentNode) {
    if (node === element) {
      return true;
    }
    node = node.parentNode;
  }
  return false;
}

document.onclick = (event) => {
  let menuButton = document.getElementsByClassName("ws-menu-btn")[0];
  let closeButton = document.getElementsByClassName("ws-menu-close-btn")[0];
  let menuItems = document.getElementById("menuItems");
  const target = (event && event.target) || (event && event.srcElement);

  // we check if click was made on a menu item, if so we do nothing
  if (!checkParent(target, menuItems)) {
    // click was not made on a menu item, so we check if menu button was clicked
    if (checkParent(target, menuButton)) {

      // click was made on the menu button, so we hide the menu button
      menuButton.style.display = "none";

      // and we show close button and menu items in this case
      closeButton.style.display = "block";
      menuItems.style.display = "flex";
    }

    // we check if close button was clicked
    if (checkParent(target, closeButton)) {
      // click was made on the close button, so we hide the close button and menu items
      closeButton.style.display = "none";
      menuItems.style.display = "none";

      // and we show menu button
      menuButton.style.display = "block";
    }
  }
};



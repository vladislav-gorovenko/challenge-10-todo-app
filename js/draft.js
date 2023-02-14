function addPointerEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  draggables.forEach((draggable) => {
    draggable.addEventListener("touchstart", (e) => touchStart(e));
    draggable.addEventListener("touchmove", (e) => touchMove(e));
    draggable.addEventListener("touchend", (e) => touchEnd(e));
  });
}

function touchStart(e) {
  [...e.changedTouches].forEach((touch) => {
    // e.preventDefault();
    disableScroll();
    const item = touch.target.closest(".draggable");
    dragStartIndex = +item.getAttribute("data-index");
  });
}

function touchMove(e) {
  [...e.changedTouches].forEach((touch) => {
    const element = document
      .elementFromPoint(touch.pageX, touch.pageY)
      .closest(".draggable");
    if (element) {
      if (shadowedElement != element) {
        if (shadowedElement) {
          console.log(shadowedElement);
          shadowedElement.classList.remove("over");
        }
      }
      shadowedElement = element;
      element.classList.add("over");
    } else {
      if (shadowedElement) {
        shadowedElement.classList.remove("over");
      }
    }
  });
}

function touchEnd(e) {
  [...e.changedTouches].forEach((touch) => {
    const element = document
      .elementFromPoint(touch.pageX, touch.pageY)
      .closest(".draggable");
    if (element) {
      const dragEndIndex = +element.getAttribute("data-index");
      swapItems(dragStartIndex, dragEndIndex);
    }
  });
  enableScroll();
}

function disableScroll() {
  // Get the current page scroll position in the vertical direction
  scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  // Get the current page scroll position in the horizontal direction

  scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // if any scroll is attempted,
  // set this to the previous value
  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop);
  };
}

function enableScroll() {
  window.onscroll = function () {};
}

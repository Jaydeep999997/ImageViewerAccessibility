import { imageContainer } from "./assets/dataSet.js";
import { truncate } from "./assets/truncateBS.js";
import { keyCodes } from "./assets/keyCodes.js";

const imageMenu = document.querySelector("#menu");
const previewImage = document.querySelector("#preview img");
const previewCaption = document.querySelector("#preview figcaption");

// pointer to currently previwed image
let imagePointer = -1;

// Switches from 'prevID' to 'currID'
const switchImage = function (prevID, currID) {
  if (prevID !== -1) {
    const prevFigure = document.querySelector(`#img${prevID}`);
    prevFigure.classList.remove("highlight");
  }

  const currFigure = document.querySelector(`#img${currID}`);
  currFigure.classList.add("highlight");

  previewImage.setAttribute("src", imageContainer[currID]["previewImage"]);
  previewImage.setAttribute("alt", imageContainer[currID]["description"]);
  previewImage.setAttribute("title", imageContainer[currID]["description"]);

  previewCaption.innerText = imageContainer[currID]["title"];

  imagePointer = currID;
};

// Add event listener for 'click' event and 'enter' event
const switchEventListener = function (imageID) {
  const container = document.querySelector(`#img${imageID}`);
  container.addEventListener("click", () => switchImage(imagePointer, imageID));
  container.addEventListener("keypress", () => {
    if (event.keyCode === keyCodes.enter) {
      switchImage(imagePointer, imageID);
    }
  });
};

// Creates a new figure element with img and figcaption in it.
const newElement = function (imageID) {
  const container = document.createElement("figure");
  container.tabIndex = 0;
  container.classList.add("img");
  container.setAttribute("id", `img${imageID}`);

  const imgChild = document.createElement("img");
  imgChild.setAttribute("src", imageContainer[imageID]["previewImage"]);
  imgChild.setAttribute("alt", imageContainer[imageID]["description"]);
  imgChild.setAttribute("title", imageContainer[imageID]["description"]);
  container.appendChild(imgChild);

  const figCapChild = document.createElement("figcaption");
  figCapChild.textContent = imageContainer[imageID]["title"];
  container.appendChild(figCapChild);

  return container;
};

// Initializes thumbnails of every image
for (let imageID = 0; imageID < imageContainer.length; imageID++) {
  imageMenu.appendChild(newElement(imageID));
  switchEventListener(imageID);
}

// Set first image as the initial one
switchImage(-1, 0);

// Increment or decrement imagePointer based on key Press
const upDownEvent = function (e) {
  e = e || window.event; // Old browsers support
  let newImagePointer = imagePointer;
  if (e.keyCode === keyCodes.upArrow) {
    e.preventDefault();
    newImagePointer = Math.max(0, newImagePointer - 1);
  } else if (e.keyCode === keyCodes.downArrow) {
    e.preventDefault();
    newImagePointer = Math.min(imageContainer.length - 1, newImagePointer + 1);
  }
  switchImage(imagePointer, newImagePointer);
};

document.onkeydown = upDownEvent;

// Truncate text and set it's role as image heading
const setText = function () {
  const thumbnails = document.querySelectorAll(".img");
  thumbnails.forEach((item, Index) => {
    truncate(item.querySelector("figcaption"), imageContainer[Index]["title"]);
    item.querySelector("figcaption").setAttribute("role", "heading");
    item.querySelector("figcaption").setAttribute("aria-level", "2");
  });
};

document.fonts.ready.then(() => setText());
document.addEventListener("DOMContentLoaded", setText);

// Reset title on window resize
window.addEventListener("resize", setText);

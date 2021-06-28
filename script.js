import { imageData } from "./assets/dataSet.js";
import { truncate } from "./assets/truncateBS.js";
import { keyCodes } from "./assets/keyCodes.js";

const imageMenu = document.querySelector("#menu");
const previewImage = document.querySelector("#preview img");
const previewCaption = document.querySelector("#preview figcaption");

// pointer to current the image
let imagePtr = -1;

// remove highlights
const removeImage = function (imageID) {
  const container = document.querySelector(`#img${imageID}`);
  container.setAttribute("aria-selected", "false");
  container.classList.remove("highlight");
};

// add highlights and change image
const addImage = function (imageID, setFocus) {
  const container = document.querySelector(`#img${imageID}`);
  container.setAttribute("aria-selected", "true");
  container.classList.add("highlight");

  previewImage.setAttribute("src", imageData[imageID]["previewImage"]);
  previewImage.setAttribute("alt", imageData[imageID]["description"]);
  previewImage.setAttribute("title", imageData[imageID]["description"]);

  previewCaption.innerText = imageData[imageID]["title"];

  if (setFocus) {
    container.focus();
  }

  imagePtr = imageID;
};

// switch from 'prevID' to 'currID'
const switchImage = function (prevID, currID) {
  if (prevID !== -1) {
    removeImage(prevID);
  }
  addImage(currID, prevID !== -1);
};

// - Up: decrement by one
// - Down: increment by one
// - Left: switch on the first image
// - Right: switch on the last image
// - Number press: move to appropriate image, if exists

const keyDownHandler = function (e) {
  e = e || window.event;
  const code = e.keyCode;

  switch (true) {
    case code === keyCodes.up:
      e.preventDefault();
      switchImage(
        imagePtr,
        (imagePtr - 1 + imageData.length) % imageData.length
      );
      break;
    case code === keyCodes.down:
      e.preventDefault();
      switchImage(imagePtr, (imagePtr + 1) % imageData.length);
      break;
    case code === keyCodes.left:
      e.preventDefault();
      switchImage(imagePtr, 0);
      break;
    case code === keyCodes.right:
      e.preventDefault();
      switchImage(imagePtr, imageData.length - 1);
      break;
    case code - 49 >= 0 && code - 49 < imageData.length:
      e.preventDefault();
      switchImage(imagePtr, code - 49);
      break;
    default:
  }
};

// creates a new thumbnail element and set attributes
const newElement = function (imageID) {
  const container = document.createElement("button");
  container.setAttribute(
    "aria-label",
    `Image Title: ${imageData[imageID]["description"]}, and Image File Name: ${imageData[imageID]["title"]}`
  );
  container.setAttribute("role", "tab");
  container.setAttribute("aria-selected", "false");
  container.setAttribute("id", `img${imageID}`);
  container.classList.add("img");
  container.addEventListener("click", () => switchImage(imagePtr, imageID));

  const imgChild = document.createElement("img");
  imgChild.setAttribute("aria-hidden", "true");
  imgChild.setAttribute("src", imageData[imageID]["previewImage"]);
  imgChild.setAttribute("alt", imageData[imageID]["description"]);
  imgChild.setAttribute("title", imageData[imageID]["description"]);
  container.appendChild(imgChild);

  const figCapChild = document.createElement("figcaption");
  figCapChild.setAttribute("aria-hidden", "true");
  figCapChild.setAttribute("aria-label", imageData[imageID]["title"]);
  figCapChild.textContent = imageData[imageID]["title"];
  container.appendChild(figCapChild);

  return container;
};

// truncate text
const setText = function () {
  console.log("Here");
  document.querySelectorAll(".img").forEach((item, Index) => {
    truncate(item.querySelector("figcaption"), imageData[Index]["title"]);
  });
};

// initialize thumbnails of every image
for (let imageID = 0; imageID < imageData.length; imageID++) {
  imageMenu.appendChild(newElement(imageID));
}

document.onkeydown = keyDownHandler;

// initial view
switchImage(-1, 0);

document.fonts.ready.then(() => setText());
document.addEventListener("DOMContentLoaded", setText);
window.addEventListener("resize", setText);

// Truncation using Binary Search

const truncate = function (item, title) {
  item.ariaLabel = title;
  item.textContent = title;

  // Check if we can fit the entire content without truncation
  if (item.scrollWidth <= item.clientWidth) {
    return;
  }

  let low = 0;
  let high = title.length;
  let answer = "...";

  while (low <= high) {
    let mid = Math.floor((low + high) / 2);
    let lLength = Math.ceil(mid / 2.0);
    let rlength = Math.floor(mid / 2.0);
    item.textContent =
      title.substr(0, lLength) +
      "..." +
      title.substr(title.length - rlength, rlength);

    if (item.scrollWidth <= item.clientWidth) {
      answer = item.textContent;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  item.textContent = answer;
};

export { truncate };

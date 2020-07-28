function bookmark(e) {
  e.classList.toggle('fas');
  var word = e.parentElement.childNodes[0].nodeValue;
  var meaning = e.parentElement.nextElementSibling.textContent;
  chrome.storage.sync.get('bookmarkedWords', function(bookmarked){
  var newBookmarkedWords = [];
  if(bookmarked.bookmarkedWords){
  newBookmarkedWords = bookmarked.bookmarkedWords; }
  var newWord = {
      "Word": word,
      "Meaning": meaning,
      "Language": "English", "Video_Title": "Could be anything",
      "Caption": "Some subtitle text containing prodigy",
      "Date": "2020-07-27 13:43:00", };
  if(newWord){
    newBookmarkedWords.push(newWord);
  }
  chrome.storage.sync.set({'bookmarkedWords', newBookmarkedWords});
  });
  e.classList.toggle('far');
}
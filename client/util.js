'use strict';


function xhrGet(url, onGot) {
  var request = new XMLHttpRequest();
  request.open('GET', url, true);

  request.onreadystatechange = function() {
    if (this.readyState === 4) {
      if (this.status >= 200 && this.status < 400) {
        // Success!
        onGot(undefined, this.responseText);
      } else {
        // Error :(
        onGot(this, this.responseText)
      }
    }
  };

  request.send();
  request = null;
}

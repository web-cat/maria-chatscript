document.addEventListener("DOMContentLoaded", function(event) {

    var isOpen = true;

    document.getElementById("hamburger").onclick = function (event) {
      if(!isOpen) {
        isOpen = true;
        document.getElementById("header").style.width = "250px";
        document.getElementById("content").style.marginLeft = "250px";
      } else {
        isOpen = false
        document.getElementById("header").style.width = "0px";
        document.getElementById("content").style.marginLeft = "0px";
      }
    };

    var modal = document.getElementById('myModal');

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];
    var span1 = document.getElementsByClassName("explainTA")[0];
    // When the user clicks the button, open the modal
    var explainSpans = document.getElementsByClassName("explainTA");
    for(i = 0; i < explainSpans.length; i++) {
     explainSpans[i].addEventListener('click', showPopup, false);
   }

   function showPopup () {
 		var userText = this.previousSibling.value;
 		xmlhttp.open("GET", "http://localhost/chatbot/chatbot.php?action=request&message="+userText, true);
 		xmlhttp.send();
 		xmlhttp.onreadystatechange = function() {
 							if (this.readyState == 4 && this.status == 200) {
 									var data = JSON.parse(this.responseText);
 									modal.style.display = "block";
 									document.getElementById("modal-text").innerHTML = data.response;
 							}
 					};
 	}
    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});

window.addEventListener("resize", function () {
    var element = document.getElementsByClassName('is-visible');
    for(var i=0; i < element.length; i++) {

      if(element[i].id === "coding-moreInfo") {
        var firstRow = document.getElementById('firstRow');
        var panel = document.getElementById('testingPanel');
        if(window.innerWidth <= 990) {
          firstRow.insertBefore(element[i], panel);
        } else {
          firstRow.insertBefore(element[i], panel.nextSibling);
        }
      }
      if(element[i].id === "behavior-moreInfo-2") {

      }
    }
});


// Listen for click events
document.addEventListener('click', function (event) {
  // Make sure clicked element is our toggle
	if (event.target.classList.contains('seeMoreLink')) {

	// Prevent default link behavior
	event.preventDefault();

	// Get the content
	var content = document.querySelector(event.target.hash);
	if (!content) return;
  // Toggle the content
  if(!content.classList.contains('is-visible'))
    toggle(content);
  }

}, false);

// Show an element
var show = function (elem) {

	// Get the natural height of the element
	var getHeight = function () {
		elem.style.display = 'block'; // Make it visible
		var height = elem.scrollHeight + 'px'; // Get it's height
		elem.style.display = ''; //  Hide it again
		return height;
	};

  if(elem.id === "coding-moreInfo") {
    var firstRow = document.getElementById('firstRow');
    var panel = document.getElementById('testingPanel');
    if(window.innerWidth <= 990) {
      firstRow.insertBefore(elem, panel);
    } else {
      firstRow.insertBefore(elem, panel.nextSibling);
    }
  }

  if(elem.id === "behavior-moreInfo") {
    if(window.innerWidth > 990) {
       elem = document.getElementById('behavior-moreInfo-2');
    }
  }
	var height = getHeight(); // Get the natural height
	elem.classList.add('is-visible'); // Make the element visible
	elem.style.height = height; // Update the max-height

	// Once the transition is complete, remove the inline max-height so the content can scale responsively
	window.setTimeout(function () {
		elem.style.height = '';
	}, 750);

  var element;
  if (document.getElementById('coding-moreInfo').classList.contains('is-visible'))
    element = document.getElementsByClassName('codingarrow');
  else if (document.getElementById('testing-moreInfo').classList.contains('is-visible'))
    element = document.getElementsByClassName('testingarrow');
  else if (document.getElementById('behavior-moreInfo').classList.contains('is-visible'))
    element = document.getElementsByClassName('behaviorarrow');
    else if (document.getElementById('behavior-moreInfo-2').classList.contains('is-visible'))
      element = document.getElementsByClassName('behaviorarrow');
  else if (document.getElementById('style-moreInfo').classList.contains('is-visible'))
    element = document.getElementsByClassName('stylearrow');
  for(var i = 0 ; i < element.length; i++) {
      element[i].classList.add('is-visible');
  }
};

// Hide an element
var hide = function () {
  var element;
  var arrow;

  if (document.getElementById('coding-moreInfo').classList.contains('is-visible')) {
    element = document.getElementById('coding-moreInfo');
    arrow = document.getElementsByClassName('codingarrow');
  }
  else if (document.getElementById('testing-moreInfo').classList.contains('is-visible')) {
    element = document.getElementById('testing-moreInfo');
    arrow = document.getElementsByClassName('testingarrow');
  }
  else if (document.getElementById('behavior-moreInfo').classList.contains('is-visible')) {
    element = document.getElementById('behavior-moreInfo');
    arrow = document.getElementsByClassName('behaviorarrow');
  }
  else if (document.getElementById('behavior-moreInfo-2').classList.contains('is-visible')) {
    element = document.getElementById('behavior-moreInfo-2');
    arrow = document.getElementsByClassName('behaviorarrow');
  }
  else if (document.getElementById('style-moreInfo').classList.contains('is-visible')) {
    element = document.getElementById('style-moreInfo');
    arrow = document.getElementsByClassName('stylearrow');
  }

    element.classList.remove('is-visible');
    arrow[0].classList.remove('is-visible');
    arrow[1].classList.remove('is-visible');
};

// Toggle element visibility
var toggle = function (elem, timing) {
	hide();
	// Otherwise, show it
	show(elem);
};

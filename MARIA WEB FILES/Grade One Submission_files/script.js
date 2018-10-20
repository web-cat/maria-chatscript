document.addEventListener("DOMContentLoaded", function (event) {
    // Your code to run since DOM is loaded and ready
    var isOpen = true;

    document.getElementById("hamburger").onclick = function (event) {
        if (!isOpen) {
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

    //Attaching event handler to the click event for explain links for individual errors
    var explainLinks = document.getElementsByClassName("explainError");
    for (var i = 0; i < explainLinks.length; i++) {
        explainLinks[i].addEventListener('click', showPopup.bind(explainLinks[i]), false);
    }

    //Event handler for the click event on explain links which will display the popup
    function showPopup(event) {
        event.preventDefault();

        var userText = this.getAttribute('href');
        var user = document.getElementById("userName").value;
        console.log(userText);
        xmlhttp.open("GET", "http://localhost/chatbot/chatbot.php?action=request&user=" + user + "&message=" + userText, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = JSON.parse(this.responseText);
                modal.style.display = "block";
                document.getElementById("modal-text").innerHTML = data.response;
            }
        };
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.getElementById("closePopup").onclick = function () {
        modal.style.display = "none";
    }

    //Attaching eventhandler for click event on show more links
    var showMoreLinks = document.getElementsByClassName('seeMoreLink');

    for (var i = 0; i < showMoreLinks.length; i++) {
        showMoreLinks[i].addEventListener('click', showMoreListener.bind(showMoreLinks[i]), false);
    }

    //Event handler for click event on show more links
    function showMoreListener(event) {
        var content = document.querySelector(event.target.hash);
        if (!content) return;

        var element;
        if (content.id == "codingPanel") {
            element = document.getElementById("coding-moreInfo");
        } else if (content.id == "testingPanel") {
            element = document.getElementById("testing-moreInfo");
        } else if (content.id == "behaviorPanel") {
            element = document.getElementById("behavior-moreInfo");
        } else if (content.id == "stylePanel") {
            element = document.getElementById("style-moreInfo");
        }
        // Toggle the content
        if (!element.classList.contains('is-visible')) {
            toggle(element, content);
        } else {
            event.preventDefault();
        }
    }
});

// Show the expanded section for the clicked show more link
var show = function (elem, parentElement) {

    // Get the natural height of the element
    var getHeight = function () {
        elem.style.display = 'block'; // Make it visible
        var height = elem.scrollHeight + 'px'; // Get it's height
        elem.style.display = ''; //  Hide it again
        return height;
    };

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
    else if (document.getElementById('style-moreInfo').classList.contains('is-visible'))
        element = document.getElementsByClassName('stylearrow');

    for (var i = 0; i < element.length; i++) {
        element[i].classList.add('is-visible');
    }
};

// Hide the previously the expanded section
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
    else if (document.getElementById('style-moreInfo').classList.contains('is-visible')) {
        element = document.getElementById('style-moreInfo');
        arrow = document.getElementsByClassName('stylearrow');
    }

    element.classList.remove('is-visible');
    arrow[0].classList.remove('is-visible');
    arrow[1].classList.remove('is-visible');
};

// Toggle element visibility
var toggle = function (elem, parentElement) {
    hide();
    // Otherwise, show it
    show(elem, parentElement);
};

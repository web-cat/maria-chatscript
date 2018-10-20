var open = false;
var heightChecked = false;
var initHeight = 0;
var intval = null;

var SavedResponse = function(responseText) {
    this.prototype = {handleEvent: function (event) {
            modal.style.display = "block";
            document.getElementById("modal-text").innerHTML = data.response;
        }};
    this.responseText = responseText;
}

// document.addEventListener("DOMContentLoaded", function(event) {
window.onload = function () {
    if (window.XMLHttpRequest) {
        // code for modern browsers
        xmlhttp = new XMLHttpRequest();
    } else {
        // code for old IE browsers
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }

    SDK.applicationId = "8925636537148255758";
    var sdk = new SDKConnection();
    var web = new WebAvatar();
    web.connection = sdk;
    web.avatar = "14013806";
    web.voice = "cmu-slt";
    web.voiceMod = "default";
    web.width = "150";
    web.height = "200";
    web.createBox();
    web.addMessage("", "", "", "");
    web.processMessages();

    var modal = document.getElementById('myModal');

    var elem = document.getElementsByClassName('chat')[0];
    initHeight = elem.offsetHeight;
    heightChecked = true;
    elem.style.height = '0';

    function slideToggle() {
        window.clearInterval(intval);
        var mdiv = document.getElementsByClassName('chat')[0];
        if (!heightChecked) {
            initHeight = mdiv.offsetHeight;
            heightChecked = true;
        }
        if (open) {
            var h = initHeight;
            open = false;
            intval = setInterval(function () {
                    h--;
                    mdiv.style.height = h + 'px';
                    if (h <= 0)
                        window.clearInterval(intval);
                }, 0.5
            );
        }
        else {
            var h = 0;
            open = true;
            intval = setInterval(function () {
                    h++;
                    mdiv.style.height = h + 'px';
                    if (h >= initHeight)
                        window.clearInterval(intval);
                }, 0.5
            );
        }
    }

    var askChatbot  = function(userText) {
        var oldChoices = document.getElementById('choices');
        if (oldChoices != null){
            oldChoices.remove();
        }
        var user = document.getElementById("userName").value;
        document.getElementById("chat-history").innerHTML += "<div class='chat-bubble chat-message-sent clearfix'>" + userText + "</div>";
        document.getElementById("chatbox-input").value = "";
        xmlhttp.open("GET", "http://localhost/chatbot/chatbot.php?action=request&user=" + user + "&message=" + userText, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // document.getElementById("txtHint").innerHTML = this.responseText;
                console.log(JSON.parse(this.responseText));
                var data = JSON.parse(this.responseText);

                var answer = document.createElement('div');
                answer.innerHTML += data.response;
                var choices = answer.querySelectorAll('ul#choices li');
                choices.forEach(function (choice) {
                    choice.addEventListener('click', function () {
                        var userText = choice.innerHTML;
                        askChatbot(userText);
                    });
                });
                var newChoices = answer.querySelector('#choices');
                if (newChoices != null) {
                    newChoices.remove();
                }

                var feedback = answer.querySelector('.feedback');
                if (feedback != null) {
                    feedback.remove();
                    feedback.className += ' chat-bubble chat-message-rcvd clearfix';
                }

                answer.className = 'chat-bubble chat-message-rcvd clearfix';

                if(answer.firstElementChild) {
                    //answer.innerHTML = "Click <a class='explainPopup' href='" + userText + "'> here</a> to know the answer."
                    answer.innerHTML = "<span style='cursor:pointer; color:blue;text-decoration:underline;'>Click here to know the answer.</span>";

                    answer.addEventListener('click', function() {
                        modal.style.display = "block";
                        document.getElementById("modal-text").innerHTML = data.response;
                    });
                }

                console.log(answer.innerHTML.length);

                if (answer.innerHTML.length > 0) {
                    document.getElementById('chat-history').appendChild(answer);
                }

                if (feedback != null) {
                    document.getElementById('chat-history').appendChild(feedback);
                }

                if (newChoices != null) {
                    document.getElementById('chat-history').appendChild(newChoices);
                }

                web.addMessage(answer.innerHTML, "", "", "");
                web.processMessages();
            }
            var chatHistory = document.getElementById("chat-history");
            chatHistory.scrollTop = chatHistory.scrollHeight - chatHistory.clientHeight;
        };
    };

    // Add onClick functions to initial question suggestions.
    var startingChoices = document.getElementById('choices');
    var choices = startingChoices.querySelectorAll('ul#choices li');
    console.log(choices);
    choices.forEach(function (choice) {
        console.log(choice);
        choice.addEventListener('click', function () {
            var userText = choice.innerHTML;
            askChatbot(userText);
        });
    });

    document.getElementById("chatForm").onsubmit = function (e) {
        e.preventDefault();
        var userText = document.getElementById("chatbox-input").value;
        askChatbot(userText);
    };

    document.getElementById('chat-header').onclick = function () {
        slideToggle();
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    document.querySelector("#chat-history").addEventListener('click', function (event) {
        if (event.target.classList.contains('explainPopup')) {
            event.preventDefault();
            var userText = event.target.getAttribute('href');
            var user = document.getElementById("userName").value;
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
    });
};

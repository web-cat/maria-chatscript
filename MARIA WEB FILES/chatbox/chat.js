//===========================================================================
//TODO: This URL needs to be pointed to the correct location of the PHP file.
//===========================================================================
var PHP_FILE_PATH = "http://localhost/chatbot.php";

var open = false;
var heightChecked = false;
var initHeight = 0;
var intval = null;
var firstChatOpen = true;

var SavedResponse = function(responseText) {
    this.prototype = {handleEvent: function (event) {
            modal.style.display = "block";
            document.getElementById("modal-text").innerHTML = data.response;
        }};
    this.responseText = responseText;
};

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

    // Setup the bot. Send log info and signal the bot that the page has loaded.
    sendUserInfoToChatbot();

    // Add onClick functions to initial question suggestions.
    var startingChoices = document.getElementById('choices');
    var choices = startingChoices.querySelectorAll('ul#choices li');
    choices.forEach(function (choice) {
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

        if (firstChatOpen) {
            chatWithBot('getfirstresponse');
        }

        firstChatOpen = false;
    };

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    };

    // Set up explain links.
    document.querySelector("#chat-history").addEventListener('click', function (event) {
        if (event.target.classList.contains('explainPopup')) {
            event.preventDefault();
            var userText = event.target.getAttribute('href');

            xmlhttp.open("GET", PHP_FILE_PATH + "?action=request&user=" + getUser() + "__explain&message=" + userText, true);
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

    /**
     * Send the bot the message and updates the chat window by adding the user's message and showing the bot's
     * response.
     *
     * @param userText The text sent in by the user.
     */
    function askChatbot(userText) {
        var oldChoices = document.getElementById('choices');
        if (oldChoices != null){
            oldChoices.remove();
        }
        document.getElementById("chat-history").innerHTML += "<div class='chat-bubble chat-message-sent clearfix'>" + userText + "</div>";
        document.getElementById("chatbox-input").value = "";

        chatWithBot(userText)
    }

    /**
     * Gets the name of the current user that should be sent to the bot. Format: <user>__<assignment>
     *
     * @returns {string} The current user that should be sent to the bot.
     */
    function getUser() {
        var userName = document.getElementById("userName").value;
        var assignmentId = document.getElementById("assignmentId").value;

        return userName + "__" + assignmentId;
    }

    /**
     * Send a message to the bot and ignore the response. This should be used to signal the bot of certain events
     * like page load and users opening the chat window.
     *
     * @param message The message to send to the bot.
     */
    function signalBot(message) {
        xmlhttp.open("GET", PHP_FILE_PATH + "?action=request&user=" + getUser() +
            "&message=" + message, true);
        xmlhttp.send();
    }

    /**
     * Send a message to the bot and process the response. This should be used to chat with the bot. The responses will
     * be added to the chat window.
     *
     * @param message The message to send to the bot.
     */
    function chatWithBot(message) {
        xmlhttp.open("GET", PHP_FILE_PATH + "?action=request&user=" + getUser() +
            "&message=" + message, true);
        xmlhttp.send();
        xmlhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // document.getElementById("txtHint").innerHTML = this.responseText;
                console.log(this.responseText);
                var data = JSON.parse(this.responseText);

                var answer = document.createElement('div');
                answer.innerHTML += data.response;
                var title = answer.querySelector('#title');

                if (title != null) {
                    title.remove();
                    document.getElementById('modal-title-text').innerHTML = title.innerHTML;
                }

                else {
                    document.getElementById('modal-title-text').innerHTML = "Here's What I Found";
                }


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

                    answer.innerHTML = "<span style='cursor:pointer;'>Let me see what I can find....</span>";

                    answer.addEventListener('click', function() {
                        modal.style.display = "block";
                        document.getElementById("modal-text").innerHTML = data.response;
                    });

                    modal.style.display = "block";
                    document.getElementById("modal-text").innerHTML = data.response;
                }

                console.log('"' + answer.innerHTML + '"');

                if (!(/^\s*$/.test(answer.innerHTML))) {
                    console.log('hi')
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
    }

    /**
     * Sends information about the user to the chatbot so that it can be recorded in the logs. This should be called
     * on page load.
     */
    function sendUserInfoToChatbot() {
        // TODO: Need these fields from the HTML.
        var userName = document.getElementById("userName").value;
        var userFirstName = document.getElementById("userFirstName").value;
        var userLastName = document.getElementById("userLastName").value;
        var assignmentId = document.getElementById("assignmentId").value;
        var assignmentName = document.getElementById("assignmentName").value;
        var submissionNumber = document.getElementById("submissionNumber").value;

        var message = "setchatvars user_name is " + userName + " and user_first_name is " +
            userFirstName + " and user_last_name is " + userLastName + " and assignment_id is " + assignmentId +
            " and assignment_name is " + assignmentName + " and submission_number is " + submissionNumber;

        signalBot(message);
    }

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
};

//DOM setup (Existing Elements)
const appContainer = document.getElementById("appContainer");
const mainScreen = document.getElementById("mainScreen");
const loginUsername = document.getElementById("usernameText");
const loginPassword = document.getElementById("passwordText");
const loginBtn = document.getElementById("indexLogin");
const signUpBtn = document.getElementById("indexSign");
const createUserBtn = document.getElementById("createUserBtn");
const createUser = document.getElementById("createUser");
const createPass = document.getElementById("createPass");
const displayErrorUser = document.getElementById("displayError");
const loginNotFound = document.getElementById("loginNotFound");
const menuBar = document.getElementById("menuBar");
const desktop = document.getElementById("desktop");
const taskBar = document.getElementById("taskBar");
const clock = document.getElementById("clock");
const messageOfDay = document.getElementById("messageOfDay");
const startMenu = document.getElementById("startMenu");
const menuBarBtn = document.getElementById("menuBarMenu");
const menuBarAbout = document.getElementById("menuBarAbout");
const menuBarShutDown = document.getElementById("menuBarShutDown");
const aboutPopUp = document.getElementById("aboutPopUp");
const closeAboutBtn = document.getElementById("closeAboutBtn");
const shutdownPopUp = document.getElementById("shutdownPopUp");
const countDownShutdown = document.getElementById("countDownShutdown");
const shutdownConfirmed = document.getElementById("shutdownConfirmed");
const confirmShutdown = document.getElementById("confirmShutdown");
const cancelShutdown = document.getElementById("cancelShutdown");
const closeShutdownBtn = document.getElementById("closeShutdownBtn")
const realStartMenu = document.getElementById("realStartMenu");
const startMenuBtn = document.getElementById("startMenuBtn");
const startMenuSearch = document.getElementById("startMenuSearch");
const gifsApplication = document.getElementById("gifsApplication");
const gifsBtn = document.getElementById("gifsBtn");
const appList = document.getElementById("appList");
const closeBtn = document.querySelector(" .close");
const minimizeBtn = document.querySelector(" .minimize");
const fullscreenBtn = document.querySelector(" .fullscreen");

//DOM (injected Elements)
const loadingText = document.createElement("p");

//Variables
let userData = JSON.parse(localStorage.getItem("users")) || [];
let userFound = null;
let passwordFound = null; 
let messagesOfTheDay = [
    "Rome wasn't built in a day!", 
    "Hang in there, baby!",
    "For those who know",
    "67",
    "Have you checked behind you? Don't.",
    "Today's goal: do stuff. Nailed it.",
    "Today: yes. Maybe. We'll see.",
    "This is fine. (It is not fine.)",
    "Have you tried being someone else?",
    "Please stop. (Just kidding, continue.)"
];
let isStartMenuOpen = false;
let isAboutPopUpOpen = false;
let isShutdownMenuOpen = false;
let isRealStartMenuOpen = false;
let shutdownInstance = 0;
let apps = [];
let isGifsAppOpen = false;
let isMinimizedPartially = true;
let isMinimizedFully = false;
let isFullScreen = false;
var searchApps;
var buttonContent;
let activeWindow = null;

//sounds
const typingSound = new Audio('/sounds/keysound.mp3'); 
const notification = new Audio('/sounds/notification.mp3');

//other neccessties
const loginInformation = {
    username: "", 
    password: "",
    id: ""
};
const delay = ms => new Promise(res => setTimeout(res, ms));
const randomMessage = Math.floor(Math.random() * messagesOfTheDay.length);
const dailyMessage = messagesOfTheDay[randomMessage];
const listTag = appList.getElementsByTagName("li");

//functions
function generateId() {
    return Math.random().toString(36).substring(2, 9);
}

function checkForLoginInformation () {

    const usernameInput = loginUsername.value.toLowerCase();
    const passwordInput = loginPassword.value.toLowerCase();

    for (let i = 0; i < userData.length; i++) {
        if (
            userData[i].username === usernameInput &&
            userData[i].password === passwordInput
        ) {
            console.log(`${usernameInput} has been found!`);
            userFound = true;
            passwordFound = true;
            loginNotFound.style.display = "none";
            initLoadingScreen();
            return {
                userFound: true,
                passwordFound: true
            };
        } else {
            loginNotFound.style.display = "flex";
            loginNotFound.textContent = "Login not found; try again?";
        }
    }
}

function switchTo(screen) { 
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active')); 
    document.getElementById(screen).classList.add('active');
    console.log(`${screen} is now the active screen`);
} 

function checkPasswordRequirements () {
     const createPasswordContent = createPass.value; 
     const createUserContent = createUser.value;
    if (createPasswordContent.length < 8) {
        createPass.style.border = "var(--errorRed)";
        createPass.style.borderWidth = "0.5rem";
        displayErrorUser.style.display = "flex";
        displayErrorUser.textContent = "Password must be at LEAST 8 characters";
        console.log("Password requirements not met");
        return -1;
    } else {
       const newUser = {
            id: generateId(),
            username: createUserContent.toLowerCase(),
            password: createPasswordContent.toLowerCase()
        }   
        userData.push(newUser);
        localStorage.setItem("users", JSON.stringify(userData));
        console.log(userData);
        console.log(`Information saved: ${newUser.id}`);
        switchTo('mainScreen');
    }
}

 async function initLoadingScreen () {
    mainScreen.innerHTML = "";
    mainScreen.appendChild(loadingText);
    loadingText.style.paddingTop = "0.5rem";
    loadingText.style.paddingLeft = "1rem";
    for (let i = 0; i < 6; i++) {
        loadingText.textContent = "Loading.";
        await delay(500);
        loadingText.textContent = "Loading..";
        await delay(500);
        loadingText.textContent = "Loading...";
        await delay(500); 
    }
    switchTo('desktopScreen');
    menuBar.style.display = "flex";
    desktop.style.display = "flex";
    taskBar.style.display = "flex";
    messageOfDay.textContent = `Message of the day:"${dailyMessage}"`;
}

function updateClock() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = String(now.getMinutes()).padStart(2, '0');
        let seconds = String(now.getSeconds()).padStart(2, '0');
        clock.textContent = `${hours}:${minutes}:${seconds}`; 
    }

    function typing() {
    typingSound.play();
}

function initStartMenu () {
    isStartMenuOpen = !isStartMenuOpen;
    startMenu.style.display = isStartMenuOpen ? 'flex' : 'none';
}

function initAboutPopUp () {
    isAboutPopUpOpen = !isAboutPopUpOpen;
    aboutPopUp.style.display = 'flex';
}

function closeAboutPop () {
    isAboutPopUpOpen = !isAboutPopUpOpen;
    aboutPopUp.style.display = isAboutPopUpOpen ? 'flex' : 'none';
}

function closeShutdownPop () {
    isShutdownMenuOpen = !isShutdownMenuOpen;
    shutdownPopUp.style.display = isShutdownMenuOpen ? 'flex' : 'none';
}

 async function initShutdownPopUp () {
    isShutdownMenuOpen = !isShutdownMenuOpen;
    shutdownPopUp.style.display = isShutdownMenuOpen = 'flex';
   if (shutdownInstance >= 1) {
    console.log("failed");
   } else {
    shutdownInstance = 1;
    countDownShutdown.textContent = "60";
    await delay(1000);
    countDownShutdown.textContent = "59";
    await delay(1000);
    countDownShutdown.textContent = "58";
    await delay(1000);
    countDownShutdown.textContent = "57";
    await delay(1000);
    countDownShutdown.textContent = "56";
    await delay(1000);
    countDownShutdown.textContent = "55";
    await delay(1000);
    countDownShutdown.textContent = "54";
    await delay(1000);
    countDownShutdown.textContent = "53";
    await delay(1000);
    countDownShutdown.textContent = "52";
    await delay(1000);
    countDownShutdown.textContent = "51";
    await delay(1000);
    countDownShutdown.textContent = "50";
    await delay(1000);
    countDownShutdown.textContent = "49";
    await delay(1000);
    countDownShutdown.textContent = "48";
    await delay(1000);
    countDownShutdown.textContent = "47";
    await delay(1000);
    countDownShutdown.textContent = "46";
    await delay(1000);
    countDownShutdown.textContent = "45";
    await delay(1000);
    countDownShutdown.textContent = "44";
    await delay(1000);
    countDownShutdown.textContent = "43";
    await delay(1000);
    countDownShutdown.textContent = "42";
    await delay(1000);
    countDownShutdown.textContent = "41";
    await delay(1000);
    countDownShutdown.textContent = "40";
    await delay(1000);
    countDownShutdown.textContent = "39";
    await delay(1000);
    countDownShutdown.textContent = "38";
    await delay(1000);
    countDownShutdown.textContent = "37";
    await delay(1000);
    countDownShutdown.textContent = "36";
    await delay(1000);
    countDownShutdown.textContent = "35";
    await delay(1000);
    countDownShutdown.textContent = "34";
    await delay(1000);
    countDownShutdown.textContent = "33";
    await delay(1000);
    countDownShutdown.textContent = "32";
    await delay(1000);
    countDownShutdown.textContent = "31";
    await delay(1000);
    countDownShutdown.textContent = "30";
    await delay(1000);
    countDownShutdown.textContent = "29";
    await delay(1000);
    countDownShutdown.textContent = "28";
    await delay(1000);
    countDownShutdown.textContent = "27";
    await delay(1000);
    countDownShutdown.textContent = "26";
    await delay(1000);
    countDownShutdown.textContent = "25";
    await delay(1000);
    countDownShutdown.textContent = "24";
    await delay(1000);
    countDownShutdown.textContent = "23";
    await delay(1000);
    countDownShutdown.textContent = "22";
    await delay(1000);
    countDownShutdown.textContent = "21";
    await delay(1000);
    countDownShutdown.textContent = "20";
    await delay(1000);
    countDownShutdown.textContent = "19";
    await delay(1000);
    countDownShutdown.textContent = "18";
    await delay(1000);
    countDownShutdown.textContent = "17";
    await delay(1000);
    countDownShutdown.textContent = "16";
    await delay(1000);
    countDownShutdown.textContent = "15";
    await delay(1000);
    countDownShutdown.textContent = "14";
    await delay(1000);
    countDownShutdown.textContent = "13";
    await delay(1000);
    countDownShutdown.textContent = "12";
    await delay(1000);
    countDownShutdown.textContent = "11";
    await delay(1000);
    countDownShutdown.textContent = "10";
    await delay(1000);
    countDownShutdown.textContent = "9";
    await delay(1000);
    countDownShutdown.textContent = "8";
    await delay(1000);
    countDownShutdown.textContent = "7";
    await delay(1000);
    countDownShutdown.textContent = "6";
    await delay(1000);
    countDownShutdown.textContent = "5";
    await delay(1000);
    countDownShutdown.textContent = "4";
    await delay(1000);
    countDownShutdown.textContent = "3";
    await delay(1000);
    countDownShutdown.textContent = "2";
    await delay(1000);
    countDownShutdown.textContent = "1";
    await delay(1000);
    countDownShutdown.textContent = "0";
    await delay(1000);
    shutdownInstance = 0;
    return shutdownInstance;
   }
}

function setActiveWindow(windowId) {
    if (activeWindow) {
        document.getElementById(activeWindow)
            ?.classList.remove("active");
    }

    activeWindow = windowId;

    const current = document.getElementById(windowId);
    current?.classList.add("active");

    bringToFront(current);
}

let topZ = 10;
function bringToFront(el) {
    topZ++;
    el.style.zIndex = topZ;
}

function openStartMenu () {
    isRealStartMenuOpen = !isRealStartMenuOpen;
    realStartMenu.style.display = isRealStartMenuOpen ? 'flex' : 'none';
}

function initGifsApp () {
    isGifsAppOpen = !isGifsAppOpen;
    gifsApplication.style.display = "flex";
    setActiveWindow('gifsApplication');
    console.log(`${activeWindow} is now the active window`);
}

function closeWindow() {
    if (!activeWindow) return;
   const win = document.getElementById(activeWindow);
   if (win) {
    win.style.display = "none;"
   }
}

function whichMinimize() {
    if (!activeWindow) return;
   const win = document.getElementById(activeWindow);
}

function fullscreenWindow () {
   if (!activeWindow) return;
   const win = document.getElementById(activeWindow);
}

function searchBar () {
   const startMenuSearchValue = startMenuSearch.value.toLowerCase();
    for (let i = 0; i < listTag.length; i++) {
    searchApps = listTag[i].getElementsByTagName("button")[0];
    buttonContent = searchApps.textContent || searchApps.innerText;
    if (buttonContent.toLowerCase().indexOf(startMenuSearchValue) > -1) {
        listTag[i].style.display = "";
    } else {
        listTag[i].style.display = "none";
    }
   }
}

//event listeners
signUpBtn.addEventListener("click", () => switchTo('signUpScreen'));
createUserBtn.addEventListener("click", checkPasswordRequirements);
loginBtn.addEventListener("click", checkForLoginInformation);
loginPassword.addEventListener("input", typing);
menuBarBtn.addEventListener("click", initStartMenu);
menuBarAbout.addEventListener("click", initAboutPopUp);
closeAboutBtn.addEventListener("click", closeAboutPop);
menuBarShutDown.addEventListener("click", initShutdownPopUp);
closeShutdownBtn.addEventListener("click", closeShutdownPop);
startMenuBtn.addEventListener("click", openStartMenu);
gifsBtn.addEventListener("click", initGifsApp);
startMenuSearch.addEventListener("input", searchBar);
closeBtn.addEventListener("click", closeWindow);

//activate or call code etc.
 updateClock();
 setInterval(updateClock, 1000);
 messageOfDay.textContent = `Message of the day: ${dailyMessage}`;
 desktop.append(startMenu);
 desktop.append(aboutPopUp);
 desktop.append(shutdownConfirmed);
 desktop.append(realStartMenu);
 desktop.append(gifsApplication);
// Initialize Firebase
var config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: ""
};
firebase.initializeApp(config);

var database = firebase.database();
var authFirebase = firebase.auth();
const ref = firebase.storage().ref();
var addsRef = firebase.database().ref().child("post-ad/");
var itemsRef = firebase.database().ref().child("post-ad/");
/*------------------------------------------------------------*/

var adTitleEl = document.getElementById("ad-title");
var adPriceEl = document.getElementById("ad-price");
var adCategoryEl = document.getElementById("ad-category");
var dateSubmitEl = document.getElementById("date-submit");
var cityNameEl = document.getElementById("city-name");
var adImageEl = document.getElementById("ad-image")
var postIDs = [];
var reciverIds = [];

var adTitleItemEl = document.getElementById("ad-title-item");
var stateItemEl = document.getElementById("state-item");
var cityItemEl = document.getElementById("city-item");
var imgLinkEl = document.getElementById("img-link");
var detailsItemEl = document.getElementById("details-item");
var itemPriceEl = document.getElementById("item-price");
var categoryItemEl = document.getElementById("category-item");
var phoneItemEl = document.getElementById("phone-item");
var dateItemEl = document.getElementById("date-item");
var adIDEl = document.getElementById("ad-id");
var conditionEl = document.getElementById("condition-item");
var nameUserEl = document.getElementById("name-user");
var postIdWeb;
var postIdDb;
var LOADING_IMAGE_URL = 'https://www.google.com/images/spin-32.gif?a';
/*-----------------------------------------------------------*/


window.addEventListener('load', async e => {
    console.log("test");
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('sw.js')
            .then(function () { console.log('Service Worker Registered'); });
    }
});

firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var user = firebase.auth().currentUser;
        logoutEl = document.getElementById("logout").style.display = "inline";
        myAccEl = document.getElementById("myAcc").style.display = "none";
        RegEl = document.getElementById("reg").style.display = "none";
        userParaEl = document.getElementById("userPara");
        userParaEl.style.display = "inline";
        userParaEl.innerHTML = "Welcome: " + user.email;

        if (user != null) {

        }

    } else {
        // No user is signed in.
        logoutEl = document.getElementById("logout").style.display = "none";
        myAccEl = document.getElementById("myAcc").style.display = "block";
        RegEl = document.getElementById("reg").style.display = "block";
        userParaEl = document.getElementById("userPara");
        userParaEl.style.display = "none";
    }
});

function checkUser() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            window.location.href = 'index.html';
        } else {
            //Do nothing
        }
    });
}

function login() {
    var emailEl = document.getElementById("email").value;
    var passwordEl = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(emailEl, passwordEl).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        var data = {
            message: 'Wrong Password or Username',
            timeout: 6000
        };
        var signInSnackbarElement = document.getElementById('must-signin-snackbar');
        signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
        return false;
        console.log("Error: " + error);
    });

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            if (userParaEl.style.display = "inline") {
                window.location.href = 'index.html';
            }
        } else {
            // No user is signed in.
        }
    });

    return false;
}

function logout() {
    firebase.auth().signOut().then(function () {
        // Sign-out successful.

        location.reload();
        var testEl = document.getElementById("test");
        testEl.innerHTML = "Logged out";
    }).catch(function (error) {
        // An error happened.
    });
}


function register() {
    var emailEl = document.getElementById("emailReg").value;
    var passwordEl = document.getElementById("passwordReg").value;
    var connfirmPasswordEl = document.getElementById("confirmPasswordReg").value;
    var userNameEl = document.getElementById("userNameReg").value;
    var ajaxLoader = document.getElementById("ajax-loader");
    ajaxLoader.src = "images/ajax-loader.gif";
    var registerBtn = document.getElementById("register-brn");
    registerBtn.style.display = "none";

    if (emailEl !== "" && passwordEl !== "" && connfirmPasswordEl !== "" && userNameEl !== "") {
        var existringUserNames = [];
        var dbRef = firebase.database().ref("Users");
        dbRef.on("child_added", snap => {
            //console.log(snap.ref)
            //console.log(snap.child("UserName").val());
            var userName = snap.child("UserName").val().toLowerCase();
            //console.log("HERE");
            existringUserNames.push(userName);
        });
        var userNameEl = document.getElementById("userNameReg").value;
        console.log(userNameEl);
        setTimeout(function () {
            if (existringUserNames.includes(userNameEl.toLowerCase())) {
                console.log("NOT GOOD");
                console.log("Username already taken");
                var data = {
                    message: "Username already taken",
                    timeout: 6000
                };
                var signInSnackbarElement = document.getElementById('must-signin-snackbar');
                signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
                ajaxLoader.src = "";
                registerBtn.style.display = "block";
            }
            else {
                console.log("GOOD TO GO");
                if (passwordEl === connfirmPasswordEl) {
                    authFirebase.createUserWithEmailAndPassword(emailEl, passwordEl).then(() => {
                        var dbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid);
                        console.log(firebase.auth().currentUser.uid);
                        dbRef.set({
                            Email: emailEl,
                            UserName: userNameEl
                        });
                    }).then(() => {
                        firebase.auth().onAuthStateChanged(function (user) {
                            if (user) {
                                ajaxLoader.src = "";
                                registerBtn.style.display = "block";
                                setTimeout(function () {
                                    window.location.href = 'index.html';
                                }, 3000);
                            } else {
                                var data = {
                                    message: "An Error Occured",
                                    timeout: 6000
                                };
                                var signInSnackbarElement = document.getElementById('must-signin-snackbar');
                                signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
                            }
                        });
                    }).catch(function (error) {
                        // Handle Errors here.
                        var errorCode = error.code;
                        var errorMessage = error.message;
                        console.log("Error" + error);
                        var data = {
                            message: error,
                            timeout: 6000
                        };
                        var signInSnackbarElement = document.getElementById('must-signin-snackbar');
                        signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
                        ajaxLoader.src = "";
                        registerBtn.style.display = "block";
                        // ...
                    });

                }
            }
        }, 6000);
    }
    else {
        console.log("Password did not match");
        var data = {
            message: "Password did not match",
            timeout: 6000
        };
        var signInSnackbarElement = document.getElementById('must-signin-snackbar');
        signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
        ajaxLoader.src = "";
        registerBtn.style.display = "block";
    }
    return false;
}

function checkUserLogin() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var headH2El = document.getElementById("head-h2");
            var postAdContainerEl = document.getElementById("post-ad-container");
            headH2El.innerHTML = "Post an Ad";
            postAdContainerEl.style.display = "block";
        } else {
            var headH2El = document.getElementById("head-h2");
            var postAdContainerEl = document.getElementById("post-ad-container");
            postAdContainerEl.style.display = "none";
            headH2El.innerHTML = "Please Sign In to post an Ad";
        }
    });
}

function submitForm() {
    //get values
    var optCatEl = document.getElementById("opt-cat").value;
    var adTitleEl = document.getElementById("ad-title").value;
    var adDiscEl = document.getElementById("ad-disc").value;
    var yourName = document.getElementById("your-name").value;
    var yourMobileEl = document.getElementById("your-mobile").value;
    var yourEmailidEl = document.getElementById("your-emailid").value;
    var priceEl = document.getElementById("item-price").value;
    var cityEl = document.getElementById("opt-city").value;
    var itemConditionEl = document.getElementById("item-condition").value;

    if (optCatEl != "" && adTitleEl != "" && adDiscEl != "" && yourName != "" && yourMobileEl != "" && yourEmailidEl != "" && priceEl != "" && cityEl != "" && itemConditionEl != "") {
        saveAds(optCatEl, adTitleEl, adDiscEl, yourName, yourMobileEl, yourEmailidEl, priceEl, cityEl, itemConditionEl);
        return false;
    }
    else {
        var data = {
            message: "Please complete all information first",
            timeout: 6000
        };
        var signInSnackbarElement = document.getElementById('must-signin-snackbar');
        signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
    }

    return false;
}

//Save ads to firebase
function saveAds(optCatEl, adTitleEl, adDiscEl, yourName, yourMobileEl, yourEmailidEl, priceEl, cityEl, itemConditionEl) {
    var postBtnEl = document.getElementById("postBtn");
    var ajaxLoaderEl = document.getElementById("ajax-loader");
    postBtnEl.style.display = "none";
    ajaxLoaderEl.src = "images/ajax-loader.gif"
    var postId = Math.floor(Math.random() * 10000000000000);
    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = time + ' ' + date;
    var currentUser = firebase.auth().currentUser.email;
    var userUid = firebase.auth().currentUser.uid;
    // var adRef = firebase.database().ref("post-ad/");
    var adRef = firebase.database().ref("post-ad").child(userUid).child(postId);
    console.log(adRef);
    var newAdRef = adRef.ref.push();
    var dbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("UserName");
    var userName;
    dbRef.on("value", snap => {
        userName = snap.val();
    });
    var url;
    var files = document.getElementById('fileselect').files || document.getElementById('fileselect').dataTransfer.files;
    for (var i = 0, f; f = files[i]; i++) {
        const file = files[i];
        const name = (+new Date()) + '-' + file.name;
        const metadata = {
            contentType: file.type
        };
        const task = ref.child(name).put(files[i], metadata);
        task
            .then(snapshot => snapshot.ref.getDownloadURL())
            .then(url => {
                newAdRef.set({
                    PostId: postId,
                    User: currentUser,
                    Category: optCatEl,
                    AdTitle: adTitleEl,
                    AdDiscription: adDiscEl,
                    Condition: itemConditionEl,
                    SubmittedName: yourName,
                    SubmittedMobileNo: yourMobileEl,
                    SubmittedEmail: yourEmailidEl,
                    Price: "Rs." + priceEl,
                    City: cityEl,
                    Date: dateTime,
                    ImageLink: url,
                    UserName: userName,
                    userUid: userUid
                });
            }).then(() => {
                //Show Alert
                document.querySelector(".alert").style.display = "block";
                postBtnEl.style.display = "none";
                ajaxLoaderEl.src = ""

                //Hide alert after 3 seconds
                setTimeout(function () {
                    document.querySelector(".alert").style.display = "none";
                    window.location.href = 'index.html';
                }, 3000);
            });
    }
    return false;
}

function searchCategory() {
    var input, input2, input3, filter, ul, li, i, cat, city, h5;
    input = document.getElementById('my-category');
    input2 = document.getElementById('my-city');
    input3 = document.getElementById('my-input');
    filter = input.value.toUpperCase();
    filter2 = input2.value.toUpperCase();
    filter3 = input3.value.toUpperCase();
    ul = document.getElementById("test2");
    li = ul.getElementsByTagName('li');

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
        cat = li[i].getElementsByTagName("p")[0];
        city = li[i].getElementsByTagName("span")[2];
        h5 = li[i].getElementsByTagName("h5")[0];
        if (input.options[input.selectedIndex].innerHTML != "All" && input2.options[input2.selectedIndex].innerHTML != "All Pakistan") {
            if (cat.innerHTML.toUpperCase().indexOf(filter) > -1 && city.innerHTML.toUpperCase().indexOf(filter2) > -1 && h5.innerHTML.toUpperCase().indexOf(filter3) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
        else if (input.options[input.selectedIndex].innerHTML != "All" && input2.options[input2.selectedIndex].innerHTML != "All Pakistan") {
            if (cat.innerHTML.toUpperCase().indexOf(filter) > -1 || city.innerHTML.toUpperCase().indexOf(filter2) > -1 && h5.innerHTML.toUpperCase().indexOf(filter3) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
        else if (input.options[input.selectedIndex].innerHTML == "All" && input2.options[input2.selectedIndex].innerHTML == "All Pakistan") {
            if (cat.innerHTML.toUpperCase().indexOf(filter) > -1 || city.innerHTML.toUpperCase().indexOf(filter2) > -1 || h5.innerHTML.toUpperCase().indexOf(filter3) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
        else if (input.options[input.selectedIndex].innerHTML != "All" && input2.options[input2.selectedIndex].innerHTML == "All Pakistan") {
            if (cat.innerHTML.toUpperCase().indexOf(filter) > -1 || city.innerHTML.toUpperCase().indexOf(filter2) > -1) {
                if (h5.innerHTML.toUpperCase().indexOf(filter3) > -1) {
                    li[i].style.display = "";
                }
                else {
                    li[i].style.display = "none";
                }
            } else {
                li[i].style.display = "none";
            }
        }
        else if (input.options[input.selectedIndex].innerHTML == "All" && input2.options[input2.selectedIndex].innerHTML != "All Pakistan") {
            if (cat.innerHTML.toUpperCase().indexOf(filter) > -1 || city.innerHTML.toUpperCase().indexOf(filter2) > -1 & h5.innerHTML.toUpperCase().indexOf(filter3) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
        else {
            if (cat.innerHTML.toUpperCase().indexOf(filter) > -1 || city.innerHTML.toUpperCase().indexOf(filter2) > -1 & h5.innerHTML.toUpperCase().indexOf(filter3) > -1) {
                li[i].style.display = "";
            } else {
                li[i].style.display = "none";
            }
        }
    }
}

function gotoCategories() {
    var locationEl = document.getElementById("location").value;
    var searchBoxEl = document.getElementById("searchBox").value;
    window.location.href = "categories.html?all#" + locationEl + "&" + searchBoxEl;
    return false;
}

function showAds() {
    var ajaxLoader = document.getElementById("ajax-loader");
    var test2El = document.getElementById("test2");
    var url = window.location.href;

    var test = url.split("?")[1];
    if (test == "Electronics%20&%20Appliances") {
        test = "Electronics & Appliances";
    }
    else if (test == "Property%20for%20Sale") {
        test = "Property for Sale"
    }
    else if (test == "Property%20for%20Rent") {
        test = "Property for Rent";
    }
    else if (test == "Business,%20Industrial%20&%20Agriculture") {
        test = "Business, Industrial & Agriculture"
    }
    else if (test == "Furniture%20&%20Home%20Decor") {
        test = "Furniture & Home Decor";
    }
    else if (test == "Books,%20Sports%20&%20Hobbies") {
        test = "Books, Sports & Hobbies";
    }
    else if (test == "Fashion%20&%20Beauty") {
        test = "Fashion & Beauty";
    }
    var myCategoryEl = document.getElementById("my-category");
    var opts = myCategoryEl.options;
    for (var opt, j = 0; opt = opts[j]; j++) {
        if (opt.value == test) {
            myCategoryEl.selectedIndex = j;
            break;
        }
    }

    var myInputEl = document.getElementById("my-input");
    var search = url.split("#")[1].split("&")[1];
    console.log(search);
    myInputEl.value = search;

    var locationEl = url.split("#")[1].split("&")[0];
    if (locationEl == "Mirpur%20Khas")
        locationEl = "Mirpur Khas";
    else if (locationEl == "Tando%20Adam")
        locationEl = "Tando Adam";
    else if (locationEl == "Ahmadpur%20East")
        locationEl = "Ahmadpur East";
    else if (locationEl == "Chishtian%20Mandi")
        locationEl = "Chishtian Mandi";
    else if (locationEl == "Dera%20Ghazi%20Khan")
        locationEl = "Dera Ghazi Khan";
    else if (locationEl == "Gujar%20Khan")
        locationEl = "Gujar Khan";
    else if (locationEl == "Hasan%20Abdal")
        locationEl = "Hasan Abdal";
    else if (locationEl == "Haveli%20lakha")
        locationEl = "Haveli lakha";
    else if (locationEl == "Jhang%20Sadar")
        locationEl = "Jhang Sadar";
    else if (locationEl == "Kot%20Addu")
        locationEl = "Kot Addu";
    else if (locationEl == "Mandi%20Bahauddin")
        locationEl = "Mandi Bahauddin";
    else if (locationEl == "Mian%20Chunnu")
        locationEl = "Mian Chunnu";
    else if (locationEl == "Pindi%20Bhattian")
        locationEl = "Pindi Bhattian";
    else if (locationEl == "Rahimyar%20Khan")
        locationEl = "Rahimyar Khan";
    else if (locationEl == "Safdar%20Abad")
        locationEl = "Safdar Abad";
    else if (locationEl == "Toba%20Tek%20singh")
        locationEl = "Toba Tek singh";
    else if (locationEl == "Darra%20Adam%20Khel")
        locationEl = "Darra Adam Khel";
    else if (locationEl == "Dera%20Ismail%20Khan")
        locationEl = "Dera%20Ismail%20Khan";
    else if (locationEl == "Upper%20Dir")
        locationEl = "Upper Dir";
    else if (locationEl == "Lakki%20Marwat")
        locationEl = "Lakki Marwat";
    var myCityEl = document.getElementById("my-city");
    var locs = myCityEl.options;
    for (var loc, j = 0; loc = locs[j]; j++) {
        if (loc.value == locationEl) {
            myCityEl.selectedIndex = j;
            break;
        }
    }

    do {
        ajaxLoader.src = "images/ajax-loader.gif";
    }
    while (test2El.innerHTML == null);
    addsRef.on('child_added', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            childSnapshot.forEach(function (snap) {
                var adTitle = snap.child("AdTitle").val();
                var adPrice = snap.child("Price").val();
                var adCategory = snap.child("Category").val();
                var dateSubmit = snap.child("Date").val();
                var cityName = snap.child("City").val();
                var adImage = snap.child("ImageLink").val();
                if (localStorage != null) {
                    localStorage.setItem("picture", adImage);
                }
                var postID = snap.child("PostId").val();
                postIDs.push(postID);
                testEl = document.getElementById("test2");
                $("#test2").append("<a href='item.html?" + postID + "' ><li><img id=ad-image' src='" +
                    localStorage.getItem("picture") + "' title='' alt='' /><section class='list-left'><h5 id='ad-title' class='title'>" +
                    adTitle + "</h5><span id='ad-price' class='adprice'>" +
                    adPrice + "</span><p id='ad-category' class='catpath'>" +
                    adCategory + "</p></section><section class='list-right'><span id='date-submit' class='date'>" +
                    dateSubmit + "</span><span id='city-name' class='cityname'>" +
                    cityName + "</span></section><div class='clearfix'></div></li></a>")
                    .ready(function () {
                        ajaxLoader.src = "";
                        var url = window.location.href;

                        var myInputEl = document.getElementById("my-input");
                        var search = url.split("#")[1].split("&")[1];
                        console.log(search);
                        myInputEl.value = search;

                        var locationEl = url.split("#")[1].split("&")[0];
                        if (locationEl == "Mirpur%20Khas")
                            locationEl = "Mirpur Khas";
                        else if (locationEl == "Tando%20Adam")
                            locationEl = "Tando Adam";
                        else if (locationEl == "Ahmadpur%20East")
                            locationEl = "Ahmadpur East";
                        else if (locationEl == "Chishtian%20Mandi")
                            locationEl = "Chishtian Mandi";
                        else if (locationEl == "Dera%20Ghazi%20Khan")
                            locationEl = "Dera Ghazi Khan";
                        else if (locationEl == "Gujar%20Khan")
                            locationEl = "Gujar Khan";
                        else if (locationEl == "Hasan%20Abdal")
                            locationEl = "Hasan Abdal";
                        else if (locationEl == "Haveli%20lakha")
                            locationEl = "Haveli lakha";
                        else if (locationEl == "Jhang%20Sadar")
                            locationEl = "Jhang Sadar";
                        else if (locationEl == "Kot%20Addu")
                            locationEl = "Kot Addu";
                        else if (locationEl == "Mandi%20Bahauddin")
                            locationEl = "Mandi Bahauddin";
                        else if (locationEl == "Mian%20Chunnu")
                            locationEl = "Mian Chunnu";
                        else if (locationEl == "Pindi%20Bhattian")
                            locationEl = "Pindi Bhattian";
                        else if (locationEl == "Rahimyar%20Khan")
                            locationEl = "Rahimyar Khan";
                        else if (locationEl == "Safdar%20Abad")
                            locationEl = "Safdar Abad";
                        else if (locationEl == "Toba%20Tek%20singh")
                            locationEl = "Toba Tek singh";
                        else if (locationEl == "Darra%20Adam%20Khel")
                            locationEl = "Darra Adam Khel";
                        else if (locationEl == "Dera%20Ismail%20Khan")
                            locationEl = "Dera%20Ismail%20Khan";
                        else if (locationEl == "Upper%20Dir")
                            locationEl = "Upper Dir";
                        else if (locationEl == "Lakki%20Marwat")
                            locationEl = "Lakki Marwat";
                        var myCityEl = document.getElementById("my-city");
                        var locs = myCityEl.options;
                        for (var loc, j = 0; loc = locs[j]; j++) {
                            if (loc.value == locationEl) {
                                myCityEl.selectedIndex = j;
                                break;
                            }
                        }

                        var test = url.split("?")[1].split("#")[0];
                        if (test == "Electronics%20&%20Appliances") {
                            test = "Electronics & Appliances";
                        }
                        else if (test == "Property%20for%20Sale") {
                            test = "Property for Sale"
                        }
                        else if (test == "Property%20for%20Rent") {
                            test = "Property for Rent";
                        }
                        else if (test == "Business,%20Industrial%20&%20Agriculture") {
                            test = "Business, Industrial & Agriculture"
                        }
                        else if (test == "Furniture%20&%20Home%20Decor") {
                            test = "Furniture & Home Decor";
                        }
                        else if (test == "Books,%20Sports%20&%20Hobbies") {
                            test = "Books, Sports & Hobbies";
                        }
                        else if (test == "Fashion%20&%20Beauty") {
                            test = "Fashion & Beauty";
                        }
                        var myCategoryEl = document.getElementById("my-category");
                        var opts = myCategoryEl.options;
                        for (var opt, j = 0; opt = opts[j]; j++) {
                            if (opt.value == test) {
                                myCategoryEl.selectedIndex = j;
                                break;
                            }
                        }
                        searchCategory();
                    });
            });
        });
    });
}

function getPostID() {
    var url = window.location.href;
    if (url.indexOf('#') > -1) {
        console.log("TEST");
        document.location.href = String(document.location.href).replace("#", "");
    }
    postIdWeb = url.split("?")[1];
    itemsRef.on("child_added", snap => {
        snap.forEach(function (snap2) {
            snap2.forEach(function (snapitem) {
                var postIdDb = snapitem.child("PostId").val();
                if (postIdDb == postIdWeb) {
                    var adTitleItem = snapitem.child("AdTitle").val();
                    var stateItem = snapitem.child("State").val();
                    var cityItem = snapitem.child("City").val();
                    var imgLink = snapitem.child("ImageLink").val();
                    var detailsItem = snapitem.child("AdDiscription").val();
                    var itemPrice = snapitem.child("Price").val();
                    var categoryItem = snapitem.child("Category").val();
                    var phoneItem = snapitem.child("SubmittedMobileNo").val();
                    var dateItem = snapitem.child("Date").val();
                    var conditionItem = snapitem.child("Condition").val();
                    var nameUser = snapitem.child("SubmittedName").val();
                    var userId = snapitem.child("User").val();
                    //
                    var adUserUid = snapitem.child("userUid").val();
                    var adUserName = snapitem.child("UserName").val();
                    console.log(adUserUid, adUserName);
                    adTitleItemEl.innerHTML = adTitleItem;
                    stateItemEl.innerHTML = stateItem;
                    cityItemEl.innerHTML = cityItem;
                    imgLinkEl.src = imgLink;
                    detailsItemEl.innerHTML = detailsItem;
                    itemPriceEl.innerHTML = itemPrice;
                    categoryItemEl.innerHTML = categoryItem;
                    phoneItemEl.append(phoneItem);
                    dateItemEl.innerHTML = "Added at " + dateItem;
                    adIDEl.innerHTML = " Ad ID: " + postIdWeb;
                    conditionEl.innerHTML = conditionItem;
                    nameUserEl.append("  " + nameUser);
                    if (localStorage !== null) {
                        console.log("Local Storage Available");
                        localStorage.setItem("AdUserUid", adUserUid);
                        localStorage.setItem("AdUserName", adUserName);
                        localStorage.setItem("UserEmail", firebase.auth().currentUser.email);
                        localStorage.setItem("AdTitle", adTitleItem);
                        localStorage.setItem("AdUserEmai", userId);
                    }
                }
                else {
                    console.log("ERROR");
                }
            });
        });
    });
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var dbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Favorites").child(postIdWeb);
            dbRef.on('value', snap => {
                if (snap.exists()) {
                    console.log("EXIST");
                    $('#fav-check').bootstrapToggle('on');
                }
                else {
                    console.log("DOES NOT EXIST");
                }
            })
        } else {
            $('#fav-check').bootstrapToggle('off');
            console.log("NOT SIGNED IN");
        }
    });
}


function gotoContact() {
    var url = window.location.href;
    postIdWeb = url.split("?")[1];
    var uidDb;
    var userRef = firebase.database().ref("post-ad");
    userRef.on("child_added", snap => {
        snap.forEach(snap2 => {
            snap2.forEach(snap3 => {
                console.log(snap3);
                console.log(snap3.child("userUid").val())
                if (snap3.child("userUid").val() == firebase.auth().currentUser.uid && snap3.child("PostId").val() == postIdWeb) {
                    console.log("MyAd");
                    uidDb = snap3.child("userUid").val()
                }
            })
        });
    });
    if (uidDb == firebase.auth().currentUser.uid) {
        console.log("STOP");
        var data = {
            message: "Can't Send Message to Your Self",
            timeout: 6000
        };
        var signInSnackbarElement = document.getElementById('must-signin-snackbar');
        signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
        return false;
    }
    else {
        window.location = "contact.html?" + postIdWeb;
    }
}

function chats() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var messaging = firebase.messaging();
            var url = window.location.href;
            var postIdWeb = url.split("?")[1];
            console.log(postIdWeb);
            var time = new Date().toLocaleTimeString();
            var adUserUid = localStorage.getItem("AdUserUid");
            var adUserName = localStorage.getItem("AdUserName");
            var userEmail = localStorage.getItem("UserEmail");
            var adTitle = localStorage.getItem("AdTitle");
            var adUserEmai = localStorage.getItem("AdUserEmai");
            var msg = document.getElementById('message').value;
            var userUID = firebase.auth().currentUser.uid;
            var time = new Date().toLocaleTimeString();
            var userName;
            var dbRef = firebase.database().ref("Users");
            var key = Math.floor(Math.random() * 1000000000);
            var myToken;

            messaging.requestPermission()
                .then(function () {
                    console.log('Notification permission granted.');
                    // console.log(messaging.getToken());
                    return messaging.getToken()
                    // allow pr token warjana catch
                }).then(function (currentToken) {
                    console.log(currentToken + "token aawegayo");
                    myToken = currentToken;
                    var dbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid);
                    dbRef.update({
                        token: currentToken,
                    })
                })
                .catch(function (err) {
                    console.log('Unable to get permission to notify.', err);
                });
            messaging.onMessage((payload) => {
                console.log('payload', payload)
            })

            dbRef.on("child_added", snap => {
                if (userUID == snap.ref.path.pieces_[1]) {
                    userName = snap.child("UserName").val();
                    console.log("AdUserUid: " + adUserUid);
                    console.log("AdUserName: " + adUserName);
                    console.log("UserUid: " + userUID);
                    console.log("UserName: " + userName);
                    console.log("Message: " + msg);
                    console.log("User Email: " + userEmail);
                    console.log("Ad Title: " + adTitle);
                    console.log("AdUserEmail: " + adUserEmai);
                    //
                    var msgRef = firebase.database().ref().child("MessagesRoom").child(userName + "," + adUserName).child(postIdWeb).child("messages");
                    var newMsgRef = msgRef.ref.push();
                    newMsgRef.set({
                        Message: msg,
                        ReciverID: adUserUid,
                        SenderID: userUID,
                        Time: time,
                        AdTitle: adTitle,
                        SenderEmail: userEmail,
                        ReciverEmail: adUserEmai,
                        key: key,
                        SenderUser: userName
                    }).then(() => {
                        var reciverToken;
                        var reciverUid;
                        var dbRef = firebase.database().ref("Users")
                        console.log(adUserName, userName);
                        if (adUserName == userName) {
                            adUserName = senderUsrename;
                            console.log("Modified: " + adUserName);
                            dbRef.on("child_added", snap => {
                                var usad = snap.child("UserName");
                                if (adUserName == usad.val()) {
                                    console.log(usad.ref.path.pieces_[1]);
                                    reciverUid = usad.ref.path.pieces_[1];
                                }
                            });
                        }
                        else {
                            dbRef.on("child_added", snap => {
                                var usad = snap.child("UserName");
                                if (adUserName == usad.val()) {
                                    console.log(usad.ref.path.pieces_[1]);
                                    reciverUid = usad.ref.path.pieces_[1];
                                }
                            });
                        }
                        console.log(reciverUid);
                        var dbRef2 = firebase.database().ref("Users").child(reciverUid);
                        console.log(dbRef2);
                        dbRef2.on("child_added", snap => {
                            reciverToken = snap.val();
                            console.log(snap.ref);
                            console.log(reciverToken);
                        });
                        console.log(reciverToken);
                        var combinedReciverId = adUserUid + "#" + adUserName + "^" + postIdWeb + "&" + userName;
                        pushnotification(reciverToken, msg, combinedReciverId);
                    }).then(messaging.onMessage((payload) => {
                        console.log('payload', payload)
                    }));
                }
            })
            displayMessage1(key, firebase.auth().currentUser.email, msg, time);
            var msg2 = document.getElementById('message');
            msg2.value = "";
            toggleButton();
            return false;
        }
        else {

        }
    })
    return false;
}

function displayMessage1(key, name, text, date, picUrl, imageUrl) {
    var div = document.getElementById(key);
    if (text == null) {
        name = firebase.auth().currentUser.email;
        text = document.getElementById("message").value;
        key = "123";
        console.log(text);
    }

    // If an element for that message does not exists yet we create it.
    if (!div) {
        var container = document.createElement('div');
        container.innerHTML = MESSAGE_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', key);
        messageListElement.appendChild(div);
    }

    if (picUrl) {
        div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
    }

    div.querySelector('.name').textContent = name + "\t" + date;
    var messageElement = div.querySelector('.message');
    //console.log(messageElement);
    if (text) { // If the message is text.
        messageElement.textContent = text;
        // Replace all line breaks by <br>.
        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    }
    else if (imageUrl) { // If the message is an image.
        var image = document.createElement('img');
        image.addEventListener('load', function () {
            messageListElement.scrollTop = messageListElement.scrollHeight;
        });
        image.src = imageUrl + '&' + new Date().getTime();
        messageElement.innerHTML = '';
        messageElement.appendChild(image);
    }
    // Show the card fading-in and scroll to view the new message.
    setTimeout(function () { div.classList.add('visible') }, 1);
    messageListElement.scrollTop = messageListElement.scrollHeight;
    messageInputElement.focus();
}

var userNameFinal0;
var userNameFinal1;

function yourChats() {
    var ajaxLoader = document.getElementById("ajax-loader");
    var dbRef = firebase.database().ref("Users");
    var myUserName;
    var reciverID;
    var adId;
    var dsa;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userUID = firebase.auth().currentUser.uid;
            var msgDbRef = firebase.database().ref().child("MessagesRoom");
            msgDbRef.on("child_added", snap => {
                var userNameCombined = snap.ref.path.pieces_[1];
                var userName = userNameCombined.split(",");
                dbRef.on("child_added", snap2 => {
                    userNameFinal0 = snap2.ref.path.pieces_;
                    userNameFinal1 = snap2.ref.path.pieces_[1];
                    if (userUID == snap2.ref.path.pieces_[1] || userUID == snap2.ref.path.pieces_[0]) {
                        myUserName = snap2.child("UserName").val();
                        if (userName[1] == myUserName || userName[0] == myUserName) {
                            snap.forEach(function (snap3) {
                                //console.log(snap3.ref);
                                adId = snap3.ref.path.pieces_[2];
                                //adId = snap3.val();
                                //console.log(snap3.ref);
                                snap3.forEach(function (snap4) {
                                    snap4.forEach(function (snap5) {
                                        reciverID = snap5.child("ReciverID").val();
                                        dsa = snap5.child("AdTitle").val();
                                    });
                                    var yourUserName;
                                    var dbUser = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("UserName");
                                    dbUser.on("value", snap => {
                                        yourUserName = snap.val();
                                    })
                                    if (userName[1] == yourUserName) {
                                        $('#cards').append("<a href='message.html?" + reciverID + "#" + userName[1] + "^" + adId + "&" + userName[0] + "'><div class='card'><img class='img-card' src='images/user2.png' alt='Avatar'><div class='container'><h4 id='user-name'><b>" +
                                            userName[0] + "</b></h4><p id='ad-title'>Ad Id: " + dsa + "</p></div><div class='clearfix'></div></a>")
                                            .ready(function () {
                                                ajaxLoader.src = "";
                                            });
                                    }
                                    else if (userName[0] == yourUserName) {
                                        $('#cards').append("<a href='message.html?" + reciverID + "#" + userName[1] + "^" + adId + "&" + userName[0] + "'><div class='card'><img class='img-card' src='images/user2.png' alt='Avatar'><div class='container'><h4 id='user-name'><b>" +
                                            userName[1] + "</b></h4><p id='ad-title'>Ad Title: " + dsa + "</p></div><div class='clearfix'></div></a>")
                                            .ready(function () {
                                                ajaxLoader.src = "";
                                            }
                                            );
                                    }
                                });
                            });
                        }
                    }
                });
            });
        }
        else {
            window.location.href = "index.html";
        }
    });
}

var messageListElement = document.getElementById('messages');
var messageFormElement = document.getElementById('message-form');
var messageInputElement = document.getElementById('message');
var submitButtonElement = document.getElementById('submit');
var imageButtonElement = document.getElementById('submitImage');
var imageFormElement = document.getElementById('image-form');
var mediaCaptureElement = document.getElementById('mediaCapture');
var userPicElement = document.getElementById('user-pic');
var userNameElement = document.getElementById('user-name');
var signInButtonElement = document.getElementById('sign-in');
var signOutButtonElement = document.getElementById('sign-out');
var signInSnackbarElement = document.getElementById('must-signin-snackbar');

var MESSAGE_TEMPLATE =
    '<div class="message-container">' +
    '<div class="spacing"><div class="pic"></div></div>' +
    '<div class="message"></div>' +
    '<div class="name"></div>' +
    '</div>';


function toggleButton() {
    if (messageInputElement.value) {
        submitButtonElement.removeAttribute('disabled');
    } else {
        submitButtonElement.setAttribute('disabled', 'true');
    }
    return false;
}


function loadMsgs() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var url = window.location.href;
            var combinedReciverId = url.split("?")[1];
            var reciverID = combinedReciverId.split("#")[0];
            var senderID = firebase.auth().currentUser.uid;
            var adUserName = combinedReciverId.split("#")[1].split("^")[0];
            var adId = combinedReciverId.split("#")[1].split("^")[1].split("&")[0];
            var userName = combinedReciverId.split("#")[1].split("^")[1].split("&")[1];
            var msgDbRef1 = firebase.database().ref().child("MessagesRoom");
            var adTitleEl = document.getElementById("ad-title");
            var userName3;

            var msgDbRef = firebase.database().ref("MessagesRoom").child(userName + "," + adUserName).child(adId).child("messages");
            msgDbRef.on("child_added", snap => {
                msgDbRef1.on("child_added", item => {
                    var userNameCombined = item.ref.path.pieces_[1];
                    console.log(userNameCombined);
                    userName3 = userNameCombined.split(",");
                    var msg = snap.child("Message").val();
                    var time = snap.child("Time").val();
                    var key = snap.child("key").val();
                    var name = snap.child("SenderUser").val();
                    var adTitle = snap.child("AdTitle").val();
                    var imageUrl = snap.child("imageUrl").val();
                    adTitleEl.innerHTML = adTitle;
                    displayMessage(key, name, msg, time, "", imageUrl);

                })
                msgDbRef1.on("child_changed", item => {
                    var userNameCombined = item.ref.path.pieces_[1];
                    userName3 = userNameCombined.split(",");
                    var msg = snap.child("Message").val();
                    var time = snap.child("Time").val();
                    var key = snap.child("key").val();
                    var name = snap.child("SenderUser").val()
                    var adTitle = snap.child("AdTitle").val();
                    var imageUrl = snap.child("imageUrl").val();
                    adTitleEl.innerHTML = adTitle;

                    displayMessage(key, name, msg, time, "", imageUrl);

                })
            });
        }
        else {
            console.log("IAM HERE");
            window.location.href = "index.html";
        }
    });
}

function chats2() {
    var url = window.location.href;
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var messaging = firebase.messaging();
            var url = window.location.href;
            var combinedReciverId = url.split("?")[1];

            var reciverID = combinedReciverId.split("#")[0];
            var senderID = firebase.auth().currentUser.uid;
            var senderUsrename = combinedReciverId.split("#")[1].split("^")[0];
            var adId = combinedReciverId.split("#")[1].split("^")[1].split("&")[0];
            var adUserName = combinedReciverId.split("#")[1].split("^")[1].split("&")[1];
            var time = new Date().toLocaleTimeString();
            var senderEmail = firebase.auth().currentUser.email;
            var msg = document.getElementById('message').value;
            var key = Math.floor(Math.random() * 1000000000);
            var msgDbRef1 = firebase.database().ref().child("MessagesRoom");
            var adTitle;
            var reciverEmail;
            var userName3;
            var myToken;

            messaging.requestPermission()
                .then(function () {
                    console.log('Notification permission granted.');
                    // console.log(messaging.getToken());
                    return messaging.getToken()
                    // allow pr token warjana catch
                }).then(function (currentToken) {
                    console.log(currentToken + "token aawegayo");
                    myToken = currentToken;
                    var dbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid);
                    dbRef.update({
                        token: currentToken,
                    })
                })
                .catch(function (err) {
                    console.log('Unable to get permission to notify.', err);
                });
            messaging.onMessage((payload) => {
                console.log('payload', payload)
            })
            console.log("ReciverID: " + reciverID);
            console.log("SenderID: " + senderID);
            console.log("AdUserName: " + adUserName);
            console.log("Ad ID: " + adId);
            console.log("user name: " + userName);
            console.log("Sender Email: " + senderEmail);
            console.log("Message: " + msg);
            console.log("test: " + senderUsrename);
            console.log("myToken: " + myToken);
            console.log("HEHREHRHEHREH" + combinedReciverId);

            var userUID = firebase.auth().currentUser.uid;
            var userName;
            var dbRef = firebase.database().ref("Users");
            dbRef.on("child_added", snap => {
                if (userUID == snap.ref.path.pieces_[1]) {
                    userName = snap.child("UserName").val();
                    console.log(userName + "," + adUserName);
                    var info = firebase.database().ref("MessagesRoom").child(adUserName + "," + senderUsrename).child(adId).child("messages");
                    info.limitToLast(1).on("child_added", snap => {
                        adTitle = snap.child("AdTitle").val();
                        reciverEmail = snap.child("ReciverEmail").val();
                        console.log("AdTitle: " + snap.child("AdTitle").val());
                        console.log("Reciever Email: " + snap.child("ReciverEmail").val());
                    });
                    console.log("HERHE: " + userName);
                    if (adUserName == userName) {

                    }
                    var oppositeMsgRef = firebase.database().ref().child("MessagesRoom").child(adUserName + "," + senderUsrename).child(adId).child("messages");
                    var newOppositeMsgRef = oppositeMsgRef.ref.push();

                    newOppositeMsgRef.set({
                        Message: msg,
                        ReciverID: reciverID,
                        SenderID: senderID,
                        Time: time,
                        AdTitle: adTitle,
                        SenderEmail: senderEmail,
                        ReciverEmail: reciverEmail,
                        key: key,
                        SenderUser: userName
                    }).then(() => {
                        var msg2 = document.getElementById('message');
                        console.log(msg2.value);
                        msg2.value = "";
                        console.log(msg2.value);
                        toggleButton();
                    }).then(() => {
                        var reciverToken;
                        var reciverUid;
                        var dbRef = firebase.database().ref("Users")
                        console.log(adUserName, userName);
                        if (adUserName == userName) {
                            adUserName = senderUsrename;
                            console.log("Modified: " + adUserName);
                            dbRef.on("child_added", snap => {
                                var usad = snap.child("UserName");
                                if (adUserName == usad.val()) {
                                    console.log(usad.ref.path.pieces_[1]);
                                    reciverUid = usad.ref.path.pieces_[1];
                                }
                            });
                        }
                        else {
                            dbRef.on("child_added", snap => {
                                var usad = snap.child("UserName");
                                if (adUserName == usad.val()) {
                                    console.log(usad.ref.path.pieces_[1]);
                                    reciverUid = usad.ref.path.pieces_[1];
                                }
                            });
                        }
                        console.log(reciverUid);
                        var dbRef2 = firebase.database().ref("Users").child(reciverUid);
                        console.log(dbRef2);
                        dbRef2.on("child_added", snap => {
                            reciverToken = snap.val();
                            console.log(snap.ref);
                            console.log(reciverToken);
                        });
                        console.log(reciverToken);
                        pushnotification(reciverToken, msg, combinedReciverId);
                    }).then(messaging.onMessage((payload) => {
                        console.log('payload', payload)
                    }));
                    //displayMessage();
                }
            });
        }
        else {
            window.location.href = "index.html";
        }
    })
    return false;
}

function displayMessage(key, name, text, date, picUrl, imageUrl) {
    var div = document.getElementById(key);
    // if (text == null) {
    //     name = firebase.auth().currentUser.email;
    //     text = document.getElementById("message").value;
    //     key = "123";
    //     console.log(text);
    // }

    // If an element for that message does not exists yet we create it.
    if (!div) {
        var container = document.createElement('div');
        container.innerHTML = MESSAGE_TEMPLATE;
        div = container.firstChild;
        div.setAttribute('id', key);
        messageListElement.appendChild(div);
    }

    if (picUrl) {
        div.querySelector('.pic').style.backgroundImage = 'url(' + picUrl + ')';
    }

    div.querySelector('.name').textContent = name + "\t" + date;
    var messageElement = div.querySelector('.message');
    //console.log(messageElement);
    if (text) { // If the message is text.
        messageElement.textContent = text;
        // Replace all line breaks by <br>.
        messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, '<br>');
    }
    else if (imageUrl) { // If the message is an image.
        var image = document.createElement('img');
        image.addEventListener('load', function () {
            messageListElement.scrollTop = messageListElement.scrollHeight;
        });
        image.src = imageUrl + '&' + new Date().getTime();
        messageElement.innerHTML = '';
        messageElement.appendChild(image);
    }
    // Show the card fading-in and scroll to view the new message.
    setTimeout(function () { div.classList.add('visible') }, 1);
    messageListElement.scrollTop = messageListElement.scrollHeight;
    messageInputElement.focus();
}

function pushnotification(token, msg, url) {
    var key = 'AAAAquNqKBA:APA91bHSIfudD5lcLkzhfle4HrvFKLHCJUJtWhntdy5iHf1X6a9dVXkudoVCqFZssTFxsB7w4y0qXm0HwIEdEfGrnugP_F_z83n5p1E_nWaNk9aKeO5BYNc7UHLvxTq89NShpXQmJHhNrrSgH3VPWwjRnASjcI2x6w';
    var to = token;
    var messaging = firebase.messaging();
    console.log(to);
    console.log("pouch gaya sir :p");

    var notification = {
        'title': 'New message',
        'body': msg,
        'click_action': "https://olx-pakistan-clone.firebaseapp.com/message.html?" + url,
    };


    fetch('https://fcm.googleapis.com/fcm/send', {
        'method': 'POST',
        'headers': {
            'Authorization': 'key=' + key,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify({
            'notification': notification,
            'to': to
        })
    }).then(function (response) {
        console.log(response);
    }).then(messaging.onMessage((payload) => {
        console.log('payload', payload)
    })).catch(function (error) {
        console.error(error);
    });
}

function saveFavs(cb) {
    var dbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Favorites");
    var newDbRef;
    var adTitleItem;
    var stateItem;
    var cityItem;
    var imgLink;
    var detailsItem;
    var itemPrice;
    var categoryItem;
    var phoneItem;
    var dateItem;
    var conditionItem;
    var nameUser;
    var userId;
    var adUserUid;
    var adUserName;
    var url = window.location.href;
    var postIdWeb = url.split("?")[1];
    if (cb.checked == true) {
        console.log("Checked");
        if (url.indexOf('#') > -1) {
            console.log("TEST");
            document.location.href = String(document.location.href).replace("#", "");
        }
        itemsRef.on("child_added", snap => {
            snap.forEach(function (snap2) {
                snap2.forEach(function (snapitem) {
                    var postIdDb = snapitem.child("PostId").val();
                    if (postIdDb == postIdWeb) {
                        adTitleItem = snapitem.child("AdTitle").val();
                        stateItem = snapitem.child("State").val();
                        cityItem = snapitem.child("City").val();
                        imgLink = snapitem.child("ImageLink").val();
                        detailsItem = snapitem.child("AdDiscription").val();
                        itemPrice = snapitem.child("Price").val();
                        categoryItem = snapitem.child("Category").val();
                        phoneItem = snapitem.child("SubmittedMobileNo").val();
                        dateItem = snapitem.child("Date").val();
                        conditionItem = snapitem.child("Condition").val();
                        nameUser = snapitem.child("SubmittedName").val();
                        userId = snapitem.child("User").val();
                        adUserUid = snapitem.child("userUid").val();
                        adUserName = snapitem.child("UserName").val();

                    }
                });
            });
        });
        console.log(adTitleItem, stateItem, cityItem, imgLink, detailsItem, itemPrice, categoryItem, phoneItem
            , dateItem, conditionItem, nameUser, userId, adUserUid, adUserName);
        /////////
        newDbRef = dbRef.ref.child(postIdWeb).set({
            AdTitle: adTitleItem,
            State: stateItem,
            City: cityItem,
            ImageLink: imgLink,
            AdDiscription: detailsItem,
            Price: itemPrice,
            Category: categoryItem,
            SubmittedMobileNo: phoneItem,
            Date: dateItem,
            Condition: conditionItem,
            SubmittedName: nameUser,
            User: userId,
            userUid: adUserUid,
            UserName: adUserName,
            PostID: postIdWeb,
        }).then(() => {
            console.log("Working");
            var currentPath = window.location.href;
            var pageResources = [
                currentPath
            ];
            // Open the unique cache for this URL
            console.log('olx-static - https://' + currentPath.split("/")[2]);
            caches.open('olx-static').then(function (cache) {
                var updateCache = cache.addAll(pageResources);
                // Update UI to indicate success
                // Or catch any errors if it doesn't succeed
                updateCache.then(function () {
                    console.log('Article is now available offline.');
                }).catch(function (error) {
                    console.log('Article could not be saved offline.' + error);
                });
            });
        });
    }
    else {
        console.log("not checked");
        console.log(postIdWeb);
        dbRef.child(postIdWeb).remove();
    }
}




function showFavs() {
    var connectionMessage = "internet connection";
    var noConnectionMessage = "No internet connection.";

    var isOnLine = navigator.onLine;

    // if (isOnLine) {
    console.log(connectionMessage);
    var ajaxLoader1 = document.getElementById("ajax-loader1");
    var test2El = document.getElementById("test2");
    console.log(test2El.innerHTML);
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var dbRef = firebase.database().ref("Users").child(firebase.auth().currentUser.uid).child("Favorites");
            dbRef.on('child_added', function (snap) {
                var adTitle = snap.child("AdTitle").val();
                var adPrice = snap.child("Price").val();
                var adCategory = snap.child("Category").val();
                var cityName = snap.child("City").val();
                var adImage = snap.child("ImageLink").val();
                if (localStorage != null) {
                    localStorage.setItem("picture", adImage);
                }
                var postID = snap.child("PostID").val();
                postIDs.push(postID);
                testEl = document.getElementById("test2");
                console.log("AdTitle " + adTitle);
                console.log("adPrice " + adPrice);
                console.log("adCategory " + adCategory);
                console.log("cityName " + cityName);
                console.log("adImage " + adImage);

                $("#test2").append("<a href='item.html?" + postID + "' ><li><img id=ad-image' src='" +
                    localStorage.getItem("picture") + "' title='' alt='' /><section class='list-left'><h5 id='ad-title' class='title'>" +
                    adTitle + "</h5><span id='ad-price' class='adprice'>" +
                    adPrice + "</span><p id='ad-category' class='catpath'>" +
                    adCategory + "</p></section><section class='list-right'><span id='date-submit' class='date'>" +
                    "</span><span id='city-name' class='cityname'>" +
                    cityName + "</span></section><div class='clearfix'></div></li></a>")
                    .ready(function () {
                        ajaxLoader1.src = "";
                    });
            });
        } else {
            // No user is signed in.
            //https://olx-pakistan-clone.firebaseio.com/.lp?start=t&ser=29272522&cb=11&v=5
        }
    });
    // } else {
    //     console.log(noConnectionMessage);
    // }


}


function myAds() {
    var ajaxLoader2 = document.getElementById("ajax-loader2");
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var dbRef = firebase.database().ref("post-ad").child(firebase.auth().currentUser.uid);
            dbRef.on("child_added", snap1 => {
                snap1.forEach(function (snap) {
                    adTitle = snap.child("AdTitle").val();
                    var adPrice = snap.child("Price").val();
                    var adCategory = snap.child("Category").val();
                    var dateSubmit = snap.child("Date").val();
                    var cityName = snap.child("City").val();
                    var adImage = snap.child("ImageLink").val();
                    if (localStorage != null) {
                        localStorage.setItem("picture", adImage);
                    }
                    var postID = snap.child("PostId").val();
                    console.log(postID);
                    postIDs.push(postID);
                    testEl = document.getElementById("test2");
                    $("#test3").append("<a href='item.html?" + postID + "' ><li><img id=ad-image' src='" +
                        localStorage.getItem("picture") + "' title='' alt='' /><section class='list-left'><h5 id='ad-title' class='title'>" +
                        adTitle + "</h5><span id='ad-price' class='adprice'>" +
                        adPrice + "</span><p id='ad-category' class='catpath'>" +
                        adCategory + "</p></section><section class='list-right'><span id='date-submit' class='date'>" +
                        "</span><span id='city-name' class='cityname'>" +
                        cityName + "</span></section><div class='clearfix'></div></li></a>"
                    ).ready(function () {
                        ajaxLoader2.src = "";
                    });
                });
            });
        } else {

        }
    });
}

function onMediaFileSelected() {
    event.preventDefault();
    var file = event.target.files[0];

    // Clear the selection in the file picker input.
    imageFormElement.reset();

    // Check if the file is an image.
    if (!file.type.match('image.*')) {
        var data = {
            message: 'You can only share images',
            timeout: 2000
        };
        signInSnackbarElement.MaterialSnackbar.showSnackbar(data);
        return;
    }
    // Check if the user is signed-in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            saveImageMessage(file);
        } else {

        }
    });

}

function eventListners() {
    // Events for image upload.
    messageFormElement.addEventListener('submit', onMessageFormSubmit);

    imageButtonElement.addEventListener('click', function (e) {
        e.preventDefault();
        mediaCaptureElement.click();
    });
    mediaCaptureElement.addEventListener('change', onMediaFileSelected);
}


function saveImageMessage(file) {
    // 1 - We add a message with a loading icon that will get updated with the shared image.
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var url = window.location.href;
            var postIdWeb = url.split("?")[1];
            var adUserName = localStorage.getItem("AdUserName");
            var adTitle = localStorage.getItem("AdTitle");
            var userName;
            var adUserUid = localStorage.getItem("AdUserUid");
            var userEmail = localStorage.getItem("UserEmail");
            var adUserEmai = localStorage.getItem("AdUserEmai");
            var time = new Date().toLocaleTimeString();
            var key = Math.floor(Math.random() * 1000000000);
            var msg = document.getElementById('message').value;
            var userUID = firebase.auth().currentUser.uid;
            var dbRef = firebase.database().ref("Users");
            dbRef.on("child_added", function (snap) {
                if (userUID == snap.ref.path.pieces_[1]) {
                    userName = snap.child("UserName").val();
                    var currentUrl = window.location.href;
                    var splitUrl = currentUrl.split("?")[0].split("/")[3];
                    var msgRef;
                    if (splitUrl == "contact.html") {
                        msgRef = firebase.database().ref().child("MessagesRoom").child(userName + "," + adUserName).child(postIdWeb).child("messages");
                    }
                    else {
                        var url1 = window.location.href;
                        var combinedReciverId = url1.split("?")[1];
                        var senderUsrename2 = combinedReciverId.split("#")[1].split("^")[0];
                        var adId = combinedReciverId.split("#")[1].split("^")[1].split("&")[0];
                        var adUserName2 = combinedReciverId.split("#")[1].split("^")[1].split("&")[1];
                        msgRef = firebase.database().ref().child("MessagesRoom").child(adUserName2 + "," + senderUsrename2).child(adId).child("messages");
                    }

                    msgRef.push({
                        AdTitle: adTitle,
                        ReciverID: adUserUid,
                        SenderID: userUID,
                        Time: time,
                        AdTitle: adTitle,
                        SenderEmail: userEmail,
                        ReciverEmail: adUserEmai,
                        key: key,
                        SenderUser: userName,
                        name: userName,
                        profilePicUrl: '/images/profile_placeholder.png'
                    }).then(function (messageRef) {
                        // 2 - Upload the image to Cloud Storage.
                        var filePath = firebase.auth().currentUser.uid + '/' + messageRef.key + '/' + file.name;
                        console.log(filePath);
                        return firebase.storage().ref(filePath).put(file).then(function (fileSnapshot) {
                            // 3 - Generate a public URL for the file.
                            return fileSnapshot.ref.getDownloadURL().then((url) => {
                                console.log("TEST");
                                var currentUrl = window.location.href;
                                var splitUrl = currentUrl.split("?")[0].split("/")[3];
                                if (splitUrl == "contact.html") {
                                    displayMessage1(key, firebase.auth().currentUser.email, null, time, '/images/profile_placeholder.png', url);
                                }
                                else {
                                    displayMessage(key, firebase.auth().currentUser.email, null, time, '/images/profile_placeholder.png', url);
                                }


                                // 4 - Update the chat message placeholder with the image's URL.
                                return messageRef.update({
                                    imageUrl: url,
                                    storageUri: fileSnapshot.metadata.fullPath
                                });
                            })
                        })
                    }).catch(function (error) {
                        console.error('There was an error uploading a file to Cloud Storage:', error);
                    });
                }
            });
        } else {
            console.log("Not Logged In");
        }
    });
}

function onMessageFormSubmit(e) {
    e.preventDefault();
    resetMaterialTextfield(messageInputElement);
    toggleButton();
}
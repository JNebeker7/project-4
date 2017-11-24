var dnd = (function () {
  // Create Sheet Form //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
  var charName = document.getElementById("CHAR");
  var playerName = document.getElementById("PLAYER");
  var classLVL = document.getElementById("LVL");
  var race = document.getElementById("RACE");
  var age = document.getElementById("AGE");
  var gender = document.getElementById("GENDER");
  var classType;
  var lvl;

  // Register form //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
  var registerUserNameInput = document.getElementById("registerUserNameInput");
  var registerEmailInput = document.getElementById("registerEmailInput");
  var registerPasswordInput = document.getElementById("registerPasswordInput");

  // Login form //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
  var loginUserNameInput = document.getElementById("loginUserNameInput");
  var loginEmailInput = document.getElementById("loginEmailInputInput");
  var loginPasswordInput = document.getElementById("loginPasswordInput");

  // stats //\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\
  var strength = 10;
  var dexterity = 10;
  var constitution = 10;
  var intellect = 10;
  var wisdom = 10;
  var charisma = 10;
  //\\////\\//\\//\\//\\//\\//\\//\\//\\//\\//\\//\\

  var setAllDefaults = function() {
    charName.value = "";
    playerName.value = "";
    classLVL.value = "";
    race.value = "";
    age.value = "";
    gender.value = "";
    strength = 10;
    dexterity = 10;
    constitution = 10;
    intellect = 10;
    wisdom = 10;
    charisma = 10;
    displayAttributes();
  }

  var resetRegisterFields = function(loggingIn) {
    if(loggingIn == true) {
      loginEmailInput.value = "";
      loginPasswordInput.value = "";
    } else {
      registerUserNameInput.value = "";
      registerEmailInput.value = "";
      registerPasswordInput.value = "";
    }
  }

  var image = document.querySelector("#portrait")
  var dwarfWarriorMale = "https://i.imgur.com/eCcSwZs.jpg";
  var dwarfRogueMale = "https://i.imgur.com/HOW433Y.jpg";
  var dwarfWizardMale = "https://i.imgur.com/HIjxnmZ.jpg";
  var dwarfWarriorF = "https://i.imgu r.com/j9YyoEt.jpg";
  var dwarfRogueF = "https://i.imgur.com/kzp8H91.jpg";
  var dwarfWizardF = "https://i.imgur.com/u98pRQA.jpg";
  var humanWarriorMale = "https://i.imgur.com/olGaHEL.jpg";
  var humanRogueMale = "https://i.imgur.com/HJcvGx1.jpg";
  var humanWizardMale = "https://i.imgur.com/B2vPgCt.jpg";
  var humanWarriorF = "https://i.imgur.com/kVIkl5F.jpg";
  var humanRogueF = "https://i.imgur.com/lfwjBFG.jpg";
  var humanWizardF = "https://i.imgur.com/svKPy6U.jpg";

  window.onclick = function(event) {
    if (event.target == sheetModal || event.target == loginModal || event.target == registerModal) {
        sheetModal.style.display = "none";
        loginModal.style.display = "none";
        registerModal.style.display = "none";
    }
}

  var displayAttributes = function() {
    document.getElementById("STR").innerHTML = strength;
    document.getElementById("DEX").innerHTML = dexterity;
    document.getElementById("CON").innerHTML = constitution;
    document.getElementById("INT").innerHTML = intellect;
    document.getElementById("WIS").innerHTML = wisdom;
    document.getElementById("CHA").innerHTML = charisma;
  }

  // calculate the stats based on class lvl and race.
  var updateAttributes = function() {
    if (classType == "warrior") {
      strength = 12;
      dexterity = 11;
      intellect = 8;
    }
    else if (classType == "rogue") {
      strength = 10;
      dexterity = 13;
      intellect = 10;
    }
    else if (classType == "wizard") {
      strength = 8;
      dexterity = 9;
      intellect = 11;
    }
    else {
      strength = 10;
      dexterity = 10;
      intellect = 10;
    }
  };

  // parse the string and set classType and lvl
  classLVL.onkeyup = function() {
    var str = classLVL.value.split(" ");
    classType = str[0];
    lvl = str[1];
    updateAttributes();
    displayAttributes();
  }

  // encode the different variables and set = to dataString
  var encodeString = function() {
    var nameEncoded = encodeURIComponent(charName.value);
    var playerEncoded = encodeURIComponent(playerName.value);
    var classEncoded = encodeURIComponent(classType);
    var lvlEncoded = encodeURIComponent(lvl);
    var raceEncoded = encodeURIComponent(race.value);
    var ageEncoded = encodeURIComponent(age.value);
    var genderEncoded = encodeURIComponent(gender.value);
    var strEncoded = encodeURIComponent(strength);
    var dexEncoded = encodeURIComponent(dexterity);
    var conEncoded = encodeURIComponent(constitution);
    var intEncoded = encodeURIComponent(intellect);
    var wisEncoded = encodeURIComponent(wisdom);
    var chaEncoded = encodeURIComponent(charisma);
    var dataString = "name=" + nameEncoded + "&player=" + playerEncoded + "&classType=" + classEncoded + "&lvl=" +
    lvlEncoded + "&race=" + raceEncoded + "&age=" + ageEncoded + "&gender=" + genderEncoded + "&str=" + strEncoded +
    "&dex=" + dexEncoded + "&con=" + conEncoded + "&int=" + intEncoded + "&wis=" + wisEncoded + "&cha=" + chaEncoded;
    return dataString;
  };

  var encodeLoginString = function(loggingIn) {
    var userNameEncoded;
    var emailEncoded = encodeURIComponent(loginEmailInput.value)
    var passwordEncoded = encodeURIComponent(loginPasswordInput.value)
    var dataString;
    if(loggingIn == true) {
      dataString = "email=" + emailEncoded + "&password=" + passwordEncoded;
      return dataString;
    } else {
      userNameEncoded = encodeURIComponent(registerUserNameInput.value)
      emailEncoded = encodeURIComponent(registerEmailInput.value)
      passwordEncoded = encodeURIComponent(registerPasswordInput.value)
      dataString = "userName=" + userNameEncoded + "&email=" + emailEncoded + "&password=" + passwordEncoded;
      return dataString;
    }
  }

  var saveButton;
  function displayData(fetchData) {
    var collection = document.getElementById("collectionSheet");
    var deleteButton = document.getElementById("deleteButton");
    collection.innerHTML = "";
    var warriorIcon = "https://i.imgur.com/uoRKhvz.png";
    var rogueIcon = "https://i.imgur.com/7Ag6uMk.png";
    var wizardIcon = "https://i.imgur.com/txtAgcq.png";
    fetchData.forEach(function (fetchData) {
      var n = fetchData['lvl'];
      var p = fetchData['player'];
      var c = fetchData['classs'];
      var characterFrame = document.createElement("div");
      characterFrame.className = "characterFrame";
      var characterInfo = document.createElement("div");
      characterInfo.className = "characterInfo";
      var img = document.createElement("img");
      img.className = "imageFrame"
      img.style.backgroundColor = "black";

      if (c == "rogue") {
        img.src = rogueIcon;
      } else if ( c == "wizard") {
        img.src = wizardIcon;
      } else {
        img.src = warriorIcon;
      }

      var charName = document.createElement("label");
      charName.className = "characterName";
      var charLvl = document.createElement("label");
      charLvl.className = "characterLvl";
      charName.innerHTML = n;
      charLvl.innerHTML = p;

      characterInfo.appendChild(charLvl);
      characterInfo.appendChild(charName)
      characterFrame.appendChild(img);
      characterFrame.appendChild(characterInfo)
      collection.appendChild(characterFrame);

      characterFrame.onclick = function() {
        getCharacterSheet(fetchData);
        saveButton = document.getElementById("saveButton");
        saveButton.onclick = function() {
          var saveId = saveValue;
          console.log("this is the 'updated' button and id = ", saveId);
          sheetModal.style.display = "none";
          updateData(saveId);
        }
      }
    })
  };

  var saveValue;
  var deleteButton = document.getElementById("deleteButton");
  var deleteValue;
  deleteButton.onclick = function() {
    confirm("Are you sure you want to delete this Character sheet?");
    sheetModal.style.display = "none";
    deleteCharacterSheet(deleteValue)
  }

  var register = document.getElementById("Register");
  var registerModal = document.getElementById("registerModal");
  register.onclick = function() {
    var loggingIn;
    registerModal.style.display = "block";
    registerSheet.style.display = "inline-block";
    var warningBox = document.getElementById("warning");
    resetRegisterFields(loggingIn = false);
    warningBox.innerHTML = "";
  }

  var registerButton = document.getElementById("registerButtonId");
  registerButton.onclick = function() {
    var warningBox = document.getElementById("warning");
    var warning = document.querySelector("p");
    sendRegisterRequest();
    warningBox.removeChild(warning);
  }

  var login = document.getElementById("Login");
  var loginModal = document.getElementById("loginModal");
  login.onclick = function() {
    var loggingIn;
    loginModal.style.display = "block";
    loginSheet.style.display = "inline-block";
    resetRegisterFields(loggingIn = true);
  }

  var loginButton = document.getElementById("authenticationButtonId");
  loginButton.onclick = function() {
    sendLoginRequest();
  }

  var create = document.getElementById("Create");
  var sheetModal = document.getElementById("sheetModal");
  create.onclick = function() {
    defaultImage = "https://i.imgur.com/HEaQXcR.jpg"
    image.src = defaultImage;
    sheetModal.style.display = "block";
    dndSheet.style.display = "inline-block";
    setAllDefaults();
    var saveSheet = document.getElementById("saveButton");
    saveSheet.onclick = function() {
      console.log("CreateSheet Button was clicked");
      updateAttributes();
      displayAttributes();
      sendData();
      var dndSheet = document.getElementById("dndSheet");
      sheetModal.style.display = "none";
    }
  };


  function getCharacterSheet(fetchData) {
    console.log(fetchData['player'] + " was clicked, id = ", fetchData['id']);
    sheetModal.style.display = "block";
    dndSheet.style.display = "inline-block";
    deleteValue = fetchData['id'];
    saveValue = fetchData['id'];
    charName.value = fetchData['name'];
    playerName.value = fetchData['player'];
    classLVL.value = fetchData['classs'] + ' ' + fetchData['lvl'];
    race.value = fetchData['race'];
    age.value = fetchData['age'];
    gender.value = fetchData['gender'];
    document.getElementById("STR").innerHTML = fetchData['strength'];
    document.getElementById("DEX").innerHTML = fetchData['dexterity'];
    document.getElementById("CON").innerHTML = fetchData['constitution'];
    document.getElementById("INT").innerHTML = fetchData['intellect'];
    document.getElementById("WIS").innerHTML = fetchData['wisdom'];
    document.getElementById("CHA").innerHTML = fetchData['charisma'];

    if (fetchData['classs'] == 'warrior' && fetchData['race'] == 'dwarf' && fetchData['gender'] == 'male') {
      image.src = dwarfWarriorMale;
    }
    if (fetchData['classs'] == 'rogue' && fetchData['race'] == 'dwarf' && fetchData['gender'] == 'male') {
      image.src = dwarfRogueMale;
    }
    if (fetchData['classs'] == 'wizard' && fetchData['race'] == 'dwarf' && fetchData['gender'] == 'male') {
      image.src = dwarfWizardMale;
    }
    if (fetchData['classs'] == 'warrior' && fetchData['race'] == 'dwarf' && fetchData['gender'] == 'female') {
      image.src = dwarfWarriorF;
    }
    if (fetchData['classs'] == 'rogue' && fetchData['race'] == 'dwarf' && fetchData['gender'] == 'female') {
      image.src = dwarfRogueF;
    }
    if (fetchData['classs'] == 'wizard' && fetchData['race'] == 'dwarf' && fetchData['gender'] == 'female') {
      image.src = dwarfWizardF;
    }
    if (fetchData['classs'] == 'warrior' && fetchData['race'] == 'human' && fetchData['gender'] == 'male') {
      image.src = humanWarriorMale;
    }
    if (fetchData['classs'] == 'rogue' && fetchData['race'] == 'human' && fetchData['gender'] == 'male') {
      image.src = humanRogueMale;
    }
    if (fetchData['classs'] == 'wizard' && fetchData['race'] == 'human' && fetchData['gender'] == 'male') {
      image.src = humanWizardMale;
    }
    if (fetchData['classs'] == 'warrior' && fetchData['race'] == 'human' && fetchData['gender'] == 'female') {
      image.src = humanWarriorF;
    }
    if (fetchData['classs'] == 'rogue' && fetchData['race'] == 'human' && fetchData['gender'] == 'female') {
      image.src = humanRogueF;
    }
    if (fetchData['classs'] == 'wizard' && fetchData['race'] == 'human' && fetchData['gender'] == 'female') {
      image.src = humanWizardF;
    }
  }

  var sendRegisterRequest = function() {
    var loggingIn;
    var dataString = encodeLoginString(loggingIn = false);
    fetch('http://localhost:8080/users', {
        body: dataString,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response) {
      var warningBox = document.getElementById("warning");
      if(response.status == 201) {
        registerModal.style.display = "none";
        registerSheet.style.display = "none";
      } else if (response.status == 422) {
        var warningMessage = document.createElement('p');
        console.log("Email already exists");
        warningMessage.innerHTML = "Email address already exists";
        warningBox.appendChild(warningMessage);
      }

    });
  };

  var sendLoginRequest = function() {
    var loggingIn;
    var dataString = encodeLoginString(loggingIn = true);
    console.log(dataString);
    fetch('http://localhost:8080/sessions', {
        body: dataString,
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (responce) {

    });
  }

  var sendData = function() { // how to have this function call encodedstring if this function was outside of my giant closure.
    var dataString = encodeString();
    console.log("dataString", dataString)
    fetch('http://localhost:8080/dndSheets', {
        body: dataString,
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function () {
      loadData();
    });
  };

  function updateData(saveId) {
    var dataString = encodeString();
    var id = saveId;
    console.log("dataString changed: ", dataString)
    fetch('http://localhost:8080/dndSheets/' + id, {
        body: dataString,
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response) {
      loadData();
    });
  }

  function deleteCharacterSheet(deleteValue) {
    id = deleteValue;
    fetch('http://localhost:8080/dndSheets/' + id, {
      method: 'DELETE',
      credentials: 'include',
    }).then(function (response) {
      loadData();
    });
  }

  var loadData = function() {
    // request the data if user is logged in
    return fetch('http://localhost:8080/dndSheets', {
      credentials: 'include'
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      displayData(data);
      console.log("fetched Data: ", data)
    });
  }

  loadData();

})();

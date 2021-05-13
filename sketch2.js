/***********************************************************************************
  MoodyMaze
  by Scott Kildall

  Uses the p5.2DAdventure.js class 
  
------------------------------------------------------------------------------------
  To use:
  Add this line to the index.html

  <script src="p5.2DAdventure.js"></script>
***********************************************************************************/

// adventure manager global  
var adventureManager;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects


// indexes into the clickable array (constants) 
const cl_startScenario = 0;
const cl_Start_Techies = 1;
const cl_Start_Government = 2;
const cl_Start_Anyone = 3;
const cl_IntelligenRefuses_End = 4;
const cl_IntelligenAccepts_Secrets = 5;
const cl_Mayor_Approves = 6;
const cl_Mayor_Rejects = 7;
const cl_Everyone_All = 8;
const cl_Everyone_Senna = 9;
const cl_IntelligenSecrets_Accept = 10;
const cl_IntelligenSecrets_Expose = 11;
const cl_Mayor_Rejects_Overturn = 12;
const cl_Mayor_Rejects_MoveAway = 13;
const cl_Everyone_AllPrivacy = 14;
const cl_Everyone_AllFlourish = 15;
// const cl_ = 12;


// Alert image
var alertImage;   


// character arrays
var characterImages = [];   // array of character images, keep global for future expansion
var totalCharacterAlertLevel = 0;
var characters = [];        // array of charactes

// characters
const intelligen = 0;
const techie = 1;
const mayor = 2;
const conspiracy = 3;
const nancy = 4;
const senna = 5;

// room indices - look at adventureManager
const startScreen = 3;
const techies = 4;
const government = 5;
const everyone = 6;
const intelligenRefuses = 7;
const intelligenAccepts = 8;
const mayorApproves = 9;
const mayorRejects = 10;
const everyoneAll = 11;
const everyoneSenna = 12;
const secretsAccept = 13;
const secretsExpose = 14;
const rejectOverturn = 15;
const rejectMoveAway = 16;
const everyonePrivacy = 17;
const everyoneFlourish = 18;

let headlineFont;
let bodyFont;


// Allocate Adventure Manager with states table and interaction tables
function preload() {

  headlineFont = loadFont('fonts/Adelle_Heavy.otf');
  bodyFont = loadFont('fonts/Adelle_Reg.otf');

  // load all images
  alertImage = loadImage("assets/alert.png");
  
  allocateCharacters();

  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');
}

// Setup the adventure manager
function setup() {
  createCanvas(1280, 720);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

  // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // load all text screens
  loadAllText();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 

  allocateCharacters();

  fs = fullscreen();
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

 // drawCharacters();

  // don't draw them on first few screens
  if( adventureManager.getStateName() === "Splash" ||
      adventureManager.getStateName() === "Instructions" ||
      adventureManager.getStateName() === "Characters" ) {
    ;
  }
  else {
    drawCharacters();
  }
  
  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch all keys to adventure manager
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  // dispatch all mouse events to adventure manager
  adventureManager.mouseReleased();
}

function drawCharacters() {
  var total;
  for( let i = 0; i < characters.length; i++ ) {
    total += characters[i].getAlert();
  }

  var totalAlerts = total % 5; 
  for( let i = 0; i < 5; i++){
    image(alertImage, 200 + 100(i+1), 600);
  }
  

}

//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    // clickables[i] = clickableRegular;
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;    
  }

  // we do specific callbacks for each clickable
  clickables[0].onPress = clickableButtonPressed;
  clickables[1].onPress = clStartTechies;
  clickables[2].onPress = clStartGovernment;
  clickables[3].onPress = clStartAnyone;
  clickables[4].onPress = clIntelligenRefuses_End;
  clickables[5].onPress = clIntelligenAccepts_Secrets;
  clickables[6].onPress = clMayor_Approves;
  clickables[7].onPress = clMayor_Rejects;
  clickables[8].onPress = clEveryone_All;
  clickables[9].onPress = clEveryone_Senna;
  clickables[10].onPress = clIntelligenSecrets_Accept;
  clickables[11].onPress = clIntelligenSecrets_Expose;
  clickables[12].onPress = clMayor_Rejects_Overturn;
  clickables[13].onPress = clMayor_Rejects_MoveAway;
  clickables[14].onPress = clEveryone_AllPrivacy;
  clickables[15].onPress = clEveryone_AllFlourish;
  // clickables[].onPress = ;

}


// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#4A5ECE";
  this.noTint = false;
  this.tint = "#FF0000";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  // this.color = "#AAAAAA";
  this.color = "#283F6A";
  this.noTint = false;
  this.cornerRadius = 0;
  this.strokeWeight = 5;
  this.stroke = "#589CCE";
  this.textFont = bodyFont;
  this.textColor = "#FFFFFF";
  this.width = 200;
}

clickableButtonPressed = function() {
  adventureManager.clickablePressed(this.name);
} 

//-- specific button callbacks: these will add or subtrack anger, then
//-- pass the clickable pressed to the adventure manager, which changes the
//-- state. A more elegant solution would be to use a table for all of these values
clStartTechies = function() {
    characters[intelligen].addAlert(2);
    characters[techie].subAlert(1);
    characters[bigLabor].addAlert(1);
    adventureManager.clickablePressed(this.name);
}

clStartGovernment = function() {
  characters[mayor].addAlert(1);
  characters[techie].subAlert(1);
  characters[intelligen].subAlert(2);
  adventureManager.clickablePressed(this.name);
}

clStartAnyone = function() {
  characters[techie].addAlert(1);
  characters[nancy].addAlert(1);
  characters[senna].addAlert(1);
  characters[intelligen].subAlert(1);
  adventureManager.clickablePressed(this.name);
}

clIntelligenRefuses_End = function() {
  characters[techie].addAlert(2);
  characters[nancy].subAlert(1);
  characters[intelligen].addAlert(1);
  characters[bigLabor].addAlert(1);
  adventureManager.clickablePressed(this.name);
}

clIntelligenAccepts_Secrets = function() {
  characters[techie].addAlert(1);
  characters[senna].addAlert(1);
  characters[bigLabor].addAlert(1);
  adventureManager.clickablePressed(this.name);
}

clMayor_Approves = function() {
  characters[senna].addAlert(2);
  characters[nancy].addAlert(2);
  characters[mayor].addAlert(1);
  adventureManager.clickablePressed(this.name);
}

clMayor_Rejects = function() {
  characters[senna].addAlert(3);
  characters[mayor].addAlert(1);
  characters[nancy].addAlert(1);
  adventureManager.clickablePressed(this.name);
}

clEveryone_All = function() {
  characters[mayor].addAlert(2);
  characters[bigLabor].addAlert(2);
  characters[nancy].addAlert(1);
  adventureManager.clickablePressed(this.name);
}

clEveryone_Senna = function() {
  characters[mayor].addAlert(1);
  characters[senna].addAlert(2);
  characters[nancy].addAlert(1);
  adventureManager.clickablePressed(this.name);
}

clIntelligenSecrets_Accept = function(){
  adventureManager.clickablePressed(this.name);
}

clIntelligenSecrets_Expose = function(){
  adventureManager.clickablePressed(this.name);
}

clMayor_Rejects_Overturn = function(){
  adventureManager.clickablePressed(this.name);
}

clMayor_Rejects_MoveAway = function(){
  adventureManager.clickablePressed(this.name);
}

clEveryone_AllPrivacy = function(){
  adventureManager.clickablePressed(this.name);
}

clEveryone_AllFlourish = function(){
  adventureManager.clickablePressed(this.name);
}



//-------------- CHARACTERS -------------//
function allocateCharacters() {

  for( let i = 0; i < characterImages.length; i++ ) {
    characters[i] = new Character();
    characters[i].setup(0);
  }

  // default anger is zero, set up some anger values
  characters[government].addAlert(1);
  characters[conspiracy].addAlert(2);
  characters[nancy].addAlert(1);
  characters[senna].subAlert(2); // test
}


class Character {
  constructor() {
    this.alert = 0;
  }

  setup(alertLevel) {
    this.alert = alertLevel;
  }

  draw() {
    if( this.image ) {
      push();
      // draw the character icon
      imageMode(CENTER);
      image( this.image, this.x, this.y );

      // draw anger emojis
      for( let i = 0; i < this.anger; i++ ) {
        image(angerImage, this.x + 70 + (i*40), this.y +10 );
      }

      pop();
    }
  }

  getAlert() {
    return this.alert;
  }

  // add, check for max overflow
  addAlert(amt) {
    this.alert += amt;
    if( this.alert > maxAnger ) {
      this.alert = maxAnger;
    }

  }

  // sub, check for below zero
  subAlert(amt) {
    this.alert -= amt;
    if( this.alert < 0 ) {
      this.alert = 0;
    }
  }
}

//-------------- ROOMS --------------//

// hard-coded text for all the rooms
// the elegant way would be to load from an array
function loadAllText() {
  // go through all states and setup text
  // ONLY call if these are ScenarioRoom
  
// copy the array reference from adventure manager so that code is cleajer
  scenarioRooms = adventureManager.states;

  scenarioRooms[startScreen].setText("The AI that IntelliGenAI has developed is nearly complete! They are planning on launching their first wave of YouAI but are having a hard time deciding who to provide their release to. Who is it distributed to first?");
  scenarioRooms[techies].setText("People working in tech become the first group to receive access to the technology! Because of this, the Government becomes apprehensive and issues a mandate to pause distribution so that they can review the tech to see if it is safe.");
  scenarioRooms[government].setText("The government gains access to this technology first but bars it from other users for the time being. Skeptical of the tech, Mayor Man debates his action on whether to allow approval for mass use of YouAI or to ban or limit its use.");
  scenarioRooms[everyone].setText("YouAI is widely distributed to all on a first come first serve basis. People come in droves to different stores waiting outside to buy the limited supply of YouAI. Many in the public are skeptical of this new technology and its invasion of privacy and many others are extremely excited to get their hands on the new tech. IntelliGenAI launches their initiative without any targeted ads using AI but after the first 6 months eventually develop a “premium subscription” to prevent targeted ads in your system. Multiple groups are angry, who takes action?");
  scenarioRooms[intelligenRefuses].setText("IntelliGenAI refuses the Government’s request to review their tech and this decision, once public, causes massive unrest in the community. Conspiracy Craig’s newsletter has gone viral stating that IntelliGenAI is hiding the facts and are planning to brainwash the public with their new tech. IntelliGenAI is forced to abandon the project altogether due to extreme bad press.");
  scenarioRooms[intelligenAccepts].setText("The Government gains access to this tech but YouAI begins to track government secrets without their knowledge. IntelliGenAI becomes aware of this and struggles between notifying the Government or notifying the public of the secrets they’ve learned.");
  scenarioRooms[mayorApproves].setText("Mayor man approves the use of YouAI for all citizens. This is a move that begins wide distribution. Conspiracy Craig and Studious Senna begin to disapprove of YouAI for different reasons. People like Techy Ted and Normal Nancy are excited and begin using the tech immediately.");
  scenarioRooms[mayorRejects].setText("Mayor Man limits the use of YouAI and only allows people who work in tech to use its technology so that it limits potential problems in a larger group. IntelliGenAI is angered by this decision and begins marketing to the public that YouAI is a necessary technology for individuals.");
  scenarioRooms[everyoneAll].setText("Those that were able to obtain YouAI are frustrated at their lack of ability to prevent targeted ads but the ads are catered to things they want/need. Columns are published in news outlets regarding the tracking of information and lack of privacy. The full scope and use of YouAI becomes only available to a privileged few. ");
  scenarioRooms[everyoneSenna].setText("Studious Senna takes note of the extreme misuse of information from YouAI and the increasing wealth gap that comes from it. With only the rich being able to afford the premium, they become more and more productive and streamlined and everyone else is stuck with a half useful product. Although she doesn’t have one, she begins a grassroots campaign that protests the premium subscription.");
  scenarioRooms[secretsAccept].setText("IntelliGenAI begins to work with the government to use AI to gather data and information on everyday citizens further targeting ads, and other personalized things towards them. ");
  scenarioRooms[secretsExpose].setText("IntelliGenAI decides to expose government secrets as an issue of morality and believes that the people should know. Mass protests begin that shut the city down, all characters are unified in protesting the government. IntelliGenAI’s approval ratings are through the roof.");
  scenarioRooms[rejectOverturn].setText("IntelliGenAI is successful in overturning the government ruling and distribution is opened up to anyone. Many struggle to pay for such an expensive product, but those that can afford it are seeing increases in productivity and living standards. You begin to see the technology create a larger divide between the wealthy and the less privileged. This begins campaigns for greater accessibility in not just YouAI but all tech that further pushes forward others while leaving the less privileged behind. ");
  scenarioRooms[rejectMoveAway].setText("Because of skepticism from large groups of people, IntelliGenAI isn’t able to keep its product profitable. They decide to do what’s left of their capital and move the company overseas to bide their time until they develop an even better product to come back with a vengeance.");
  scenarioRooms[everyonePrivacy].setText("The vast majority of people are appalled at the lack of privacy that YouAI affords them. If it is recording/taking note of everything they do, does it ever turn off or stop watching? Many begin to discard their YouAI and IntelliGenAI loses thousands of sales. Mayor Man encourages government officials to create limits on future AI.");
  scenarioRooms[everyoneFlourish].setText("Surprisingly, people are extremely excited and ecstatic about this. Gone are they days of searching for the perfect gift, or that thing on your mind that you saw the other day but can’t seem to find online. The economy begins booming and things seem to flourish.");

  // scenarioRooms[].setText("");
}

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//

// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class ScenarioRoom extends PNGRoom {
  // Constructor gets calle with the new keyword, when upon constructor for the adventure manager in preload()
  constructor() {
    super();    // call super-class constructor to initialize variables in PNGRoom

    this.bodyText = "";
  }

  // should be called for each room, after adventureManager allocates
  setText( bodyText ) {
    this.bodyText = bodyText;
    this.drawY = 170;
    this.drawX = 200;
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
    draw() {
      // this calls PNGRoom.draw()
      super.draw();
      
      push();

      // title text
      fill(255);
      textAlign(LEFT);
      textFont(headlineFont);
      textSize(36);

      text("How do we feel?", this.drawX , 120);
     
      // Draw text in a box
      // text(this.titleText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
    
      textFont(bodyFont);
      textSize(24);

      text(this.bodyText, this.drawX , this.drawY, width - (this.drawX*2),height - (this.drawY+100) );

      textFont(headlineFont);
      textSize(36);
      text("Alert Level:", this.drawX , 500);

      
      pop();
    }
}


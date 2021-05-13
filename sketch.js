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

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

var totalAlerts; 
var intelligenAlerts;
var techieAlerts;
var mayorAlerts;
var conspiracyAlerts;
var nancyAlerts;
var sennaAlerts;

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


// alert emojis
var alertImage;   // alert emoji
var maxalert = 5;

// character arrays
var characterImages = [];   // array of character images, keep global for future expansion
var characterLength = 5;
var characters = [];        // array of charactes

// characters
const intelligen = 0;
const mayor = 1;
const conspiracyCraig = 2;
const techie = 3;
const studiousSenna = 4;
const normNancy = 5;

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

  // drawCharacters();

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
  // else {
  //   drawCharacters();
  // }
  
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
  // for( let i = 0; i < characters.length; i++ ) {
  //   totalAlerts += characters[i].getAlert();
    text(totalAlerts, 1000, 525);
  // }
  var alertValue = totalAlerts/5;
  for( let i = 0; i < alertValue; i++ ) {
        image(alertImage, 200 + 100 * (i+1), 550);
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

//-- specific button callbacks: these will add or subtrack alert, then
//-- pass the clickable pressed to the adventure manager, which changes the
//-- state. A more elegant solution would be to use a table for all of these values
clStartTechies = function() {
    characters[techie].subAlert(1);
    techieAlerts -= 1;
    characters[conspiracyCraig].addAlert(3);
    conspiracyAlerts += 3;
    characters[mayor].addAlert(4);
    mayorAlerts += 4;
    characters[normNancy].addAlert(2);
    nancyAlerts += 2;
    adventureManager.clickablePressed(this.name);
}

clStartGovernment = function() {
  characters[mayor].subAlert(1);
  mayorAlerts -= 1;
  characters[techie].addAlert(1);
  techieAlerts += 1;
  characters[intelligen].addAlert(2);
  intelligenAlerts += 2;
  adventureManager.clickablePressed(this.name);
}

clStartAnyone = function() {
  characters[techie].addAlert(1);
  techieAlerts += 1;
  characters[normNancy].subAlert(1);
  nancyAlerts -= 1;
  characters[studiousSenna].addAlert(1);
  sennaAlerts += 1;
  characters[intelligen].subAlert(1);
  intelligenAlerts -=1;
  adventureManager.clickablePressed(this.name);
}

clIntelligenRefuses_End = function() {
  characters[mayor].addAlert(5);
  mayorAlerts += 5;
  characters[conspiracyCraig].addAlert(5);
  conspiracyAlerts += 5;
  adventureManager.clickablePressed(this.name);
}

clIntelligenAccepts_Secrets = function() {
  characters[mayor].subAlert(3);
  mayorAlerts -= 3;
  characters[studiousSenna].addAlert(2);
  sennaAlerts += 2;
  characters[conspiracyCraig].addAlert(1);
  conspiracyAlerts += 1;
  adventureManager.clickablePressed(this.name);
}

clMayor_Approves = function() {
  characters[mayor].subAlert(2);
  mayorAlerts -= 2;
  adventureManager.clickablePressed(this.name);
}

clMayor_Rejects = function() {
  characters[studiousSenna].addAlert(3);
  sennaAlerts += 3;
  characters[mayor].addAlert(2);
  mayorAlerts += 2;
  characters[normNancy].addAlert(1);
  nancyAlerts += 1;
  adventureManager.clickablePressed(this.name);
}

clEveryone_All = function() {
  characters[mayor].addAlert(1);
  mayorAlerts += 1;
  characters[conspiracyCraig].addAlert(2);
  conspiracyAlerts += 2;
  characters[normNancy].subAlert(2);
  nancyAlerts -= 2;
  adventureManager.clickablePressed(this.name);
}

clEveryone_Senna = function() {
  characters[mayor].addAlert(1);
  mayorAlerts += 1;
  characters[studiousSenna].addAlert(4);
  sennaAlerts += 4;
  characters[normNancy].addAlert(1);
  nancyAlerts += 1;
  adventureManager.clickablePressed(this.name);
}

clIntelligenSecrets_Accept = function(){
  characters[intelligen].addAlert(2);
  intelligenAlerts += 2;
  characters[mayor].subAlert(3);
  mayorAlerts -= 3
  adventureManager.clickablePressed(this.name);
}

clIntelligenSecrets_Expose = function(){
  characters[mayor].addAlert(5);
  mayorAlerts += 5
  characters[conspiracyCraig].addAlert(5);
  conspiracyAlerts += 5;
  adventureManager.clickablePressed(this.name);
}

clMayor_Rejects_Overturn = function(){
  characters[mayor].addAlert(3);
  mayorAlerts += 3
  characters[intelligen].subAlert(3);
  intelligenAlerts -= 3;
  adventureManager.clickablePressed(this.name);
}

clMayor_Rejects_MoveAway = function(){
  characters[mayor].subAlert(3);
  mayorAlerts -= 3
  characters[intelligen].addAlert(5);
  intelligenAlerts += 5;
  adventureManager.clickablePressed(this.name);
}

clEveryone_AllPrivacy = function(){
  characters[studiousSenna].addAlert(3);
  sennaAlerts += 3;
  characters[normNancy].addAlert(1);
  nancyAlerts += 1;
  characters[conspiracyCraig].addAlert(4);
  conspiracyAlerts += 4;
  adventureManager.clickablePressed(this.name);
}

clEveryone_AllFlourish = function(){
  characters[studiousSenna].subAlert(3);
  sennaAlerts -= 3;
  characters[normNancy].subAlert(1);
  nancyAlerts -= 1;
  characters[conspiracyCraig].subAlert(4);
  conspiracyAlerts -= 4;
  adventureManager.clickablePressed(this.name);
}



//-------------- CHARACTERS -------------//
function allocateCharacters() {
  // load the images first
  // characterImages[intelligen] = loadImage("assets/intelligen.jpg");
  // characterImages[mayor] = loadImage("assets/mayor.jpg");
  // characterImages[conspiracyCraig] = loadImage("assets/conspiracyCraig.jpg");
  // characterImages[techie] = loadImage("assets/techie.jpg");
  // characterImages[studiousSenna] = loadImage("assets/studiousSenna.jpg");
  // characterImages[normNancy] = loadImage("assets/normNancy.jpg");
  totalAlerts = 0;

  for( let i = 0; i < characterLength+1; i++ ) {
    characters[i] = new Character();
    characters[i].setup( 50 + (400 * parseInt(i/2)), 120 + (i%2 * 120));
  }

  // default alert is zero, set up some alert values
  // characters[conspiracyCraig].addAlert(1);
  // characters[techie].addAlert(2);
  // characters[studiousSenna].addAlert(1);
  // characters[normNancy].subAlert(2); // test
}

class Character {
  constructor() {
    // this.image = null;
    this.x = width/2;
    this.y = width/2;
  }

  setup( x, y) {
    // this.image = img;
    this.x = x;
    this.y = y;
    this.alert = 0;
  }

  getAlert() {
    return this.alert;
  }

  // add, check for max overflow
  addAlert(amt) {
    this.alert += amt;
    if( this.alert > maxalert ) {
      this.alert = maxalert;
    }
    totalAlerts += amt;
  }

  // sub, check for below zero
  subAlert(amt) {
    this.alert -= amt;
    if( this.alert < 0 ) {
      this.alert = 0;
    }
    totalAlerts -= amt;
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
  scenarioRooms[mayorRejects].setText("Mayor Man limits the use of YouAI and only allows people who work in tech to use its technology so that it limits potential problems in a larger group. IntelliGenAI is alerted by this decision and begins marketing to the public that YouAI is a necessary technology for individuals.");
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
      text("Alert Level:", this.drawX , 525);
      drawCharacters();

      pop();
    }
}


const puppeteer = require('puppeteer');
const  {email,password}=require('./secret');
let { answer } = require("./codes");
let curTab;
const  browseropenpromise=puppeteer.launch({
  headless:false,
  defaultViewport:null,
    // ages:{--start}
    args:["--start-maximized"]
})
browseropenpromise.then(function(browser){
    console.log("Browser is opened");
  let  allTabsPromise=browser.pages();
    return  allTabsPromise;
})
.then(function(allTabarr){
  curTab=allTabarr[0];
  let visitingLoginPagePromise=curTab.goto("https://www.hackerrank.com/auth/login");
  return  visitingLoginPagePromise;
})
.then(function(){
  console.log("Hackerrank website is opened");
  let emailwillbetype=curTab.type("input[name='username']",email);
  return emailwillbetype;
})
.then(function(){
  console.log("email is typed");
  let passwordWillBeTypedPromise = curTab.type("input[type='password']", password);
  return passwordWillBeTypedPromise;
})
.then(function() {
  console.log("Password is typed");
  let websiteclick=curTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
  return websiteclick;
})
.then(function() {
  console.log("website is opened");
  let algorithmTabWillBeOPenedPromise=waitandclick("div[data-automation='algorithms']");
  return algorithmTabWillBeOPenedPromise;
})
.then(function(){
  console.log("algorithm page opened");
  let allQuesPromise = curTab.waitForSelector(
    'a[data-analytics="ChallengeListChallengeName"]'
  );
  return allQuesPromise;
})
.then(function(){
  function getalllink(){
    let alllinkarr=document.querySelectorAll('a[data-analytics="ChallengeListChallengeName"]');
    let linkArr=[]
    for(let i=0;i<alllinkarr.length;i++){
   linkArr.push(alllinkarr[i].getAttribute("href"));
    }
    return linkArr;
  }
  let linkpromise=curTab.evaluate(getalllink);
  return linkpromise;
})
.then(function(linkArr){
  console.log('I am getting alll links');
  let questionwillbesolve=questionsolver(linkArr[0],0)
  for(let i=1;i<linkArr.length;i++){
    questionwillbesolve=questionwillbesolve.then(function(){
      return  questionsolver(linkArr[i],i);
    })
  }
  return  questionwillbesolve;
})
.then(function(){
  console.log("question will be solved");
}).catch(function(err){
  console.log(err);
})

function waitandclick(algoBtn){
  let waitclickpromise=new Promise(function(resolve,reject){
    let waitpromise=curTab.waitForSelector(algoBtn);
    waitpromise.then(function(){
      console.log("Algo Btn is found");
      let clickme=curTab.click(algoBtn);
      return  clickme;
    }).then(function(){
      console.log("algo Btn is click");
      resolve()
    }).catch(function(err){
      reject(err);
    })
  })
  return waitclickpromise;
}
function questionsolver(url,idx){
  return new Promise(function(resolve,reject){
    let fullLink = `https://www.hackerrank.com${url}`;
    let goToQuesPagePromise = curTab.goto(fullLink);
    goToQuesPagePromise.then(function(){
      console.log("Link is opened");
      let  waitforcheckbox=waitandclick(".checkbox-input");
      return waitforcheckbox;
    })
    .then(function(){
      console.log("click the checkbox");
      let waitfortextbox=curTab.waitForSelector(".custominput");
      return waitfortextbox;
    })
    .then(function(){
      return curTab.$eval(".custominput", function(ele) {
        ele.style.width = "900px";
      })
    })
    .then(function(){
      let codewillbeTypePromise=curTab.type(".custominput",answer[idx]);
      return codewillbeTypePromise;
    }).then(function(){
      console.log("code is typed")
      let controlPressedPromise=curTab.keyboard.down("Control");
      return controlPressedPromise;
    })
    .then(function(){
      let aKeyPressedPromise = curTab.keyboard.press("a");
      return aKeyPressedPromise;
    })
    .then(function(){
      let controlPressedPromise=curTab.keyboard.up("Control");
      return controlPressedPromise;
    })
    .then(function() {
      return curTab.waitFor(5000);
    })
    .then(function(){
     
      let controlPressedPromise=curTab.keyboard.down("Control");
      return controlPressedPromise;
    })
    .then(function(){
      let vKeyPressedPromise = curTab.keyboard.press("x");
      return vKeyPressedPromise;
    })
    .then(function(){
     
      let controlPressedPromise=curTab.keyboard.up("Control");
      return controlPressedPromise;
    })
 
    .then(function() {
      let  waitforcheckbox=waitandclick(".checkbox-input");
      return waitforcheckbox;
    })
    .then(function() {
      let editorClick = curTab.click(".monaco-scrollable-element.editor-scrollable.vs");
      return editorClick;
    })
    .then(function () {
      let controlDownPromise = curTab.keyboard.down("Control");
      return controlDownPromise;
    })
    .then(function(){
      let aKeyPressedPromise = curTab.keyboard.press("a");
      return aKeyPressedPromise;
    })
    .then(function () {
      let controlDownPromise = curTab.keyboard.up("Control");
      return controlDownPromise;
    })
    .then(function() {
      return curTab.waitFor(5000);
    })
    .then(function(){
      let aKeyPressedPromise = curTab.keyboard.press("Backspace");
      return aKeyPressedPromise;
    })
    .then(function () {
      let controlDownPromise = curTab.keyboard.down("Control");
      return controlDownPromise;
    })
    .then(function(){
      let aKeyPressedPromise = curTab.keyboard.press("v");
      return aKeyPressedPromise;
    })
    .then(function () {
      let controlDownPromise = curTab.keyboard.up("Control");
      return controlDownPromise;
    })
    .then(function () {
      let submitButtonClickedPromise = curTab.click(".hr-monaco-submit");
      return submitButtonClickedPromise;
    })
    .then(function() {
      return curTab.waitFor(10000);
    })
    .then(function () {
      console.log("code submitted successfully");
      resolve();
    })
    .catch(function (err) {
      reject(err);
    });
  })
}
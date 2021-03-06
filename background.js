// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function setStartIcon() {
  chrome.browserAction.setIcon({ path: "start.png" });
}

function setStopIcon() {
  chrome.browserAction.setIcon({ path: "stop.png" });
}

function startCallBack() {
        if (chrome.runtime.lastError) {
          alert("Couldn't start speech input: " +
              chrome.runtime.lastError.message);
          setStartIcon();
        } else {
          setStopIcon();
        }
}


chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.experimental.speechInput.isRecording(function(recording) {
    if (!recording) {
      chrome.experimental.speechInput.start({}, startCallBack());
    } else {
      chrome.experimental.speechInput.stop(function() {
        setStartIcon();
      });
    }
  });
});

chrome.experimental.speechInput.onError.addListener(function(error) {
  alert("Speech input failed: " + error.code);
  setStartIcon();
});

chrome.experimental.speechInput.onResult.addListener(function(result) {
  var words = result.hypotheses[0].utterance;
  if (words.toUpperCase() == "CHINESE")
  {
    alert("Change language to Chinese");
    chrome.experimental.speechInput.start({"language": "cmn-Hans-CN" },startCallBack());
  }
  else if (words.toUpperCase() == "ENGLISH")
  {
    alert("Change language to English");
    chrome.experimental.speechInput.start({"language": "en-US" },startCallBack());
  }
  else 
  {
    var liPrefix = "http://www.linkedin.com/pub/dir/?first=";
    var liSuffix = "&last=&search=Search";
    var url = liPrefix.concat(words,liSuffix);
    window.open(url);
    chrome.experimental.speechInput.start({},startCallBack());
  }
});

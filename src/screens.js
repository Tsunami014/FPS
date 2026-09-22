function loadUserInfo() {
  if (!loadUserInfo.inf) {
    (async () => {
      try {
        const response = await fetch(
          "https://hackatime.hackclub.com/api/v1/authenticated/me",
          { headers: { Authorization: `Bearer ${getTok()}` } }
        )
        const data = await response.json()
        loadUserInfo.inf = new Page("UserInfo", [
          new BannerObj("Username", {
            text: data.github_username,
            text_size: 30,
            text_style: ["Bold", "Small Caps"],
            background_col: "#DC8ADD",
            x: -24, y: 14, rot: -2,
          }),
          new TextObj("Slack ID", {
            text: "Slack ID: "+data.slack_id,
            text_size: 8,
            x: 120, y: 6, rot: 4,
          }),
          new TextObj("Emails", {
            text: "Emails:\n"+data.emails.join('\n'),
          }),
        ], {
          open: true,
          page_gap: 10,
          page_direction: "Column"
        })
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        loadUserInfo.inf = new ErrorObj("loading user info")
      }
      reloadScene()
    })()
    return new LoadingObj("user info")
  } else {
    return loadUserInfo.inf
  }
}

var extra;
if (loggedIn()) {
  extra = {
    projects: ["Projects", [
      new BasePage("Stage", [
        new TextObj("Text", {
          text: "Coming soon..!",
        }),
      ], {
        default: true,
        open: true,
      }),
    ]],
    shop: ["Shop", [
      new BasePage("Stage", [
        new TextObj("Text", {
          text: "Coming soon..!",
        }),
      ], {
        default: true,
        open: true,
      }),
    ]],
    settings: ["Settings", [
      new BasePage("Stage", [
        new ButtonObj("LogOut", {
          text: "Log Out",
          btn_onpress: ()=>{
            if (confirm("Are you sure you want to log out?")) {
              logout()
            }
          },
        }),
        loadUserInfo,
      ], {
        page_gap: 5,
        default: true,
        open: true,
      }),
    ]],
  }
} else {
  extra = {
    login: ["Log In", [
      new BasePage("Stage", [
        new TextObj("Text", {
          text: "Log in via hackatime",
        }),
        new ButtonObj("LogIn", {
          text: "Log In",
          btn_onpress: login,
        }),
      ], {
        default: true,
        open: true,
      }),
    ]],
  }
}

SCREENS = {
  home: [null, [ // Already in the html
    new BasePage("Stage", [
      new Page("TitlePage", [
        new BannerObj("Title", {
          text: "FPS",
          text_size: 32,
          width: 80,
          text_style: ["Italics", "Small Caps"],
        }),
        new BannerObj("Banner", {
          text: "STATUS: Not running... yet",
          background_col: "#EDC",
          width: 350,
          height: 70,
        }),
        new ImageObj("BannerImage", {
          url: "/imgs/square.webp",
          alt: "A cute kitten!",
        }),
        new TextObj("Help", {
          text: "Press an object in the right menu ->",
        }),
      ], {
        x: -60, rot: 6, scale: 1.2,
        page_gap: 10,
        default: true,
      }),
      new Page("AboutPage", [
        new SectionObj("WhatIsThis", {
          text: "This is a Hack Club YSWS where YOU create something cool for a game and WE give you games & merch!",
          max_width: 500,
        }),
        new FAQObj("IsThisReal", {
          question: "Is this for real?",
          answer: "Yup! Hack Club is a non-profit organisation and a community of 100k+ teenage makers, and we do these kinds of things all the time!",
          width: 600,
        }),
        new LinkObj("HackClubWebsite", {
          text: "Link to the Hack Club website!",
          url: "https://hackclub.com/",
          x: -66, rot: -2,
        }),
        new LinkObj("HackClubSlack", {
          text: "Link to the Hack Club slack!\nFind this on the #fps channel!",
          url: "https://hackclub.com/slack",
          x: 84, rot: 2,
        }),
        new FAQObj("WhatDoYouMean", {
          question: "What do you mean, 'something cool for a game'?",
          answer: `Whatever you like! It could be something simple like a sound effect creator, terrain generator, or something more complex like a physics engine.
Basically if it is used in the production of a game you'll be fine.
Build it however complex or easy as you want! You can build everything yourself or use libraries - it's up to you!`,
          width: 600,
        }),
        new FAQObj("DoIHaveToBeGood", {
          question: "Do I have to be good at programming?",
          answer: "Not very, you are free to do whatever difficulty project you want to! And if you want to try something harder or are struggling, feel free to ask on the Slack channel #fps for any help (or just on Slack in general, everyone's pretty nice), we'd love to help you!",
          width: 600,
        }),
        new Page("ExtraLinks", [
          new LinkObj("FufillmentBounty", {
            text: "Fulfillment bounty form (if I'm too slow giving prizes)",
            url: "https://forms.hackclub.com/bounty",
            y: -6, rot: -1,
          }),
          new LinkObj("TOS", {
            text: "Terms of Service",
            url: "https://hackclub.com/privacy-and-terms#hack-club-privacy-notice",
            x: -18, rot: -4,
          }),
          new LinkObj("PrivacyPolicy", {
            text: "Privacy Policy",
            url: "https://hackclub.com/privacy-and-terms#hack-club-standard-terms-and-conditions",
            x: 32, rot: 2,
          }),
        ], {
          y: 16, rot: 2, scale: 0.7,
        }),
      ], {
        x: -10, y: 35, rot: -3, scale: 0.9,
        open: true,
      }),
      new Page("GetStartedSection", [
        new TextObj("Title", {
          text: "Get Started",
          text_style: ["Bold"],
          text_size: 34,
        }),
        new BackgroundObj("Background", {
          width: 300,
        }),
        new SectionObj("WhoCanJoin", {
          text: "This is for anyone aged 13-18 (inclusive)",
        }),
        new SectionObj("HowToStart", {
          // TODO: Finish this and add a link to Slack
          text: "To get started, join the #fps channel on the Hack Club Slack!",
          max_width: 500,
        }),
        new Page("HowToUseThis", [
          new TextObj("Title", {
            text: "How to navigate this",
            text_style: ["Bold"],
            text_size: 22,
          }),
          new SectionObj("NavigationTips", {
            text: `Click on an element in the scene list to select it, double click to inspect it (or if it's a tree branch, expand/contract it).
Anything can be inspected by clicking on it and then going to the inspector tab.
Click on the page to deselect the current element.
In the inspector tab there are more options that can be revealed by clicking on them (they have a > arrow on the left)`,
            max_width: 500,
          }),
        ], {
          open: true,
        }),
      ], {
        x: 200, y: -20, rot: -50,
        open: true,
      }),
      new TextObj("MadeWith<3", {
        text: "Made with <3 by Tsunami014",
        y: -400, rot: 10,
        zoom: true,
      }),
    ], {
      open: true,
      page_gap: 100,
      page_direction: "Row"
    }),
  ]],
  "404": [null, [
    new BasePage("Stage", [
      new Page("404Page", [
        new BannerObj("Whoops", {
          text: "Whoops!",
          text_size: 32,
          width: 270,
          text_style: ["Italics"],
        }),
        new TextObj("Text", {
          text: "You seem to have gotten lost, as this page is not accessible for you.\n\
Maybe try going home?",
          max_width: 200,
        }),
      ], {
        open: true, default: true,
      }),
    ], { open: true, }),
  ]],
...extra }

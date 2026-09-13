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
        loadUserInfo,
        new ButtonObj("LogOut", {
          btn_label: "Log Out",
          btn_onpress: ()=>{
            if (confirm("Are you sure you want to log out?")) {
              logout()
            }
          }
        }),
      ], {
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
          btn_label: "Log In",
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
          width: 270,
          height: 65,
          text_style: ["Italics", "Small Caps"],
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
          question: "Is this legit?",
          answer: "This is literally what Hack Club was made for!",
          max_width: 500,
        }),
        new LinkObj("HackClubWebsite", {
          text: "Link to the Hack Club website!",
          url: "https://hackclub.com/",
        }),
        new FAQObj("WhatDoYouMean", {
          question: "What do you mean, 'something cool for a game'?",
          answer: "Whatever you like! It could be something simple like a sound effect creator, terrain generator (I won't judge if you use external libraries for the actual generation), or something more complex like a physics engine. Basically if it is used in the production of a game you'll be fine. Build it however complex or easy as you want!",
          max_width: 500,
        }),
        new FAQObj("DoIHaveToBeGood", {
          question: "Do I have to be good?",
          answer: "Not much. Do whatever difficulty project you feel like! And if you want to try something harder or are struggling feel free to ask on the Slack channel #fps for any help, we'd love to help you!",
          max_width: 500,
        }),
        new Page("ExtraLinks", [
          new LinkObj("FufillmentBounty", {
            text: "Fufillment bounty form (if I'm too slow giving prizes)",
            url: "https://forms.hackclub.com/bounty",
          }),
          new LinkObj("TOS", {
            text: "Terms of Service",
            url: "https://hackclub.com/privacy-and-terms#hack-club-privacy-notice",
            rot: -4,
          }),
          new LinkObj("PrivacyPolicy", {
            text: "Privacy Policy",
            url: "https://hackclub.com/privacy-and-terms#hack-club-standard-terms-and-conditions",
            rot: -4,
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
        new SectionObj("WhosThisFor", {
          text: "This is for anyone aged 13-18 (inclusive)",
        }),
        new SectionObj("HowToStart", {
          text: "To get started, ...",
        }),
        new Page("HowToUseThis", [
          new TextObj("Title", {
            text: "How to navigate this",
            text_style: ["Bold"],
            text_size: 22,
          }),
          new SectionObj("BasicNavigation", {
            text: "...",
          }),
          new SectionObj("EditingElements", {
            text: "...",
          }),
        ], {
          open: true,
        }),
      ], {
        y: -20, rot: -50,
        open: true,
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

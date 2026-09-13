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
          }),
          new TextObj("Emails", {
            text: "Emails:\n"+data.emails.join('\n'),
          }),
          new TextObj("Slack ID", {
            text: "Slack ID: "+data.slack_id,
            text_size: 8,
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
    projects: ["Projects", []],
    shop: ["Shop", []],
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
        new BannerObj("Announcements", {
          text: "Announcement!",
          text_size: 28,
          width: 270,
          height: 65,
          text_style: ["Italics", "Small Caps"],
        }),
        new ImageObj("BannerImage", {
          url: "/imgs/square.webp",
          alt: "A cute kitten!",
        }),
        new TextObj("Title", {
          text: "FPS",
        }),
      ], {
        rot: 2, scale: 1.2,
        page_gap: 0,
        default: true,
      }),
      new Page("AboutPage", [
        new SectionObj("WhatIsThis"),
        new SectionObj("HowThisWorks"),
        new SectionObj("IsHackClubReal"),
        new SectionObj("AmIEligible"),
        new SectionObj("HowToJoin"),
      ], {
        y: -10, rot: -1, scale: 0.95,
        open: true,
      }),
      new Page("HelpSection", [
        new BackgroundObj("Background", {
          width: 300,
        }),
        new FAQObj("FAQItem"),
        new FAQObj("FAQItem"),
      ], {
        x: -50, y: -80, rot: 8,
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

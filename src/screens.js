var extra;
if (loggedIn) {
  extra = {
    projects: ["Projects", [
    ]],
    shop: ["Shop", [
    ]],
    settings: ["Settings", [
    ]],
  }
} else {
  extra = {
    login: ["Log In", [
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
          x: -30,
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
        x: 12, y: 0, rot: 0,
        default: true,
      }),
      new Page("AboutPage", [
        new SectionObj("WhatIsThis"),
        new SectionObj("HowThisWorks"),
        new SectionObj("IsHackClubReal"),
        new SectionObj("AmIEligible"),
        new SectionObj("HowToJoin"),
      ], {
        x: 400, y: -200, rot: 14,
        open: true,
      }),
      new Page("HelpSection", [
        new BackgroundObj("Background"),
        new FAQObj("FAQItem"),
        new FAQObj("FAQItem"),
      ], {
        x: 100, y: -400, rot: -5,
        open: true,
      }),
    ], { open: true, }),
  ]],
  "404": [null, [
    new BasePage("Stage", [
      new Page("404Page", [
        new BannerObj("Whoops", {
          text: "Whoops!",
          text_size: 28,
          x: -30,
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

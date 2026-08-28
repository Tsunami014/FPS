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

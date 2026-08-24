const SCREENS = {
  home: [
    new Page("Stage", [
      new Page("TitlePage", [
        new BannerObj("Announcements", {
          text: "Announcement!",
          text_size: 28,
        }),
        new ImageObj("BannerImage", {
          url: "https://www.placekittens.com/200/200",
          alt: "A cute kitten!",
        }),
        new TextObj("Title", {
          text: "FPS",
        }),
      ]),
      new Page("AboutPage", [
        new SectionObj("WhatIsThis"),
        new SectionObj("HowThisWorks"),
        new SectionObj("IsHackClubReal"),
        new SectionObj("AmIEligible"),
        new SectionObj("HowToJoin"),
      ], true),
      new Page("HelpSection", [
        new BackgroundObj("Background"),
        new FAQObj("FAQItem"),
        new FAQObj("FAQItem"),
      ], true),
    ], true),
  ],
  projects: [
  ],
  shop: [
  ],
  settings: [
  ],
}

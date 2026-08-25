const SCREENS = {
  home: [
    new Page("Stage", [
      new Page("TitlePage", [
        new BannerObj("Announcements", {
          text: "Announcement!",
          text_size: 28,
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
  ],
  projects: [
  ],
  shop: [
  ],
  settings: [
  ],
}

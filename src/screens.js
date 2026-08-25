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
        x: 70, y: 125, rot: 12,
      }),
      new Page("AboutPage", [
        new SectionObj("WhatIsThis"),
        new SectionObj("HowThisWorks"),
        new SectionObj("IsHackClubReal"),
        new SectionObj("AmIEligible"),
        new SectionObj("HowToJoin"),
      ], {
        x: 400, y: 20, rot: -10,
        open: true,
      }),
      new Page("HelpSection", [
        new BackgroundObj("Background"),
        new FAQObj("FAQItem"),
        new FAQObj("FAQItem"),
      ], { open: true, }),
    ], { open: true, }),
  ],
  projects: [
  ],
  shop: [
  ],
  settings: [
  ],
}

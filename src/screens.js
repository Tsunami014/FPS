const SCREENS = {
  home: [
    new Page("Stage", [
      new Page("TitlePage", [
        new BannerObj("Announcements"),
        new ImageObj("BannerImage"),
        new TextObj("Title", "FPS"),
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

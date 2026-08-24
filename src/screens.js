const SCREENS = {
    home: [
        { labl: "Stage", open: true, conts: [
            { labl: "TitlePage", conts: [
                new BannerObj("Announcements"),
                new ImageObj("BannerImage"),
                new TextObj("Title"),
            ]},
            { labl: "AboutPage", open: true, conts: [
                new SectionObj("WhatIsThis"),
                new SectionObj("HowThisWorks"),
                new SectionObj("IsHackClubReal"),
                new SectionObj("AmIEligible"),
                new SectionObj("HowToJoin"),
            ]},
            { labl: "HelpSection", open: true, conts: [
                new BackgroundObj("Background"),
                new FAQObj("FAQItem"),
                new FAQObj("FAQItem"),
            ]},
        ]},
    ],
    projects: [
    ],
    shop: [
    ],
    settings: [
    ],
}

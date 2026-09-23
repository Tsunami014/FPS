var adminExtra = {}
if (localStorage.getItem('adminKey') !== null) {
  const adminKey = localStorage.getItem('adminKey').replaceAll('\n','')
  for (const inf of [
    ['admin', 'Admin']
  ]) {
    function func() {
      if (!func.inf) {
        func.inf = new Objs.Loading(`${inf[0]} page`)
        ;(async () => {
          try {
            const response = await fetch("./admin.js",
              { headers: { Authorization: `Bearer ${adminKey}` } }
            )
            const source = await response.text()
            if (source == "Unauthorized") {
              console.error("Unauthorized")
              func.inf = new Objs.Error("authenticating", { text: "You are unauthorized!" })
            } else {
              const page = await import(
                `data:text/javascript;charset=utf-8,${encodeURIComponent(source)}`
              )
              func.inf = page.setup(Objs, inf[0])
            }
          } catch (error) {
            console.error(`Failed to load ${inf[0]} page:`, error)
            func.inf = new Objs.Error(`loading ${inf[0]} page`)
          }
          reloadScene()
        })()
      }
      return func.inf
    }
    adminExtra[inf[0]] = [inf[1], [ func ]]
  }
}

function loadProjs() {
  if (!loadProjs.inf) {
    loadProjs.inf = new Objs.Loading("projects")
    ;(async () => {
      try {
        const response = await fetch(
          "/api/projects",
          { headers: { Authorization: `Bearer ${getTok()}` } }
        )

        const projs = (await response.json()).projects
        const hasprojs = projs && projs.length > 0
        var projlist;
        if (hasprojs) {
          projlist = projs.map(p=>{
            return new Objs.Page(p.title, [
              new Objs.Page("DetailsPage", [
                new Objs.Text("Title", {
                  text: p.title,
                }),
                new Objs.Link("GitURL", {
                  url: p.git_url,
                }),
                // TODO: Hackatime project select
              ]),
              new Objs.Button("DeleteProject", {
                text: `Delete Project '${p.title}'`,
                btn_onpress: async ()=>{
                  try {
                    const response2 = await fetch("/api/projects?id="+p.id, {
                      method: 'DELETE',
                      headers: { Authorization: `Bearer ${getTok()}` }
                    })
                    if (response2.status === 204) {
                      loadProjs.inf = null // Re-fetch projects
                    } else {
                      console.error(`HTTP error when deleting project ${p.id}: ${response2.status}`)
                      loadProjs.inf = new Objs.Error("deleting the project")
                    }
                    reloadScene()
                  } catch (error) {
                    console.error(`Failed to delete project ${p.id}:`, error)
                    loadProjs.inf = new Objs.Error("deleting the project")
                    reloadScene()
                  }
                },
              })
            ])
          })
        } else {
          projlist = [new Objs.Text("NothingYet", {
            text: "Nothing here yet!",
          })]
        }

        loadProjs.inf = new Objs.BasePage("Stage", [
          new Objs.Page("Projects", projlist, {
            default: hasprojs,
            open: true,
          }),
          new Objs.Button("NewProject", {
            text: "New Project",
            btn_onpress: async ()=>{
              try {
                const response2 = await fetch("/api/projects", {
                  method: 'PUT',
                  headers: { Authorization: `Bearer ${getTok()}` }
                })
                if (response2.status === 201) {
                  loadProjs.inf = null // Re-fetch projects
                } else {
                  console.error(`HTTP error when creating a new project: ${response2.status}`)
                  loadProjs.inf = new Objs.Error("creating a new project")
                }
                reloadScene()
              } catch (error) {
                console.error('Failed to create a new project:', error)
                loadProjs.inf = new Objs.Error("creating a new project")
                reloadScene()
              }
            },
          })
        ], {
          default: !hasprojs,
          open: true,
        })
      } catch (error) {
        console.error('Failed to fetch projects:', error)
        loadProjs.inf = new Objs.Error("loading projects")
      }
      reloadScene()
    })()
  }
  return loadProjs.inf
}

function loadShop() {
  if (!loadShop.inf) {
    loadShop.inf = new Objs.Loading("user shop info")
    ;(async () => {
      try {
        const response = await fetch(
          "/api/me",
          { headers: { Authorization: `Bearer ${getTok()}` } }
        )
        const data = await response.json()

        var orders = new Objs.Text("NothingYet", {
          text: "Nothing here yet!",
        })

        loadShop.inf = new Objs.Page("DashboardPage", [
          new Objs.Balance(data.balance, {
            zoom: true,
            scale: 1.35,
          }),
          new Objs.Page("OrdersPage", [
            new Objs.Text("Title", {
              text: "Your orders",
              text_size: 25,
              text_style: ["Bold"],
            }),
            orders,
          ], {
            scale: 0.95,
          }),
        ], {
          page_gap: 40,
          default: true,
          open: true,
          rot: 10,
        })
      } catch (error) {
        console.error('Failed to fetch user shop info:', error)
        loadShop.inf = new Objs.Error("loading user shop info")
      }
      reloadScene()
    })()
  }
  return loadShop.inf
}

function loadUserInfo() {
  if (!loadUserInfo.inf) {
    loadUserInfo.inf = new Objs.Loading("user info")
    ;(async () => {
      try {
        const response = await fetch(
          "/api/me",
          { headers: { Authorization: `Bearer ${getTok()}` } }
        )
        const data = await response.json()
        loadUserInfo.inf = new Objs.Page("UserInfo", [
          new Objs.Banner("Username", {
            text: data.github_username,
            text_size: 30,
            text_style: ["Bold", "Small Caps"],
            background_col: "#DC8ADD",
            x: -24, y: 10, rot: -2,
          }),
          new Objs.Text("IDs", {
            text: `Slack ID: ${data.slack_id}\nHackatime ID: ${data.hackatime_id}`,
            text_size: 8,
            x: 120, y: 10, rot: 4,
          }),
          new Objs.Text("Emails", {
            text: "Emails:\n"+data.emails.join('\n'),
          }),
        ], {
          open: true,
          page_gap: 10,
          page_direction: "Column"
        })
      } catch (error) {
        console.error('Failed to fetch user info:', error)
        loadUserInfo.inf = new Objs.Error("loading user info")
      }
      reloadScene()
    })()
  }
  return loadUserInfo.inf
}

var extra;
if (loggedIn()) {
  extra = {
    projects: ["Projects", [
      loadProjs,
    ]],
    shop: ["Shop", [
      new Objs.BasePage("Stage", [
        loadShop,
        new Objs.Page("ShopItemsPage", [
          new Objs.Shop("Test", {
            title: "Testing shop item!",
            desc: "This is a description of this test shop item",
            image_url: "/imgs/square.webp",
            hours: 15,
          }),
          new Objs.Shop("Test2", {
          }),
        ], {
          open: true,
          page_gap: 25,
          rot: -1,
        }),
      ], {
        open: true,
        page_gap: 180,
        page_direction: "Row",
      }),
    ]],
    settings: ["Settings", [
      new Objs.BasePage("Stage", [
        new Objs.Button("LogOut", {
          text: "Log Out",
          btn_onpress: ()=>{
            if (confirm("Are you sure you want to log out?")) {
              logout()
            }
          },
        }),
        loadUserInfo,
      ], {
        page_gap: 15,
        default: true,
        open: true,
      }),
    ]],
  }
} else {
  extra = {
    login: ["Log In", [
      new Objs.BasePage("Stage", [
        new Objs.Text("Text", {
          text: "Log in via hackatime",
        }),
        new Objs.Button("LogIn", {
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
    new Objs.BasePage("Stage", [
      new Objs.Page("TitlePage", [
        new Objs.Banner("Title", {
          text: "FPS",
          text_size: 32,
          width: 80,
          text_style: ["Italics", "Small Caps"],
        }),
        new Objs.Banner("Banner", {
          text: "STATUS: Not running... yet",
          background_col: "#EDC",
          width: 350,
          height: 70,
        }),
        new Objs.Image("BannerImage", {
          url: "/imgs/square.webp",
          alt: "A cute kitten!",
        }),
        new Objs.Text("Help", {
          text: "Press an object in the menu!",
        }),
      ], {
        x: -60, rot: 6, scale: 1.2,
        page_gap: 10,
        default: true,
      }),
      new Objs.Page("AboutPage", [
        new Objs.Section("WhatIsThis", {
          text: "This is a Hack Club YSWS where YOU create something cool for a game and WE give you games & merch!",
          max_width: 500,
        }),
        new Objs.FAQ("IsThisReal", {
          question: "Is this for real?",
          answer: "Yup! Hack Club is a non-profit organisation and a community of 100k+ teenage makers, and we do these kinds of things all the time!",
          width: 600,
        }),
        new Objs.Link("HackClubWebsite", {
          text: "Link to the Hack Club website!",
          url: "https://hackclub.com/",
          x: -66, rot: -2,
        }),
        new Objs.Link("HackClubSlack", {
          text: "Link to the Hack Club slack!\nFind this on the #fps channel!",
          url: "https://hackclub.com/slack",
          x: 84, rot: 2,
        }),
        new Objs.FAQ("WhatDoYouMean", {
          question: "What do you mean, 'something cool for a game'?",
          answer: `Whatever you like! It could be something simple like a sound effect creator, terrain generator, or something more complex like a physics engine.
Basically if it is used in the production of a game you'll be fine.
Build it however complex or easy as you want! You can build everything yourself or use libraries - it's up to you!`,
          width: 600,
        }),
        new Objs.FAQ("DoIHaveToBeGood", {
          question: "Do I have to be good at programming?",
          answer: "Not very, you are free to do whatever difficulty project you want to! And if you want to try something harder or are struggling, feel free to ask on the Slack channel #fps for any help (or just on Slack in general, everyone's pretty nice), we'd love to help you!",
          width: 600,
        }),
        new Objs.Page("ExtraLinks", [
          new Objs.Link("FufillmentBounty", {
            text: "Fulfillment bounty form (if I'm too slow giving prizes)",
            url: "https://forms.hackclub.com/bounty",
            y: -6, rot: -1,
          }),
          new Objs.Link("TOS", {
            text: "Terms of Service",
            url: "https://hackclub.com/privacy-and-terms#hack-club-privacy-notice",
            x: -18, rot: -4,
          }),
          new Objs.Link("PrivacyPolicy", {
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
      new Objs.Page("GetStartedSection", [
        new Objs.Text("Title", {
          text: "Get Started",
          text_style: ["Bold"],
          text_size: 34,
        }),
        new Objs.Background("Background", {
          width: 300,
        }),
        new Objs.Section("WhoCanJoin", {
          text: "This is for anyone aged 13-18 (inclusive)",
        }),
        new Objs.Section("HowToStart", {
          // TODO: Finish this and add a link to Slack
          text: "To get started, join the #fps channel on the Hack Club Slack!",
          max_width: 500,
        }),
        new Objs.Page("HowToUseThis", [
          new Objs.Text("Title", {
            text: "How to navigate this",
            text_style: ["Bold"],
            text_size: 22,
          }),
          new Objs.Section("NavigationTips", {
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
      new Objs.Text("MadeWith<3", {
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
    new Objs.BasePage("Stage", [
      new Objs.Page("404Page", [
        new Objs.Banner("Whoops", {
          text: "Whoops!",
          text_size: 32,
          width: 270,
          text_style: ["Italics"],
        }),
        new Objs.Text("Text", {
          text: "You seem to have gotten lost, as this page is not accessible for you.\n\
Maybe try going home?",
          max_width: 200,
        }),
      ], {
        open: true, default: true,
      }),
    ], { open: true, }),
  ]],
...extra, ...adminExtra }

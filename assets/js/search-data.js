// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-bricks",
          title: "bricks",
          description: "Because Writing Code Was Only the Easy Part",
          section: "Navigation",
          handler: () => {
            window.location.href = "/bricks/";
          },
        },{id: "nav-bookshelf",
          title: "bookshelf",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/books/";
          },
        },{id: "nav-projects",
          title: "projects",
          description: "A growing collection of your cool projects.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-repositories",
          title: "repositories",
          description: "Showcase of my public repositories — note that the experience level here isn&#39;t fully representative 😜. For a more accurate information, please refer to my resume.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/repositories/";
          },
        },{id: "nav-resume",
          title: "resume",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/resume/";
          },
        },{id: "post-utrecht-afghaana-jan-2025",
        
          title: "Utrecht Afghaana, Jan 2025",
        
        description: "Snapshots I captured during my last visit to Utrecht!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/utrecht-afghaana-jan-2025/";
          
        },
      },{id: "post-denhaag-mauritshuis-jan-2025",
        
          title: "Denhaag Mauritshuis, Jan 2025",
        
        description: "Snapshots I captured during my last visit to Denhaag!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/denhaag-mauritshuis-jan-2025/";
          
        },
      },{id: "post-cologne-cathedral-december-2024",
        
          title: "Cologne Cathedral, December 2024",
        
        description: "My top picks from exploring the stunning Cologne Cathedral in Germany",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/cologne-cathedral-december-2024/";
          
        },
      },{id: "post-trace-zero",
        
          title: "Trace Zero",
        
        description: "A new year is approaching—hard to believe it’s already 2025. My mind still lingers in 2020, but here we are. So, why not celebrate?",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/trace-zero/";
          
        },
      },{id: "post-amsterdam-may-2024",
        
          title: "Amsterdam, May 2024",
        
        description: "Snapshots my friend and I captured during our last trip to Amsterdam!",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2024/amsterdam-may-2024/";
          
        },
      },{id: "bricks-bubble-sort",
          title: 'Bubble Sort',
          description: "The Sorting Algorithm That Sorts... Eventually!",
          section: "Bricks",handler: () => {
              window.location.href = "/bricks/algorithms/bubble-sort/";
            },},{id: "bricks-queue",
          title: 'Queue',
          description: "Because Waiting in Line Should Be a Data Structure, Too",
          section: "Bricks",handler: () => {
              window.location.href = "/bricks/data-structures/queue/";
            },},{id: "bricks-stack",
          title: 'Stack',
          description: "When You Can’t Remember Anything Except the Last Thing You Did",
          section: "Bricks",handler: () => {
              window.location.href = "/bricks/data-structures/stack/";
            },},{id: "bricks-introduction-to-dns",
          title: 'Introduction to DNS',
          description: "The phone book of the internet is basically a DNS.",
          section: "Bricks",handler: () => {
              window.location.href = "/bricks/dns/dns-introduction/";
            },},{id: "bricks-introduction",
          title: 'Introduction',
          description: "Introduction to graph theory",
          section: "Bricks",handler: () => {
              window.location.href = "/bricks/graph-theory/introduction/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%69%6D%68%61%6C%61%77%61@%6F%75%74%6C%6F%6F%6B.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-instagram',
        title: 'Instagram',
        section: 'Socials',
        handler: () => {
          window.open("https://instagram.com/im.halawa", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/imhalawa", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];

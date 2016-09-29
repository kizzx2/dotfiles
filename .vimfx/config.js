const {classes: Cc, interfaces: Ci} = Components;
const Ss = Services.search;
const {commands} = vimfx.modes.normal;

(function() {
  function quickmark(name, shortcut, url) {
    vimfx.addCommand({
      name: `quickmark_${name}`,
      description: `Open quickmark ${name}`,
    }, function({vim}) {
      vim.window.gBrowser.loadOneTab(url, { inBackground: false });
    })
    vimfx.set(`custom.mode.normal.quickmark_${name}`, shortcut);
  }

  quickmark('lastpass', 'chrome://lastpass/content/home2.xul', 'gnl');
  quickmark('umatrix_dashboard','chrome://umatrix/content/dashboard.html#user-rules', 'gnu');
})

vimfx.addCommand({
  name: 'goto_tab',
  description: 'Goto tab',
  category: 'tabs',
}, function(args) {
  commands.focus_location_bar.run(args);
  args.vim.window.gURLBar.value = '% ';
});
vimfx.set('custom.mode.normal.goto_tab', 'b');

// Because I want to use the GET version of Startpage and the official Search Engine addon only does POST
(function() {
  let startpage = Ss.getEngineByName('Startpage HTTPS');
  if(startpage)
    Ss.removeEngine(startpage);

  Ss.addEngineWithDetails('Startpage HTTPS', 'https://www.startpage.com/sp-favicon.ico', null, "Startpage HTTPS", 'get', 'https://startpage.com/do/search?cmd=process_search&language=english&query={searchTerms}');
  Ss.currentEngine = Ss.getEngineByName('Startpage HTTPS');
})();

// Implement Vimperator's <C-6> feature
(function() {
  vimfx.on('TabSelect', function({event}) {
    const tabs = event.target.parentNode;
    const history = tabs.getUserData('k2TabHistory') || [];

    history.push(tabs.selectedIndex);
    if(history.length > 2)
      history.splice(0, history.length - 2);
    tabs.setUserData('k2TabHistory', history);
  });

  vimfx.addCommand({
    name: 'alternate_tab',
    description: 'Goto alternate tab',
    category: 'tabs'
  }, function({ vim }) {
    const tabs = vim.window.gBrowser.tabContainer;
    const history = tabs.getUserData('k2TabHistory') || [];
    if(history.length == 2)
      tabs.selectedIndex = history[0];
  });
  vimfx.set('custom.mode.normal.alternate_tab', '<c-6>');
})();

import {remote, desktopCapturer} from 'electron';

export const setContextmenu = () => {
    const Menu = remote.Menu;
    const MenuItem = remote.MenuItem;
    const menu = new Menu();
    menu.append(new MenuItem({
        label: '复制(copy)',
        accelerator: 'CmdOrCtrl+C',
        role: 'copy'
    },));
    menu.append(new MenuItem({
        label: '粘贴(paste)',
        accelerator: 'CmdOrCtrl+V',
        role: 'paste'
    }));
    menu.append(new MenuItem({type: 'separator'}));
    menu.append(new MenuItem({
        label: '切换开发者工具(toggleDevTools)',
        accelerator: (function () {
            if (process.platform === 'darwin') {
                return 'Alt+Command+I'
            } else {
                return 'Ctrl+Shift+I'
            }
        })(),
        click: function (item, focusedWindow) {
            console.log(item);
            if (focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        },
    },));
    (window || global).addEventListener('contextmenu', function (e) {
        e.preventDefault();
        menu.popup(remote.getCurrentWindow());
    }, false);
};

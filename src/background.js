'use strict';

import {app, protocol, BrowserWindow, ipcMain, screen, Menu, dialog, Tray} from 'electron';

import {createProtocol, installVueDevtools} from 'vue-cli-plugin-electron-builder/lib';

import electronLog from 'electron-log';

const isDevelopment = process.env.NODE_ENV !== 'production';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{scheme: 'app', privileges: {secure: true, standard: true}}]);

function createWindow() {
	// Create the browser window.
	let size = screen.getPrimaryDisplay().workAreaSize;
	let width = parseInt(size.width * 0.45);
	let height = parseInt(size.height * 0.45);
	electronLog.info('CreateWindow!');
	win = new BrowserWindow({
		width,
		height,
		useContentSize: true,
		webPreferences: {nodeIntegration: true},
		icon: 'src/assets/images/main.ico',
		// 隐藏菜单
		autoHideMenuBar: true,
		//win隐藏导航栏
		// titleBarStyle: 'hidden',
		//mac隐藏导航栏
		// frame: false,
	});

	if (process.env.WEBPACK_DEV_SERVER_URL) {
		// Load the url of the dev server if in development mode
		win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
		// if (!process.env.IS_TEST) win.webContents.openDevTools()
	} else {
		createProtocol('app');
		// Load the index.html when not in development
		win.loadURL('app://./index.html');
	}

	win.on('closed', () => {
		win = null;
	});
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		createWindow();
	}
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
	if (isDevelopment && !process.env.IS_TEST) {
		// Install Vue Devtools
		// Devtools extensions are broken in Electron 6.0.0 and greater
		// See https://github.com/nklayman/vue-cli-plugin-electron-builder/issues/378 for more info
		// Electron will not launch with Devtools extensions installed on Windows 10 with dark mode
		// If you are not using Windows 10 dark mode, you may uncomment these lines
		// In addition, if the linked issue is closed, you can upgrade electron and uncomment these lines
		try {
			await installVueDevtools();
		} catch (e) {
			console.error('Vue Devtools failed to install:', e.toString());
		}
	}
	createWindow();
	//创建任务栏图标、菜单
	const tray = new Tray('src/assets/images/main.ico');
	const trayContextMenu = Menu.buildFromTemplate([
		{
			label: '打开',
			click: () => {
				win.show();
			},
		},
		{
			label: '退出',
			click: () => {
				app.quit();
			},
		},
	]);

	tray.setToolTip('myApp');
	tray.on('click', () => {
		win.show();
	});
	tray.on('right-click', () => {
		tray.popUpContextMenu(trayContextMenu);
	});
});

// ...创建窗口，监听ready
ipcMain.on('changeWindowSize', (event, arg) => {
	win && win.setSize(arg.width, arg.height);
	// createWindow();
	// mainWindow为主进程new的BrowserWindow实例
});

ipcMain.on('openErrorDialog', (event, arg) => {
	dialog.showErrorBox(arg.title, JSON.stringify(arg.content));
});

//设置菜单
const isMac = process.platform === 'darwin';
const template = [
	// { role: 'appMenu' }
	...(isMac
		? [
				{
					label: app.name,
					submenu: [
						{role: 'about'},
						{type: 'separator'},
						{role: 'services'},
						{type: 'separator'},
						{role: 'hide'},
						{role: 'hideothers'},
						{role: 'unhide'},
						{type: 'separator'},
						{role: 'quit'},
					],
				},
		  ]
		: []),
	{
		label: '编辑',
		submenu: [
			{label: '撤销', role: 'undo'},
			{label: '重做', role: 'redo'},
			{type: 'separator'},
			{label: '剪切', role: 'cut'},
			{label: '复制', role: 'copy'},
			{label: '粘贴', role: 'paste'},
			...(isMac
				? [
						{role: 'pasteAndMatchStyle'},
						{label: '删除', role: 'delete'},
						{label: '选择全部', role: 'selectAll'},
						{type: 'separator'},
						{
							label: 'Speech',
							submenu: [{role: 'startspeaking'}, {role: 'stopspeaking'}],
						},
				  ]
				: [
						{label: '删除', role: 'delete'},
						{type: 'separator'},
						{label: '选择全部', role: 'selectAll'},
				  ]),
		],
	},
	// { role: 'viewMenu' }
	{
		label: '视图',
		submenu: [
			{label: '重新加载', role: 'reload'},
			// {label: '强制重新加载(forcereload)', role: 'forcereload'},
			{
				label: '切换开发者工具(toggleDevTools)',
				accelerator: (function () {
					if (process.platform === 'darwin') {
						return 'Alt+Command+I';
					} else {
						return 'Ctrl+Shift+I';
					}
				})(),
				click: function (item, focusedWindow) {
					if (focusedWindow) {
						focusedWindow.toggleDevTools();
					}
				},
			},
			{type: 'separator'},
			{label: '切换全屏', role: 'togglefullscreen'},
		],
	},
	{
		label: '窗口(screen)',
		submenu: [
			{label: '重置窗口', role: 'resetzoom'},
			{label: '放大窗口', role: 'zoomin'},
			{label: '缩小窗口', role: 'zoomout'},
			{type: 'separator'},
			{
				label: '最小化',
				accelerator: 'CmdOrCtrl+M',
				role: 'minimize',
			},
			{
				label: '关闭',
				accelerator: 'CmdOrCtrl+W',
				role: 'close',
			},
			{
				type: 'separator',
			},
		],
	},
];
const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
	if (process.platform === 'win32') {
		process.on('message', (data) => {
			if (data === 'graceful-exit') {
				app.quit();
			}
		});
	} else {
		process.on('SIGTERM', () => {
			app.quit();
		});
	}
}

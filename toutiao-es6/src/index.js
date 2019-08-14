import * as utils from './utils';
import components from './items';
import './css/index.css';

const THRESHOLD = 50;

let app = null;

class App {
    constructor($root) {
        this.$root = $root;
    }

    init() {
        this.appendData();
        this.actionOnReachBottom(this.appendData.bind(this));
    }

    getData() {
        return utils.request({
            url: '/list'
        }).then(res => {
            localStorage.setItem('toutiaoData', JSON.stringify(res));
            return res;
        }).catch(err => {
            return JSON.parse(localStorage.getItem('toutiaoData') || '{}');
        });
    }

    appendData() {
        this.getData().then((res) => {
            let items = res.data;
            let Component;
            items.forEach(item => {
                const type = item.type;
                Component = Object.entries(components).find(entry => (entry[0].toLowerCase() == type.toLowerCase()))[1];
                const currentComponent = new Component(item);
                const element = currentComponent.constructElement();
                this.$root.append(element);
            });
        });
    }

    actionOnReachBottom(callback = () => { }) {
        window.onscroll = () => {
            const offsetHeight = document.documentElement.offsetHeight;
            const screenHeight = window.screen.height;
            const scrollY = window.scrollY;
            const gap = offsetHeight - screenHeight - scrollY;
            if (gap < THRESHOLD) {
                callback();
            }
        };
    }

    static getInstance($root) {
        if (app === null) {
            app = new App($root);
        }
        return app;
    }
}

const $root = document.getElementById('root');
const appInstance = App.getInstance($root);
appInstance.init();

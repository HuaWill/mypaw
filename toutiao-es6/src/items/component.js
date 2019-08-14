export default class Component {

    constructor(props) {
        this.props = props;
    }

    render() {
        return '<div>null</div>';
    }

    constructElement() {
        const html = this.render();
        const $content = document.createElement('div');
        const $container = document.createElement('div');
        $container.appendChild($content);
        $content.outerHTML = html;
        this.el = $container.firstChild;
        return this.el;
    }
}
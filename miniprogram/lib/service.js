(function (global) {
  // let wx = {};
  const classMap = {};

  class Logic {

    uniqueId = 0;

    init() {
      const firstPageUri = window.appJSON && window.appJSON.pages && window.appJSON.pages[0];
      if (!!firstPageUri) {
        this.navigateTo(firstPageUri);
      }
    }

    _generateUniqueId() {
      return `id-${++this.uniqueId}`;
    }

    navigateTo(uri) {
      const PageClass = classMap[uri];
      new PageClass(this._generateUniqueId(), uri);
    }
  }

  class PageBase {

    constructor(id, uri) {
      this.uri = uri;
      this.id = id;
      this._initData();
      this._render().then(() => {
        // component通过iframe被插入到页面，触发componentDidMount事件。
        window.__bridge.postMessage(this.$el, {
          type: 'componentDidMount',
          data: this.data
        });
      });
    }

    // deep clone的简单实现，防止prototype上的data被篡改
    _initData() {
      this.data = JSON.parse(JSON.stringify(this.data || {}));
    }

    // 创建iframe，src指向具体的component
    _render() {
      return window.__bridge.createView(this.id, this.componentUri).then((frame) => {
        this.$el = frame;
      });
    }
  }

  const createPageClass = options => {
    class Page extends PageBase {
      constructor(...args) {
        super(...args);
      }
    }
    Object.assign(Page.prototype , options);

    return Page;
  }

  const Page = (uri, options) => {
    classMap[uri] = createPageClass(options);
  }

  global.Page = Page;

  global.logic = new Logic();

})(window);

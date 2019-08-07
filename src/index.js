(function () {
  /**
   * Parent for both Monster and Hero
   * 
   * @param {*} context 
   * @param {*} imageSrc 
   * @param {*} imagePosition 
   * @param {*} rect 
   */
  function Sprite(context, imageSrc, imagePosition, rect) {
    this.context = context;
    this.imageSrc = imageSrc;
    this.imagePosition = imagePosition;
    this.rect = rect;
  }

  Sprite.prototype.draw = function () {
    let { x: imgX, y: imgY, width: imgW, height: imgH } = this.imagePosition;
    let { x: recX, y: recY, width: recW, height: recH } = this.rect;
    this.context.drawImage(this.imageSrc, imgX, imgY, imgW, imgH, recX, recY, recW, recH);
  }

  /**
   * Monster Definition
   */
  function Monster() {
    Sprite.apply(this, Array.prototype.slice.call(arguments));
  }

  Monster.prototype = Object.create(Sprite.prototype);
  Monster.prototype.constructor = Monster;
  Monster.prototype.awayFrom = function (heroRect) {
    let { x: monsterX, y: monsterY, height: monsterH, width: monsterW } = this.rect;
    let { x: heroX, y: heroY, height: heroH, width: heroW } = heroRect;
    let distanceX = heroX - monsterX;
    let distanceY = heroY - monsterY;

    return distanceX <= -heroW ||       /* 英雄在魔王左侧 */
      distanceX >= monsterW ||    /* 英雄在魔王右侧 */
      distanceY <= -heroH ||    /* 英雄在魔王上方 */
      distanceY >= monsterH   /* 英雄在魔王下方 */
  }

  /**
   * Hero Definition
   */
  function Hero() {
    Sprite.apply(this, Array.prototype.slice.call(arguments));
  }

  Hero.prototype = Object.create(Sprite.prototype);
  Hero.prototype.constructor = Hero;
  Hero.prototype.clear = function () {
    let { x, y, width, height } = this.rect;
    this.context.clearRect(x, y, width, height);
  }
  Hero.prototype.canMoveUp = function (monsters, step) {
    let can = false;
    let { y } = this.rect;
    if (y - step >= 0) {    // 英雄往上不会移出画布
      can = monsters.every(monster => monster.awayFrom(Object.assign({}, this.rect, { y: y - step })));
    }

    return can;
  }
  Hero.prototype.canMoveDown = function (monsters, step) {
    let can = false;
    let { y, height } = this.rect;
    let { height: canvasH } = this.context.canvas;
    if (y + height + step <= canvasH) {    // 英雄往下不会移出画布
      can = monsters.every(monster => monster.awayFrom(Object.assign({}, this.rect, { y: y + step })));
    }

    return can;
  }
  Hero.prototype.canMoveLeft = function (monsters, step) {
    let can = false;
    let { x } = this.rect;
    if (x - step >= 0) {    // 英雄往左不会移出画布
      can = monsters.every(monster => monster.awayFrom(Object.assign({}, this.rect, { x: x - step })));
    }

    return can;
  }
  Hero.prototype.canMoveRight = function (monsters, step) {
    let can = false;
    let { x, width } = this.rect;
    let { width: canvasW } = this.context.canvas;

    if (x + width + step <= canvasW) {  // 英雄往右不会移出画布
      can = monsters.every(monster => monster.awayFrom(Object.assign({}, this.rect, { x: x + step })));
    }

    return can;
  }



  const prepare = () => {
    /**
     * common function to load image
     * @param {*} img 
     * @param {*} src 
     */
    const imgTask = (img, src) => {
      return new Promise(function (resolve, reject) {
        img.onload = resolve;
        img.onerror = reject;
        img.src = src;
      });
    };

    const context = document.getElementById('content').getContext('2d');
    const heroImg = new Image();
    const allSpriteImg = new Image();

    const allresourceTask = Promise.all([
      imgTask(heroImg, '../images/hero.png'),
      imgTask(allSpriteImg, '../images/all.jpg'),
    ]);

    return {
      /**
       * @param {Function} [callback] - 当准备好了之后要调用的回掉函数
       */
      getResource(callback) {
        allresourceTask.then(function () {
          callback && callback(context, heroImg, allSpriteImg);
        });
      }
    };
  }

  const drawMonsters = (context, imageSrc) => {
    /**
     * Monster definition for canvas
     */
    const COMMON_MONSTER_DEFINITION = {
      imgPosition: {
        x: 858,
        y: 529,
        width: 32,
        height: 32
      },
      rect: {
        width: 40,
        height: 40
      }
    }

    const m1 = new Monster(context, imageSrc, COMMON_MONSTER_DEFINITION.imgPosition, Object.assign({}, COMMON_MONSTER_DEFINITION.rect, { x: 60, y: 60 }));
    const m2 = new Monster(context, imageSrc, COMMON_MONSTER_DEFINITION.imgPosition, Object.assign({}, COMMON_MONSTER_DEFINITION.rect, { x: 160, y: 160 }));
    const m3 = new Monster(context, imageSrc, COMMON_MONSTER_DEFINITION.imgPosition, Object.assign({}, COMMON_MONSTER_DEFINITION.rect, { x: 260, y: 260 }));
    const monsters = [m1, m2, m3];

    monsters.forEach(monster => monster.draw());

    return monsters;
  }

  const drawHero = (context, imageSrc) => {
    const h = new Hero(
      context,
      imageSrc, {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      }, {
        x: 250,
        y: 150,
        width: 40,
        height: 40
      });

      h.draw();
      return h;
  }

  const KEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39
  }

  prepare().getResource((context, heroImg, allSpriteImg) => {
    let hero = drawHero(context, heroImg);
    let monsters = drawMonsters(context, allSpriteImg);
    let step = 10;

    document.body.addEventListener('keyup', (evt) => {
      switch (evt.keyCode) {
        case KEY.UP:
          if (hero.canMoveUp(monsters, step)) {
            hero.clear();
            hero.rect.y -= step;
          }
          break;
        case KEY.DOWN:
          if (hero.canMoveDown(monsters, step)) {
            hero.clear();
            hero.rect.y += step;
          }
          break;
        case KEY.LEFT:
          if (hero.canMoveLeft(monsters, step)) {
            hero.clear();
            hero.rect.x -= step;
          }
          break;
        case KEY.RIGHT:
          if (hero.canMoveRight(monsters, step)) {
            hero.clear();
            hero.rect.x += step;
          }
          break;
        default:
          // nothing happen here
          break;
      }

      hero.draw();
    });
  });
})();
(function () {
  /**
   * Parent for both Monster and Hero
   * 
   * @param {*} context 
   * @param {*} image 
   * @param {*} imagePosition 
   * @param {*} canvasRect 
   */
  function Sprite(context, image, imagePosition, canvasRect) {
    this.context = context;
    this.image = image;
    this.imagePosition = imagePosition;
    this.canvasRect = canvasRect;
  }

  Sprite.prototype.draw = function () {
    let { x: imgX, y: imgY, width: imgW, height: imgH } = this.imagePosition;
    let { x: recX, y: recY, width: recW, height: recH } = this.canvasRect;
    this.context.drawImage(this.image, imgX, imgY, imgW, imgH, recX, recY, recW, recH);
  }
  Sprite.prototype.clear = function () {
    let { x, y, width, height } = this.canvasRect;
    this.context.clearRect(x, y, width, height);
  }
  Sprite.prototype.hurt = function (attack) {
    this.attr.bloodVolumn -= (this.attr.dead ? 0 : Math.max(attack - this.attr.defense, 0));
    return this.attr.bloodVolumn;
  }

  /**
   * Monster Definition
   */
  function Monster(props) {
    Sprite.call(this, props.context, props.image, props.imagePosition, props.canvasRect);
    this.attr = props.attr;
  }

  Monster.prototype = Object.create(Sprite.prototype);
  Monster.prototype.constructor = Monster;
  Monster.prototype.awayFrom = function (heroRect) {
    let { x: monsterX, y: monsterY, height: monsterH, width: monsterW } = this.canvasRect;
    let { x: heroX, y: heroY, height: heroH, width: heroW } = heroRect;
    let distanceX = heroX - monsterX;
    let distanceY = heroY - monsterY;

    return this.attr.dead ||    /* 魔王已经挂了 */
      (distanceX <= -heroW ||   /* 英雄在魔王左侧 */
      distanceX >= monsterW ||  /* 英雄在魔王右侧 */
      distanceY <= -heroH ||    /* 英雄在魔王上方 */
      distanceY >= monsterH)    /* 英雄在魔王下方 */
  }
  Monster.prototype.attacked = function (attack) {
    let blood = this.hurt(attack);
    if (blood <= 0) {
      this.attr.dead = true;
      this.clear();
    }
  }

  /**
   * Hero Definition
   */
  function Hero(props) {
    Sprite.call(this, props.context, props.image, props.imagePosition, props.canvasRect);
    this.attr = props.attr;
  }

  Hero.prototype = Object.create(Sprite.prototype);
  Hero.prototype.constructor = Hero;
  Hero.prototype.canMoveUp = function (monsters, step) {
    let can = false;
    let { y } = this.canvasRect;
    if (y - step >= 0) {    // 英雄往上不会移出画布
      can = monsters.every(monster => monster.awayFrom(Object.assign({}, this.canvasRect, { y: y - step })));
    }

    return can;
  }
  Hero.prototype.canMoveDown = function (monsters, step) {
    let can = false;
    let { y, height } = this.canvasRect;
    let { height: canvasH } = this.context.canvas;
    if (y + height + step <= canvasH) {    // 英雄往下不会移出画布
      can = monsters.every(monster => monster.awayFrom(Object.assign({}, this.canvasRect, { y: y + step })));
    }

    return can;
  }
  Hero.prototype.canMoveLeft = function (monsters, step) {
    let can = false;
    let { x } = this.canvasRect;
    if (x - step >= 0) {    // 英雄往左不会移出画布
      can = monsters.every(monster => monster.awayFrom(Object.assign({}, this.canvasRect, { x: x - step })));
    }

    return can;
  }
  Hero.prototype.canMoveRight = function (monsters, step) {
    let can = false;
    let { x, width } = this.canvasRect;
    let { width: canvasW } = this.context.canvas;

    if (x + width + step <= canvasW) {  // 英雄往右不会移出画布
      can = monsters.every(monster => monster.awayFrom(Object.assign({}, this.canvasRect, { x: x + step })));
    }

    return can;
  }
  Hero.prototype.findMonsterAttackable = function (monsters) {
    let monster = monsters && monsters.find((monster) => {
      let { x: heroX, y: heroY, width: heroW, height: heroH } = this.canvasRect;
      let { x: monsterX, y: monsterY, width: monsterW, height: monsterH } = monster.canvasRect;
      let diffX = Math.abs(heroX - monsterX);
      let diffY = Math.abs(heroY - monsterY);

      return ((heroY >= monsterY && heroY + heroH <= monsterY + monsterH) /* horizontally */ && (diffX === heroW || diffX === monsterW)) ||
        ((heroX <= monsterX && heroX + heroW <= monsterX + monsterW) /* vertically */ && (diffY === heroH || diffY === heroH));
    });

    return monster;
  }
  Hero.prototype.attack = function (monsters) {
    let monster = this.findMonsterAttackable(monsters);
    monster && monster.attacked(this.attr.attack);
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

  const drawMonsters = (context, image) => {
    /**
     * Monster definition for canvas
     */
    const COMMON_MONSTER_DEFINITION = {
      imagePosition: {
        x: 858,
        y: 529,
        width: 32,
        height: 32
      },
      canvasRect: {
        width: 40,
        height: 40
      },
      attr: {
        bloodVolumn: 100,
        attack: 10,
        defense: 10
      }
    }

    SUPER_MONSTER_DEFINITION = {
      imagePosition: {
        x: 858,
        y: 497,
        width: 32,
        height: 32
      },
      canvasRect: {
        width: 48,
        height: 48
      },
      attr: {
        bloodVolumn: 200,
        attack: 20,
        defense: 20
      }
    };

    const m1 = new Monster({
      context,
      image,
      imagePosition: COMMON_MONSTER_DEFINITION.imagePosition,
      canvasRect: Object.assign({}, COMMON_MONSTER_DEFINITION.canvasRect, { x: 20, y: 240 }),
      attr: Object.assign({}, COMMON_MONSTER_DEFINITION.attr, {bloodVolumn: 110})
    });

    const m2 = new Monster({
      context,
      image,
      imagePosition: COMMON_MONSTER_DEFINITION.imagePosition,
      canvasRect: Object.assign({}, COMMON_MONSTER_DEFINITION.canvasRect, { x: 220, y: 120 }),
      attr: Object.assign({}, COMMON_MONSTER_DEFINITION.attr, {bloodVolumn: 120})
    });

    const m3 = new Monster({
      context,
      image,
      imagePosition: COMMON_MONSTER_DEFINITION.imagePosition,
      canvasRect: Object.assign({}, COMMON_MONSTER_DEFINITION.canvasRect, { x: 440, y: 20 }),
      attr: Object.assign({}, COMMON_MONSTER_DEFINITION.attr, {bloodVolumn: 130})
    });

    const m4 = new Monster({
      context,
      image,
      imagePosition: SUPER_MONSTER_DEFINITION.imagePosition,
      canvasRect: Object.assign({}, SUPER_MONSTER_DEFINITION.canvasRect, { x: 440, y: 240 }),
      attr: SUPER_MONSTER_DEFINITION.attr
    });

    const monsters = [m1, m2, m3, m4];

    monsters.forEach(monster => monster.draw());

    return monsters;
  }

  const drawHero = (context, image) => {
    const hero = new Hero({
      context,
      image,
      imagePosition: {
        x: 0,
        y: 0,
        width: 32,
        height: 32
      },
      canvasRect: {
        x: 20,
        y: 20,
        width: 40,
        height: 40
      },
      attr: {
        bloodVolumn: 100,
        attack: 30,
        defense: 10
      }
    });

    hero.draw();
    return hero;
  }

  const KEY = {
    UP: 38,
    DOWN: 40,
    LEFT: 37,
    RIGHT: 39,
    ATTACK: 65
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
            hero.canvasRect.y -= step;
          }
          break;
        case KEY.DOWN:
          if (hero.canMoveDown(monsters, step)) {
            hero.clear();
            hero.canvasRect.y += step;
          }
          break;
        case KEY.LEFT:
          if (hero.canMoveLeft(monsters, step)) {
            hero.clear();
            hero.canvasRect.x -= step;
          }
          break;
        case KEY.RIGHT:
          if (hero.canMoveRight(monsters, step)) {
            hero.clear();
            hero.canvasRect.x += step;
          }
          break;
        case KEY.ATTACK:
          hero.attack(monsters);
          break;
        default:
          // nothing happen here
          break;
      }

      hero.draw();
    });
  });
})();
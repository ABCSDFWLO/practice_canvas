const kineticCanvas = document.getElementById("kinetic");
const staticCanvas = document.getElementById("static");
const scoreDisplay = document.getElementById("score");
const btn1 = document.getElementById("btn1");
let theme = 'default';
let raf = 0;
let scoreTimer = 0;
let isPaused = true;


const player = new function(x = 200, y = 200, dir = 0, v = 0, w = 0) {
  this.x = x;
  this.y = y;
  this.dir = dir;
  this.v = v;
  this.w = w;

  this.vControling = false;
  this.wControling = false;

  this.VLIMIT = 3;
  this.WLIMIT = Math.PI * 0.03;
  this.VACC = 0.5;
  this.WACC = Math.PI * 0.005;

  this.LINEWIDTH = 7;
  this.SIZERADIUS = 7;
  this.fillStyle = {
    'default': 'white',
    'dark': 'black',
  }
  this.strokeStyle = {
    'default': 'black',
    'dark': 'white',
  }

  this.size = this.SIZERADIUS;
  this.id = 'player';
}();
player.angularAccel = function(angleDir) {
  if (this.w > -this.WLIMIT && this.w < this.WLIMIT) { this.w += angleDir * this.WACC; }
}
player.linearAccel = function(dir) {
  if (this.v > -this.VLIMIT && this.v < this.VLIMIT) { this.v += dir * this.VACC; }
}
player.move = function() {
  const rx = this.x - kineticCanvas.width / 2;
  const ry = this.y - kineticCanvas.height / 2;
  const rr = ring.INNERRADIUS - this.SIZERADIUS;
  const dx = Math.cos(this.dir) * this.v;
  const dy = Math.sin(this.dir) * this.v;
  const REPELNESS = 0.005;
  if (rx * rx + ry * ry > rr * rr && dx * rx + dy * ry > 0) {
    this.v = 0;
    this.x += -rx * REPELNESS;
    this.y += -ry * REPELNESS;
  }
  this.dir += this.w;
  this.x += dx;
  this.y += dy;
  if (!this.wControling) {
    if (this.w > 0) { this.w -= this.WACC; }
    else if (this.w < 0) { this.w += this.WACC; }
  }
  if (!this.vControling) {
    if (this.v > 0) { this.v -= this.VACC; }
    else if (this.v < 0) { this.v += this.VACC; }
  }
}
player.draw = function(ctx) {
  //transform
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.dir);
  //styles
  ctx.lineWidth = this.LINEWIDTH;
  ctx.strokeStyle = this.strokeStyle[theme];
  ctx.fillStyle = this.fillStyle[theme];
  //draw
  ctx.beginPath();
  ctx.moveTo(1.4142 * this.SIZERADIUS, 0);
  ctx.arc(0, 0, this.SIZERADIUS, Math.PI * 0.25, Math.PI * 1.75);
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
}

const ring = new function() {
  this.fillStyle = {
    'default': 'black',
    'dark': 'white',
  };
  this.INNERRADIUS = 170;
  this.LINEWIDTH = 10;

  this.id = 'ring';

  this.draw = function(ctx) {
    ctx.save();
    ctx.translate(kineticCanvas.width / 2, kineticCanvas.height / 2);

    ctx.fillStyle = this.fillStyle[theme];

    ctx.beginPath();
    ctx.arc(0, 0, this.INNERRADIUS + this.LINEWIDTH, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = background.color[theme];

    ctx.beginPath();
    ctx.arc(0, 0, this.INNERRADIUS, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}();

function Launcher(id, azimuth, declination, w) {
  this.RELOADFRAME = 5;
  this.ORBITRADIUS = 180;

  this.id = id;
  this.az = azimuth;
  this.df = declination;
  this.cooltime = this.RELOADFRAME + 1;

  this.w = w;

  this.x = kineticCanvas.width / 2 - (Math.cos(this.az) * this.ORBITRADIUS);
  this.y = kineticCanvas.height / 2 - (Math.sin(this.az) * this.ORBITRADIUS);
  this.visible = true;

  this.LINEWIDTH = [5, 0, 0];
  this.SIZERADIUS = [15, 10, 10];
  this.fillStyle = {
    'default': ['black', 'white', 'rgba(255,0,0,0.5)'],
    'dark': ['white', 'black', 'rgba(255,255,255,0.5)'],
  }
  this.strokeStyle = {
    'default': 'black',
    'dark': 'white',
  }

}
Launcher.prototype.launch = function() {
  const launchedBullet = BulletPool.pop(0);
  launchedBullet.x = this.x;
  launchedBullet.y = this.y;
  launchedBullet.dir = this.az + this.df;
  console.log("launched!");

}
Launcher.prototype.reload = function() {
  this.cooltime = this.RELOADFRAME;
}
Launcher.prototype.move = function(az, df, dw) {
  this.w += dw;
  this.az += az + this.w;
  this.df = df;
  this.x = kineticCanvas.width / 2 - (Math.cos(this.az) * this.ORBITRADIUS);
  this.y = kineticCanvas.height / 2 - (Math.sin(this.az) * this.ORBITRADIUS);
  if (this.cooltime <= this.RELOADFRAME && this.cooltime > 0) { this.cooltime--; }
  else if (this.cooltime === 0) {
    this.cooltime = this.RELOADFRAME + 1;
    this.launch();
  }
}
Launcher.prototype.draw = function(ctx) {
  if (this.visible) {
    //transform
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.az + this.df);
    //style--frame
    ctx.save();
    ctx.lineWidth = this.LINEWIDTH[0];
    ctx.strokeStyle = this.strokeStyle[theme];
    ctx.fillStyle = this.fillStyle[theme][0];
    //draw--frame
    ctx.beginPath();
    ctx.moveTo(1.4142 * this.SIZERADIUS[0], 0);
    ctx.arc(0, 0, this.SIZERADIUS[0], Math.PI * 0.25, Math.PI * 1.75);
    ctx.closePath();
    if (this.LINEWIDTH[0]) ctx.stroke();
    ctx.fill();
    ctx.restore();
    //style--inner
    ctx.save();
    ctx.lineWidth = this.LINEWIDTH[1];
    ctx.strokeStyle = this.strokeStyle[theme];
    ctx.fillStyle = this.fillStyle[theme][1];
    //draw--inner
    ctx.beginPath();
    ctx.arc(0, 0, this.SIZERADIUS[1], Math.PI * 0, Math.PI * 2);
    ctx.closePath();
    if (this.LINEWIDTH[1]) ctx.stroke();
    ctx.fill();
    ctx.restore();
    //style--cooltime
    ctx.save();
    ctx.lineWidth = this.LINEWIDTH[2];
    ctx.strokeStyle = this.strokeStyle[theme];
    ctx.fillStyle = this.fillStyle[theme][2];
    //draw--cooltime
    if (this.cooltime <= this.RELOADFRAME) {
      ctx.beginPath();
      ctx.arc(0, 0, this.SIZERADIUS[2] * ((this.RELOADFRAME - this.cooltime) / this.RELOADFRAME), Math.PI * 0, Math.PI * 2);
      ctx.closePath();
      if (this.LINEWIDTH[2]) ctx.stroke();
      ctx.fill();
    }
    ctx.restore();
    ctx.restore();
  }
}

const launchManager = new function() {

  this.launchers = [];
  this.patterns = {
    /*
    Pattern Rule
    * Level\Pattern\default,Step\spd,visible,interval,df,Launcher\spd,visible,interval,df,launch **Iterate
    1.최상위 인덱스는 난이도(Level)를 의미한다
    2.그 아래 인덱스는 그저 그 난이도(Level) 내에서 몇번 패턴(Pattern)인지를 나타낸다
    3.패턴 내에서 "default"는 모든 launcher들에 대한 기본값을 나타내며, transition()의 param가 된다.
    4.Step이란 패턴 내의 default나 iterate를 제외한 숫자들로, 패턴이 준비된 이후로부터 n프레임이 지났을 때 실행할 행동들에 대한 나열이다.
    ///5.halt는 패턴의 종료를 의미한다
    6.default나 패턴의 한 step의 바로 아래 단계에서 "spd", "visible", "interval", "df" 이 있을 수 있다.
      ;transition에서 가장 먼저 찾아보는 값이다, 일부나 전부가 없을 수도 있다. ; 근데 웬만하면 다 써주자
    7.위의 공통값과는 별개로 각 launcher의 index별로 개별적인 "spd", "visible", "interval", "df" 값이 있을 수 있다.
      ;전부 존재해야 하며, 위의 공통값과 다른 값이 설정되어 있다면, 그것을 무시하고 개별값을 덮어씌운다.
    8.default나 Step 아래의 visible의 값은 표시될 launcher의 개수이고, 그 안의 Launcher의 visible은 자신의 visible(true/false)를 나타낸다.
    9.launch는 Launcher 아래 단계에서만 존재하고, 값은 발사할 탄의 type이다.
    10.Iterate는 Pattern이나 다른 Iterate 아래 단계에 있어야 하며, Step보단 윗 단계에 위치해야 한다.
    11.Iterate는 [반복할 횟수,{ step 등의 object literal}]로 구성된다.
    12.Iterate는 두 프레임을 포함하며, 첫 프레임에서는 iterate의 시작을 알리고, 두번째 프레임에서는 반복할 내용을 11과 같이 적는다
    13.end는 가장 가까운 iterate의 한 번의 반복의 종료를 의미한다
      ;continue에 iterate의 후딜레이를 추가한 개념으로, 굳이 없어도 아무 지장이 없다
    */

    0: {
      0: {
        "default": {
          "spd": Math.PI * 0.005,
          "visible": 3,
          "interval": Math.PI * 2 / 3,
          "df": 0,
        },
        10: "iterate",
        11:[4, {
          80: {
            0: {
              "launch": 0,
            },
          },
          160: {
            1: {
              "launch": 0,
            },
          },
          240: {
            2: {
              "launch": 0,
            },
          },
        }],
        12:"halt",
      }
    },
    1: {

    },
    2: {

    },
  };
  this.level = 0;
  this.currentPattern = Math.trunc(Math.random() * 1);
  this.patternTimer = -1;
  this.iterateChecker = [];
  this.iterateTimer=[];

  this.isTransitioning = 0; //transition중일 때 transitionFrame부터 시작해서 0까지 값을 내립니다.
  this.transitionFrame = 5;


  for (let i = 0; i < 9; i++) {
    const newLauncher = new Launcher(i, i * 0.1 * Math.PI, 0, Math.PI * 0.005);
    this.launchers.push(newLauncher);
  }
}();
launchManager.transition = function(param) {
  if (this.isTransitioning) {
    if (param?.spd !== undefined && param?.spd !== null) {
      this.launchers.forEach(e => {
        const dw = (e.w - param.spd) / this.isTransitioning;
        if (dw > 0) {
          e.w - dw;
        }
      });
    }
    if (param?.interval !== undefined && param?.interval !== null) {
      const basis = this.launchers[0];
      this.launchers.forEach(e => {
        const daz = (e === basis) ? 0 : (e.az - basis.az - param.interval) / this.isTransitioning;
        if (daz > 0) {
          e.az - daz;
        }
      });
    }
    if (param?.df !== undefined && param?.df !== null) {
      this.launchers.forEach(e => {
        const ddf = (e.df - param.df) / this.isTransitioning;
        if (ddf > 0) {
          e.df - ddf;
        }
      });
    }
    if (param?.visible !== undefined && param?.visible !== null) {
      this.launchers.forEach(e => {
        if (this.isTransitioning === transitionFrame && e.id < param.visible) e.visible = true;
        else if (this.isTransitioning === 1) e.visible = false;
      });
    }
  }
}
launchManager.halt = function() {
  this.isTransitioning = this.transitionFrame;
  this.patternTimer = -1;
  this.iterateChecker.fill(0);
  this.currentPattern = Math.trunc(Math.random() * 1);
  //보너스 점수도 더해줘볼까 말까
}
launchManager.calculate=function(){
  const ptrn= this.patterns[this.level]?.[this.currentPattern];
  let iterateLevel=0;
  this.iterateChecker.forEach(e=>{iterateLevel=(e>0)?iterateLevel:iterateLevel+1;});
  if(!this.isTransitioning){
    if(iterateLevel>0 && this.iterateChecker[iterateLevel]>0)
    if(ptrn[this.patternTimer]==="halt"){
      this.halt();
      return null;
    }else if (ptrn[this.patternTimer]==="iterate"){
      this.iterateChecker[0]=ptrn[this.patternTimer+1][0];
    }else if (ptrn[this.patternTimer]===this.patternTimer){
      const step = ptrn[this.patternTimer];
      const basis=this.launchers[0];
      for (let i =0; i<9;i++){
        this.launchers[i].w=(step[i]?.spd)?step[i].spd:this.launchers[i].w;
        this.launchers[i].az=(basis.az+step[i]?.interval)?step[i].spd:this.launchers[i].w;
        this.launchers[i].df=(step[i]?.df)?step[i].df:this.launchers[i].df;
        this.launchers[i].visible=(step[i]?.visible)?step[i].visible:this.launchers[i].visible;
        if(step[i]?.launch){
          this.launchers[i].launch();
        }
      }
    }
    this.patternTimer++;
  }
}

function Bullet(x, y, dir, type, size, spd, index) {
  this.x = x;
  this.y = y;
  this.type = type;
  this.dir = dir;
  this.size = size;
  this.spd = spd;
  this.index = index;

  this.enabled = false;

  this.LINEWIDTH = 5;
  this.fillStyle = {
    'default': 'red',
    'dark': 'white',
  }
  this.strokeStyle = {
    'default': 'black',
    'dark': 'red',
  }
  return this;
}
Bullet.prototype.move = function() {
  if (this.enabled) {
    const dx = this.spd * Math.cos(this.dir);
    const dy = this.spd * Math.sin(this.dir)

    this.x += dx;
    this.y += dy;
    //console.log('x:'+this.x+',y:'+this.y);

    this.playerCollideCheck();
    this.outerRingCheck();
  }
}
Bullet.prototype.draw = function(ctx) {
  if (this.enabled) {
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.lineWidth = this.LINEWIDTH;
    ctx.fillStyle = this.fillStyle[theme];
    ctx.strokeStyle = this.strokeStyle[theme];

    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
Bullet.prototype.playerCollideCheck = function() {
  const dx = this.x - player.x;
  const dy = this.y - player.y;
  const rr = this.size + player.size;
  if (dx * dx + dy * dy < rr * rr) {
    console.log("collided!:player");
    BulletPool.return(this);
  }
}
Bullet.prototype.outerRingCheck = function() {
  const dx = this.x - kineticCanvas.width / 2;
  const dy = this.y - kineticCanvas.height / 2;
  const dr = ring.INNERRADIUS + ring.LINEWIDTH;
  if (dx * dx + dy * dy > dr * dr) {
    console.log("collided!:ring");
    BulletPool.return(this);
  }
}

const BulletPool = new function() {
  this.pool = [];
  this.all = [];
  this.index = 0;

  const typeMap = {
    0: [5, 5],
    1: [10, 3],
  }

  this.instantiate = function(type) {
    const newBullet = new Bullet(0, 0, 0, type, typeMap[type][0], typeMap[type][1], this.index);
    //console.log(newBullet);
    this.index++;
    this.all.push(newBullet);
    return newBullet;
  }
  this.pop = function(type) {
    const obj = this.pool.find(e => e.type === type);
    if (obj === undefined) {
      const newObj = this.instantiate(type);
      newObj.enabled = true;
      return newObj;
    } else {
      obj.enabled = true;
      this.pool.splice(this.pool.indexOf(obj), 1);
      return obj;
    }
  }
  this.return = function(obj) {
    console.log(obj.index);
    obj.enabled = false;
    this.pool.push(obj);
  }


  //initializing
  for (this.index = 0; this.index < 3;) { this.return(this.instantiate(0)); }
  //initiallizing end
}();

const keyEventManager = new function() {
  this.keyPressOrigin = {}
  this.keyPressMap = {
    "moveLeft": "j",
    "moveRight": "l",
    "moveUp": "i",
    "moveDown": "k",
    "action0": "z",
    "action1": "Escape",
  }
  this.keyPressResult = {
    "moveLeft": false,
    "moveRight": false,
    "moveUp": false,
    "moveDown": false,
  }
}();
keyEventManager.setKey = function(muKey, mdKey, mlKey, mrKey, ma0Key) {
  this.keyPressMap["moveUp"] = muKey;
  this.keyPressMap["moveDown"] = mdKey;
  this.keyPressMap["moveLeft"] = mlKey;
  this.keyPressMap["moveRight"] = mrKey;
  this.keyPressMap["action0"] = ma0Key
}
keyEventManager.keyPressUpdate = function() {
  for (const [key, value] of Object.entries(this.keyPressMap)) {
    if (this.keyPressOrigin[value]) { this.keyPressResult[key] = true; }
    else { this.keyPressResult[key] = false; }
  }
}
keyEventManager.playerCheck = function() {
  if (this.keyPressResult["moveUp"] && this.keyPressResult["moveDown"]) {
    player.vControling = false;
  }
  else if (this.keyPressResult["moveUp"]) {
    player.linearAccel.call(player, 1);
    player.vControling = true;
  }
  else if (this.keyPressResult["moveDown"]) {
    player.linearAccel.call(player, -1);
    player.vControling = true;
  }
  else {
    player.vControling = false;
  }
  if (this.keyPressResult["moveLeft"] && this.keyPressResult["moveRight"]) {
    player.wControling = false;
  }
  else if (this.keyPressResult["moveRight"]) {
    player.angularAccel.call(player, 1);
    player.wControling = true;
  }
  else if (this.keyPressResult["moveLeft"]) {
    player.angularAccel.call(player, -1);
    player.wControling = true;
  }
  else {
    player.wControling = false;
  }
}
keyEventManager.debugLaunch = function() {
  if (this.keyPressResult['action0']) launcher0.reload.call(launcher0);
}

window.addEventListener('keydown', e => { keyEventManager.keyPressOrigin[e.key] = true; keyEventManager.keyPressUpdate(); })
window.addEventListener('keyup', e => { keyEventManager.keyPressOrigin[e.key] = false; keyEventManager.keyPressUpdate(); })

const background = new function() {
  this.type = {
    'default': 'rect',
    'dark': 'rect',
  }
  this.color = {
    'default': 'white',
    'dark': 'black',
  }
}();
background.draw = function(ctx) {
  if (this.type[theme] === 'rect') {
    ctx.save();
    ctx.fillStyle = this.color[theme];
    ctx.fillRect(0, 0, kineticCanvas.width, kineticCanvas.height);
    ctx.restore();
  }
}

function staticDraw() {
  if (staticCanvas.getContext) {
    const ctx = staticCanvas.getContext('2d', { alpha: false });

    background.draw(ctx);
    ring.draw(ctx);
  }
}
function kineticDraw() {
  if (kineticCanvas.getContext) {
    const ctx = kineticCanvas.getContext('2d');
    ctx.clearRect(0, 0, kineticCanvas.width, kineticCanvas.height);

    //Input
    keyEventManager.playerCheck();
    //keyEventManager.debugLaunch();

    //Calculation
    player.move();
    if (scoreTimer < 100) { scoreTimer++; }
    else { scoreTimer = 0; scoreDisplay.textContent = parseInt(scoreDisplay.textContent) + 1; }

    //drawing(+calculating)
    BulletPool.all.forEach(e => { e.move(); e.draw(ctx); });
    player.draw(ctx);
    launchManager.launchers.forEach(e => { e.move(0, 0, 0); e.draw(ctx); })

  } else {
    console.log("not available");
    scoreDisplay.textContent = "not available";
    return;
  }
  raf = window.requestAnimationFrame(kineticDraw);
}
function startStopToggleButtonClicked() {
  if (!isPaused) {
    isPaused = true;
    window.cancelAnimationFrame(raf);
  }
  else {
    isPaused = false;
    staticDraw();
    kineticDraw();
  }
}
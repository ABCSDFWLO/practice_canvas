const kineticCanvas = document.getElementById("kinetic");
const staticCanvas = document.getElementById("static");
const uiCanvas = document.getElementById("ui");
const scoreDisplay = document.getElementById("score");
const btn1 = document.getElementById("btn1");
let theme = 'default';
let raf = 0;
let scoreTimer = 0;
let score = 0;
let isPaused = true;
let isGameOver = false;

const patterns = {
  /*
  Pattern Rule
  Frame:[iteration,length,{context}]
  context may have another frame set.
  empty context is possible ; to implement delay
  
  exception 1 : single action frame(ex:"launch":[0,0],"dfset"[0,0]...) has iteration of 0.
  exception 2 : pattern's highest frame must have "default":{context}
  exception 2-1 : "default" having all parameters("spd","visible","interval","df") is recommended.
  */

  0: {
    0: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.005,
        "visible": 3,
        "interval": Math.PI * 0.6666,
        "df": 0,
      },
      0: [4, 120, {
        39: [0, 0, {
          "launch": [1, [0, 0]],
        }],
        79: [0, 0, {
          "launch": [1, [1, 0]],
        }],
        119: [0, 0, {
          "launch": [1, [2, 0]],
        }],
      }],
      1: [1, 20, {
        //break time
      }],
    }],
    1: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.008,
        "visible": 1,
        "interval": Math.PI * 2,
        "df": 0,
      },
      0: [35, 9, {
        3: [0, 0, {
          "launch": [1, [0, 0]],
        }],
      }],
    }],
    2: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.005,
        "visible": 3,
        "interval": Math.PI * 0.6666,
        "df": 0,
      },
      0: [5, 50, {
        20: [0, 0, {
          "launch": [3, [0, 0], [1, 0], [2, 0]],
        }],
      }],
    }],
    3: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.001,
        "visible": 5,
        "interval": Math.PI * 0.4,
        "df": Math.PI * 0.5,
      },
      0: [2, 3, {
        0: [1, 30, {
          5: [0, 0, {
            "dfset": [5, [0, Math.PI * 0.5], [1, Math.PI * 0.5], [2, Math.PI * 0.5], [3, Math.PI * 0.5], [4, Math.PI * 0.5]]
          }],
        }],
        1: [5, 5, {
          1: [0, 0, {
            "launch": [5, [0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
          }],
          4: [0, 0, {
            "dfplus": [5, [0, -Math.PI * 0.08], [1, -Math.PI * 0.08], [2, -Math.PI * 0.08], [3, -Math.PI * 0.08], [4, -Math.PI * 0.08]],
          }],
        }],
        2: [1, 20, {
          //delay
        }],
      }],
    }],
    4: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.01,
        "visible": 2,
        "interval": Math.PI * 1,
        "df": 0,
      },
      0: [2, 120, {
        1: [1, 30, {

        }],
        30: [0, 0, {
          "launch": [1, [0, 2]],
        }],
        60: [0, 0, {
          "launch": [1, [1, 2]],
        }],
      }],
    }],
    5: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.0001,
        "visible": 1,
        "interval": Math.PI * 2,
        "df": Math.PI * 0.38,
      },
      0: [1, 30, {
        10: [20, 5, {
          2: [0, 0, {
            "launch": [1, [0, 0]],
          }],
          3: [5, 1, {
            0: [0, 0, {
              "dfplus": [1, [0, -Math.PI * 0.00666666]],
            }],
          }],
        }],
        11: [20, 5, {
          2: [0, 0, {
            "launch": [1, [0, 0]],
          }],
          3: [5, 1, {
            0: [0, 0, {
              "dfplus": [1, [0, Math.PI * 0.00666666]],
            }],
          }],
        }],
      }],
    }],
  },
  1: {
    0: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.007,
        "visible": 3,
        "interval": Math.PI * 0.6666,
        "df": 0,
      },
      0: [6, 30, {
        9: [0, 0, {
          "launch": [1, [0, 0]],
        }],
        19: [0, 0, {
          "launch": [1, [1, 0]],
        }],
        29: [0, 0, {
          "launch": [1, [2, 0]],
        }],
      }],
      1: [1, 30, {
        //break time
      }],
    }],
    1: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.003,
        "visible": 6,
        "interval": Math.PI * 0.007,
        "df": 0,
      },
      0: [1, 60, {
        1: [23, 1, {
          0: [0, 0, {
            "dfplus": [6, [0, Math.PI * 0.01], [1, Math.PI * 0.006], [2, Math.PI * 0.002], [3, -Math.PI * 0.002], [4, -Math.PI * 0.006], [5, -Math.PI * 0.01],],
          }],
        }],
        2: [5, 40, {
          30: [0, 0, {
            "launch": [6, [0, 1], [1, 1], [2, 1], [3, 1], [4, 1], [5, 1],],
          }],
        }],
      }],
      1: [1, 30, {
        //break time
      }],
    }],
    2: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.003,
        "visible": 6,
        "interval": Math.PI * 0.5,
        "df": Math.PI * 0.23,
      },
      0: [1, 3, {
        1: [10, 1, {
          0: [0, 0, {
            "spdplus": [2, [4, Math.PI * 0.0002],[5, Math.PI * 0.00023]],
          }],
        }],
        2: [3, 4, {
          1: [10, 6, {
            0: [0, 0, {
              "launch": [4, [0, 0], [1, 0], [2, 0], [3, 0]],
            }],
          }],
          2: [0, 0, {
            "launch": [2, [4, 2],[5,2]],
          }],
          3: [10, 6, {
            0: [0, 0, {
              "launch": [4, [0, 0], [1, 0], [2, 0], [3, 0]],
            }],
          }],
        }],
      }],
    }],
    3: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.004,
        "visible": 3,
        "interval": Math.PI * 0.05,
        "df": Math.PI * 0.35,
      },
      0: [1, 50, {
        1: [0, 0, {
          "dfplus": [2, [0, Math.PI * 0.05], [2, -Math.PI * 0.05]],
        }],
        2: [5, 10, {
          1: [0, 0, {
            "launch": [3, [0, 0], [1, 0], [2, 0]],
          }],
          2: [7, 2, {
            1: [0, 0, {
              "dfplus": [3, [0, -Math.PI * 0.02], [1, -Math.PI * 0.02], [2, -Math.PI * 0.02]],
            }],
          }],
        }],
        3: [5, 10, {
          1: [0, 0, {
            "launch": [3, [0, 0], [1, 0], [2, 0]],
          }],
          2: [7, 2, {
            1: [0, 0, {
              "dfplus": [3, [0, Math.PI * 0.02], [1, Math.PI * 0.02], [2, Math.PI * 0.02]],
            }],
          }],
        }],
      }],
    }],
    4: [-1, 0, {
      "default": {
        "spd": Math.PI * 0.0001,
        "visible": 3,
        "interval": Math.PI * 0.6666,
        "df": 0,
      },
      0: [1, 3, {
        1:[1,30,{
          
        }],
        2: [60, 8, {
          2: [0, 0, {
            "launch": [3, [0, 0], [1, 0], [2, 0]],
          }],
          3: [0, 0, {
            "spdplus": [3, [0, Math.PI * 0.0002], [1, Math.PI * 0.0002], [2, Math.PI * 0.0002]],
          }],
        }],
      }],
    }],
    5: [-1,0,{
      "default": {
        "spd": Math.PI * 0.01,
        "visible": 5,
        "interval": Math.PI * 0.25,
        "df": 0,
      },
      0:[1,3,{
      0:[3,60,{
        35:[20,1,{
          0:[0,0,{
            "spdplus":[5,[0,Math.PI*0.001],[1,Math.PI*0.001],[2,Math.PI*0.001],[3,Math.PI*0.001],[4,Math.PI*0.001]],
          }],
        }],
        36:[20,1,{
          0:[0,0,{
            "spdplus":[5,[0,-Math.PI*0.001],[1,-Math.PI*0.001],[2,-Math.PI*0.001],[3,-Math.PI*0.001],[4,-Math.PI*0.001]],
          }],
        }],
        38:[0,0,{
          "launch":[5,[0,2],[1,2],[2,2],[3,2],[4,2]],
        }],
      }],
        1:[1,50,{}],
      }],
    }],
  },
  2: {
    0: [-1,0,{
      "default": {
        "spd": Math.PI * 0.002,
        "visible": 9,
        "interval": Math.PI * 0.2222,
        "df": 0,
      },
      0:[1,4,{
        1:[1,30,{}],
        2:[8,72,{
          7:[0,0,{
            "launch":[1,[0,1]],
          }],
          15:[0,0,{
            "launch":[1,[1,1]],
          }],
          23:[0,0,{
            "launch":[1,[2,1]],
          }],
          31:[0,0,{
            "launch":[1,[3,1]],
          }],
          39:[0,0,{
            "launch":[1,[4,1]],
          }],
          47:[0,0,{
            "launch":[1,[5,1]],
          }],
          55:[0,0,{
            "launch":[1,[6,1]],
          }],
          63:[0,0,{
            "launch":[1,[7,1]],
          }],
          71:[0,0,{
            "launch":[1,[8,1]],
          }],
        }], 
      }],
    }],
  },
}


const player = new function(x = 240, y = 240, dir = 0, v = 0, w = 0) {
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
  const rx = this.x - kineticCanvas.width * 0.5;
  const ry = this.y - kineticCanvas.height * 0.5;
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
    ctx.translate(kineticCanvas.width * 0.5, kineticCanvas.height * 0.5);

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
const ui_hp_bar = new function() {
  this.fillStyle = {
    'default': 'MediumSeaGreen',
    'dark': 'MediumSeaGreen',
  };
  this.strokeStyle = {
    'default': 'black',
    'dark': 'white',
  }
  this.WIDTH = 20;
  this.LINEWIDTH = 10;
  this.ARCRANGE = [-Math.PI * 0.1666, Math.PI * 0.6666];
  this.hp = 1;

  this.damage = 0.08;
  this.heal = 0.5;

  this.damaged = function(amount) {
    if (amount) if (this.hp - amount < 0) { this.hp = 0; gameOver(); } else { this.hp -= amount; }
    else if (this.hp - this.damage < 0) { this.hp = 0; gameOver(); } else { this.hp -= this.damage; }
  }
  this.healed = function(amount) {
    if (amount) this.hp = this.hp + amount > 1 ? 1 : this.hp + amount;
    else this.hp = this.hp + this.heal > 1 ? 1 : this.hp + this.heal;
  }
  this.draw = function(ctx) {
    const r = ring.INNERRADIUS + this.LINEWIDTH + this.WIDTH * 0.5;

    ctx.save();
    ctx.translate(kineticCanvas.width * 0.5, kineticCanvas.height * 0.5);
    ctx.rotate(this.ARCRANGE[0]);

    //ctx.fillStyle = this.fillStyle[theme];
    //ctx.strokeStyle=this.strokeStyle[theme];

    ctx.strokeStyle = this.strokeStyle[theme];

    ctx.lineWidth = this.WIDTH + this.LINEWIDTH * 2;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0 - this.LINEWIDTH / r, this.ARCRANGE[1] + this.LINEWIDTH / r);
    ctx.stroke();

    ctx.strokeStyle = this.fillStyle[theme];

    ctx.lineWidth = this.WIDTH;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, this.ARCRANGE[1] * this.hp);
    ctx.stroke();

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

  this.x = kineticCanvas.width * 0.5 - (Math.cos(this.az) * this.ORBITRADIUS);
  this.y = kineticCanvas.height * 0.5 - (Math.sin(this.az) * this.ORBITRADIUS);
  this.visible = true;


  this.nextType = null;

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
Launcher.prototype.launch = function(type) {
  const launchedBullet = BulletPool.pop(type);
  launchedBullet.initialize(this.x, this.y, this.az + this.df,);
  //console.log("launched!");
}
Launcher.prototype.reload = function(type) {
  this.nextType = type;
  this.cooltime = this.RELOADFRAME;
}
Launcher.prototype.move = function(az, dw) {
  this.w += dw;
  this.az += az + this.w;
  this.x = kineticCanvas.width * 0.5 - (Math.cos(this.az) * this.ORBITRADIUS);
  this.y = kineticCanvas.height * 0.5 - (Math.sin(this.az) * this.ORBITRADIUS);
  if (this.cooltime <= this.RELOADFRAME && this.cooltime > 0) { this.cooltime--; }
  else if (this.cooltime === 0) {
    this.cooltime = this.RELOADFRAME + 1;
    this.launch(this.nextType);
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
  this.level = 0;
  this.currentPattern = Math.trunc(Math.random() * Object.keys(patterns[this.level]).length);
  this.pointerStack = [null, null, null];

  this.isTransitioning = 50; //transition중일 때 transitionFrame부터 시작해서 0까지 값을 내립니다.
  this.TRANSITIONFRAME = 50;


  for (let i = 0; i < 9; i++) {
    const newLauncher = new Launcher(i, i * 0.1 * Math.PI, 0, Math.PI * 0.005);
    this.launchers.push(newLauncher);
  }
  console.log(this.currentPattern);
}();
launchManager.transition = function(param) {
  if (this.isTransitioning) {
    if (param?.spd !== undefined && param?.spd !== null) {
      this.launchers.forEach(e => {
        const dw = (e.w - param.spd) / this.isTransitioning;
        if (dw !== 0) {
          e.w -= dw;
        }
      });
    }
    if (param?.interval !== undefined && param?.interval !== null) {
      const basis = this.launchers[0];
      this.launchers.forEach(e => {
        const daz = (e === basis) ? 0 : clampAngle(e.az - basis.az - param.interval * e.id) / this.isTransitioning;
        if (daz !== 0) {
          e.az -= daz;
        }
      });
    }
    if (param?.df !== undefined && param?.df !== null) {
      this.launchers.forEach(e => {
        const ddf = (e.df - param.df) / this.isTransitioning;
        if (ddf !== 0) {
          e.df -= ddf;
        }
      });
    }
    if (param?.visible !== undefined && param?.visible !== null) {
      this.launchers.forEach(e => {
        if (this.isTransitioning === this.TRANSITIONFRAME && e.id < param.visible) e.visible = true;
        else if (this.isTransitioning === 1 && e.id > param.visible - 1) e.visible = false;
      });
    }
    this.isTransitioning--;
  }
}
launchManager.halt = function() {
  this.isTransitioning = this.TRANSITIONFRAME;
  this.pointerStack.fill(null);
  if (score > 100) {
    if(this.level!==2) uiDraw('hp', ['h']);
    this.level = 2;
  } else if (score > 50) {
    if(this.level!==1) uiDraw('hp', ['h']);
    this.level = 1;
  } else {
    this.level = 0;
  }
  this.currentPattern = Math.trunc(Math.random() * Object.keys(patterns[this.level]).length);
  //보너스 점수도 더해줘볼까 말까
}
launchManager.calculate = function() {

  const ptrn = patterns[this.level]?.[this.currentPattern];
  if (this.isTransitioning <= 0) {

    //console.log(this.pointerStack);
    if (this.pointerStack[0] === null) this.pointerStack[0] = 0;
    let tempRange = ptrn;
    let pointerLevel = -1;
    this.pointerStack.forEach(e => { if (e !== null) pointerLevel++; });
    for (let i = 0; i < pointerLevel; i++) {
      tempRange = tempRange[2][tempRange[1] === 0 ? this.pointerStack[i] : this.pointerStack[i] % tempRange[1]];
    }
    //console.log(tempRange);
    if (tempRange[0] === 0) {
      //single action
      Object.entries(tempRange[2]).forEach(entry => {
        const [key, value] = entry;
        //console.log(key, value);
        switch (key) {
          case "launch":
            for (let i = 1; i <= value[0]; i++) this.launchers[value[i][0]].reload(value[i][1]);
            break;
          case "dfset":
            for (let i = 1; i <= value[0]; i++) this.launchers[value[i][0]].df = value[i][1];
            break;
          case "dfplus":
            for (let i = 1; i <= value[0]; i++) this.launchers[value[i][0]].df += value[i][1];
            break;
          case "spdset":
            for (let i = 1; i <= value[0]; i++) this.launchers[value[i][0]].w = value[i][1];
            break;
          case "spdplus":
            for (let i = 1; i <= value[0]; i++) this.launchers[value[i][0]].w += value[i][1];
            break;
          default:
            break;
        }
      });
      this.pointerStack[pointerLevel] = null;
      this.pointerStack[--pointerLevel]++;
    } else if (this.pointerStack[pointerLevel] > tempRange[0] * tempRange[1]) {
      if (pointerLevel === 0) {
        this.halt();
      } else {
        this.pointerStack[pointerLevel] = null;
        this.pointerStack[--pointerLevel]++;
      }
    } else if (tempRange[2][tempRange[1] === 0 ? this.pointerStack[pointerLevel] : this.pointerStack[pointerLevel] % tempRange[1]] === undefined) {
      this.pointerStack[pointerLevel]++;
    } else {
      this.pointerStack[++pointerLevel] = 0;
    }
  } else {
    //console.log("transitioning :", this.isTransitioning);
    this.transition(ptrn[2].default);
  }
}

function Bullet(type, index) {
  this.type = type;
  this.index = index;

  this.x = 0;
  this.y = 0;
  this.dir = 0;
  this.size = 0;
  this.spd = 0;
  this.enabled = false;
  this.life = 0;
  this.nx = 0;
  this.ny = 0;


  this.initialize = function(x, y, dir) {
    const typeMap = {
      0: [5, 5, null],
      1: [10, 3, null],
      2: [5, 2, 150],
    }
    this.x = x;
    this.y = y;
    this.dir = dir;
    this.size = typeMap[this.type][0];
    this.spd = typeMap[this.type][1];
    this.life = typeMap[this.type][2];
  };

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
    let dx = 0, dy = 0;
    if (this.type < 2) {
      dx = this.spd * Math.cos(this.dir);
      dy = this.spd * Math.sin(this.dir);
    } else if (this.type === 2) {
      if (this.life > 0) {
        this.nx = player.x - this.x;
        this.ny = player.y - this.y;
        this.life--;
      }
      const r = 1 / Math.sqrt(this.nx * this.nx + this.ny * this.ny);
      dx = this.nx * r * this.spd;
      dy = this.ny * r * this.spd;
      this.dir = Math.atan(this.ny / this.nx);
    }
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

    switch (this.type) {
      case 0:
      case 1:
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      case 2:
        ctx.translate(this.size * 0.5, this.size * 0.5);
        ctx.rotate(Math.PI * 0.25 + this.dir);
        ctx.rect(-this.size, -this.size, this.size * 2, this.size * 2);
        ctx.fill();
        ctx.stroke();
        break;
    }

    ctx.restore();
  }
}
Bullet.prototype.playerCollideCheck = function() {
  const dx = this.x - player.x;
  const dy = this.y - player.y;
  const rr = this.size + player.size;
  if (dx * dx + dy * dy < rr * rr) {
    //console.log("collided!:player");
    uiDraw('hp', ['d']);
    BulletPool.return(this);
  }
}
Bullet.prototype.outerRingCheck = function() {
  const dx = this.x - kineticCanvas.width * 0.5;
  const dy = this.y - kineticCanvas.height * 0.5;
  const dr = ring.INNERRADIUS + ring.LINEWIDTH;
  if (dx * dx + dy * dy > dr * dr) {
    //console.log("collided!:ring");
    BulletPool.return(this);
  }
}

const BulletPool = new function() {
  this.pool = [];
  this.all = [];
  this.index = 0;


  this.instantiate = function(type) {
    const newBullet = new Bullet(type, this.index);
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
    //console.log(obj.index);
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
  if (this.keyPressResult['action0']) launchManager.launchers[0].reload.call(launchManager.launchers[0]);
}

window.addEventListener('keydown', e => { keyEventManager.keyPressOrigin[e.key] = true; keyEventManager.keyPressUpdate(); });
window.addEventListener('keyup', e => { keyEventManager.keyPressOrigin[e.key] = false; keyEventManager.keyPressUpdate(); });


function staticDraw() {
  window.heig
  if (staticCanvas.getContext) {
    const ctx = staticCanvas.getContext('2d', { alpha: false });

    background.draw(ctx);
    ring.draw(ctx);
    uiDraw('all');
  }
  document.body.classList.forEach(e => { document.body.classList.remove(e); });
  document.body.classList.add(theme);
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
    else { scoreTimer = 0; score++; scoreDisplay.textContent = score; }
    launchManager.calculate();

    //drawing(+calculating)
    BulletPool.all.forEach(e => { e.move(); e.draw(ctx); });
    player.draw(ctx);
    launchManager.launchers.forEach(e => { e.move(0, 0); e.draw(ctx); });

  } else {
    console.log("not available");
    scoreDisplay.textContent = "not available";
    return;
  }
  if (isGameOver) { return; }
  raf = window.requestAnimationFrame(kineticDraw);
}
function uiDraw(ui, event) {
  if (uiCanvas.getContext) {
    const ctx = uiCanvas.getContext('2d');
    ctx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);

    switch (ui) {
      case "all":
        uiDraw('hp');
        uiDraw('score');
        uiDraw('escape');
        break;
      case "hp":
        if (event) {
          if (event[0] === 'd') {
            ui_hp_bar.damaged(event[1]);
          } else if (event[0] === 'h') {
            ui_hp_bar.healed(event[1]);
          }
        }
        break;
      case "score":
        break;
      case "escape":
        break;
      default:
    }
    ui_hp_bar.draw(ctx);
  }
}
function gameOver() {
  console.log("gameover");
  isGameOver = true;
  window.cancelAnimationFrame(raf);
  btn1.textContent = "refresh";
}

function startStopToggleButtonClicked() {
  if (!isGameOver) {
    if (!isPaused) {
      isPaused = true;
      btn1.textContent = "start";
      window.cancelAnimationFrame(raf);
    }
    else {
      isPaused = false;
      btn1.textContent = "stop";
      staticDraw();
      kineticDraw();
    }
  }
  else {
    location.reload();
  }
}

function clampAngle(angle) {
  while (angle > Math.PI * 2) {
    angle -= Math.PI * 2;
  }
  while (angle < 0) {
    angle += Math.PI * 2;
  }
  return angle;
}
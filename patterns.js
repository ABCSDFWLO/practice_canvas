const pattern={
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
      }]
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
                  "dfplus": [5, [0, -Math.PI * 0.08], [1, -Math.PI * 0.08], [2, -Math.PI * 0.08], [3, -Math.PI * 0.08], [4, -Math.PI * 0.08]],
                }],
                2: [0, 0, {
                  "launch": [5, [0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
                }],
              }],
              2: [1, 20, {
                //delay
              }],
            }],
          }],
    },
  1: {

  },
  2: {

  },
}
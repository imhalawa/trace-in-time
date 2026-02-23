document.addEventListener("DOMContentLoaded", function() {
  'use strict';

  const html = document.querySelector('html'),
    globalWrap = document.querySelector('.global-wrap'),
    body = document.querySelector('body'),
    menuToggle = document.querySelector(".hamburger"),
    menuList = document.querySelector(".main-nav"),
    searchOpenButton = document.querySelectorAll(".search-button, .hero__search"),
    searchCloseIcon = document.querySelector(".search__close"),
    searchOverlay = document.querySelector(".search__overlay"),
    searchInput = document.querySelector(".search__text"),
    search = document.querySelector(".search"),
    toggleTheme = document.querySelector(".toggle-theme"),
    blogViewButton = document.querySelector(".blog__toggle"),
    splides = document.querySelector(".logos"),
    imagesOverlay = document.querySelector('.images-overlay'),
    btnScrollToTop = document.querySelector(".top");


  /* =======================================================
  // Menu + Search + Theme Switcher + Blog List View
  ======================================================= */
  menuToggle.addEventListener("click", () => {
    menu();
  });

  searchOpenButton.forEach(button => {
    button.addEventListener("click", searchOpen);
  });

  searchCloseIcon.addEventListener("click", () => {
    searchClose();
  });

  searchOverlay.addEventListener("click", () => {
    searchClose();
  });

  if (blogViewButton) {
    blogViewButton.addEventListener("click", () => {
      viewToggle();
    });
  }

  initSolarScene();

  function initSolarScene() {
    const heroRoot = document.querySelector('.hero');
    const spaceTrigger = document.querySelector('.hero__space-trigger') || document.querySelector('.hero__tagline');
    const solarScene = document.querySelector('.solar-scene');
    const solarCanvas = solarScene ? solarScene.querySelector('.solar-scene__canvas') : null;
    const timelineRoot = document.querySelector('.solar-timeline');
    const timelineStepperItems = timelineRoot ? Array.from(timelineRoot.querySelectorAll('.solar-stepper__item')) : [];
    const timelineClock = document.querySelector('.solar-timeline__clock');
    const timelineClockUp = document.querySelector('.solar-timeline__clock-up');
    const timelineClockMid = document.querySelector('.solar-timeline__clock-mid');
    const timelineClockDown = document.querySelector('.solar-timeline__clock-down');
    const timelineClockSeps = timelineClock ? Array.from(timelineClock.querySelectorAll('.solar-timeline__clock-sep')) : [];
    const customSoundtrack = heroRoot ? (heroRoot.getAttribute('data-soundtrack') || '').trim() : '';
    const requestedRenderer = heroRoot ? (heroRoot.getAttribute('data-space-renderer') || 'auto').trim().toLowerCase() : 'auto';
    const requestedQuality = heroRoot ? (heroRoot.getAttribute('data-space-quality') || 'balanced').trim().toLowerCase() : 'balanced';

    if (!spaceTrigger || !solarScene) {
      return;
    }

    const reducedMotionMedia = window.matchMedia('(prefers-reduced-motion: reduce)');

    const sceneState = {
      active: false,
      tapLocked: false,
      phaseStart: 0,
      galaxyTimer: null,
      rafId: null,
      width: 0,
      height: 0,
      centerX: 0,
      centerY: 0,
      dpr: 1,
      renderer: requestedRenderer,
      qualityPreset: requestedQuality,
      qualityProfile: null,
      stars: [],
      starClusters: [],
      burstParticles: [],
      glowWaves: [],
      colors: {
        primary: '#7f5cff',
        orbit: 'rgba(255, 255, 255, 0.3)',
        star: 'rgba(255, 255, 255, 0.82)',
        planetA: '#4ea2ff',
        planetB: '#ff5d9e',
        planetC: '#ff8f4d',
        planetD: '#8e6eff'
      },
      planets: [
        {
          name: 'Mercury',
          radius: 88,
          eccentricity: 0.46,
          speed: 0.00122,
          angleOffset: 0.35,
          size: 5.4,
          surface: 'rocky',
          colorLight: 'rgba(212, 198, 178, 0.96)',
          colorMid: 'rgba(160, 146, 130, 0.95)',
          colorDark: 'rgba(88, 80, 73, 0.96)',
          moonCount: 0,
          ring: null
        },
        {
          name: 'Venus',
          radius: 136,
          eccentricity: 0.44,
          speed: -0.00096,
          angleOffset: 1.5,
          size: 8,
          surface: 'cloudy',
          colorLight: 'rgba(247, 222, 164, 0.97)',
          colorMid: 'rgba(220, 174, 118, 0.96)',
          colorDark: 'rgba(124, 92, 64, 0.96)',
          moonCount: 0,
          ring: null
        },
        {
          name: 'Earth',
          radius: 188,
          eccentricity: 0.42,
          speed: 0.00072,
          angleOffset: 2.86,
          size: 9.2,
          surface: 'oceanic',
          colorLight: 'rgba(168, 216, 255, 0.98)',
          colorMid: 'rgba(58, 137, 218, 0.97)',
          colorDark: 'rgba(16, 66, 132, 0.98)',
          moonCount: 1,
          ring: null
        },
        {
          name: 'Saturn',
          radius: 252,
          eccentricity: 0.4,
          speed: -0.00036,
          angleOffset: 4.3,
          size: 13.6,
          surface: 'gas',
          colorLight: 'rgba(246, 220, 170, 0.96)',
          colorMid: 'rgba(211, 176, 124, 0.95)',
          colorDark: 'rgba(118, 86, 58, 0.95)',
          moonCount: 2,
          ring: {
            innerScale: 1.35,
            outerScale: 1.9,
            alpha: 0.5,
            tilt: -0.26
          }
        }
      ],
      timing: {
        bigBangDuration: 9000,
        galaxyDelay: 2600,
        galaxyDuration: 22000,
        timelineDuration: 72000,
        autoCloseDelay: 10000
      },
      timelineSteps: [
        0.0,
        0.08,
        0.18,
        0.3,
        0.42,
        0.56,
        0.7,
        0.84,
        1.0
      ],
      audio: {
        enabled: false,
        userActivated: false,
        context: null,
        masterGain: null,
        padGain: null,
        bassGain: null,
        pulseGain: null,
        shimmerGain: null,
        noiseGain: null,
        padFilter: null,
        bassFilter: null,
        padOscA: null,
        padOscB: null,
        padOscC: null,
        bassOsc: null,
        pulseOsc: null,
        shimmerOsc: null,
        noiseSource: null,
        noiseFilter: null,
        mediaElement: null,
        usingCustomTrack: false
      },
      storySlides: [
        { kicker: 'Prologue', text: 'In the beginning, all space, time, and energy are compressed into an unimaginably dense state.' },
        { kicker: 'Inflation Era', text: 'A rapid inflation stretches the fabric of the newborn universe almost instantly.' },
        { kicker: 'Particle Ocean', text: 'A hot particle sea dominates as quarks, leptons, and radiation fill every direction.' },
        { kicker: 'Element Forge', text: 'Nucleosynthesis forges the first light elements in the expanding cosmic furnace.' },
        { kicker: 'Cosmic Dawn', text: 'Cooling allows stable atoms to form, and the universe becomes transparent to light.' },
        { kicker: 'First Light', text: 'Gravity gathers matter and ignites the first stars in deep cosmic night.' },
        { kicker: 'Galactic Web', text: 'Galaxies mature into vast structures, weaving a luminous cosmic web.' },
        { kicker: 'Solar Birth', text: 'Within one galaxy, a young star and its planets emerge — our solar system.' },
        { kicker: 'Present Day', text: 'Today, 13.8 billion years later, we look back and trace this story across the sky.' }
      ],
      currentStoryIndex: -1,
      storyTimerId: null,
      storyTypingId: null,
      autoCloseTimerId: null,
      timelineEnded: false,
      finaleStart: 0,
      preSceneWasLightMode: false,
      forcedDarkModeForScene: false,
      nebulaTextureCanvas: null,
      nebulaTextureSize: 0,
      finaleTextureCanvas: null,
      finaleTextureSize: 0,
      justActivatedAt: 0,
      reduceMotion: reducedMotionMedia.matches
    };

    const canvasContext = solarCanvas ? solarCanvas.getContext('2d', { alpha: true }) : null;

    if (canvasContext && solarCanvas) {
      solarScene.classList.add('solar-scene--canvas-ready');
      hydrateThemeColors();
      configureCanvas();
      window.addEventListener('resize', configureCanvas);
    }

    if (reducedMotionMedia && reducedMotionMedia.addEventListener) {
      reducedMotionMedia.addEventListener('change', function (event) {
        sceneState.reduceMotion = event.matches;
        if (sceneState.reduceMotion) {
          stopRenderLoop();
        } else if (sceneState.active) {
          startRenderLoop();
        }
      });
    }

    function hydrateThemeColors() {
      const cssVars = getComputedStyle(document.documentElement);
      const primary = cssVars.getPropertyValue('--primary-color').trim();
      const border = cssVars.getPropertyValue('--border-color').trim();
      const socialA = cssVars.getPropertyValue('--social-linkedin').trim();
      const socialB = cssVars.getPropertyValue('--social-instagram').trim();
      const socialC = cssVars.getPropertyValue('--social-rss').trim();
      const socialD = cssVars.getPropertyValue('--social-x').trim();

      if (primary) sceneState.colors.primary = primary;
      if (border) sceneState.colors.orbit = border;
      if (socialA) sceneState.colors.planetA = socialA;
      if (socialB) sceneState.colors.planetB = socialB;
      if (socialC) sceneState.colors.planetC = socialC;
      if (socialD) sceneState.colors.planetD = socialD;
    }

    function resolveQualityProfile() {
      const viewportArea = sceneState.width * sceneState.height;
      const mobileLike = sceneState.width < 760;
      const preset = sceneState.qualityPreset;

      if (sceneState.reduceMotion) {
        return {
          starDensity: 0.72,
          burstScale: 0.7,
          nebulaAlpha: 0.72,
          enableStreaks: false,
          textureBands: 2,
          moonDetail: false
        };
      }

      if (preset === 'cinematic') {
        return {
          starDensity: mobileLike ? 1.05 : 1.22,
          burstScale: mobileLike ? 0.92 : 1.08,
          nebulaAlpha: 1,
          enableStreaks: true,
          textureBands: mobileLike ? 3 : 5,
          moonDetail: true
        };
      }

      if (preset === 'performance') {
        return {
          starDensity: viewportArea > 1800000 ? 0.74 : 0.82,
          burstScale: 0.76,
          nebulaAlpha: 0.68,
          enableStreaks: false,
          textureBands: 2,
          moonDetail: false
        };
      }

      return {
        starDensity: mobileLike ? 0.9 : 1,
        burstScale: mobileLike ? 0.82 : 1,
        nebulaAlpha: 0.86,
        enableStreaks: !mobileLike,
        textureBands: mobileLike ? 3 : 4,
        moonDetail: true
      };
    }

    function configureCanvas() {
      if (!canvasContext || !solarCanvas) {
        return;
      }

      sceneState.dpr = Math.min(window.devicePixelRatio || 1, 2);
      sceneState.width = window.innerWidth;
      sceneState.height = window.innerHeight;
      sceneState.qualityProfile = resolveQualityProfile();

      solarCanvas.width = Math.floor(sceneState.width * sceneState.dpr);
      solarCanvas.height = Math.floor(sceneState.height * sceneState.dpr);
      canvasContext.setTransform(sceneState.dpr, 0, 0, sceneState.dpr, 0, 0);

      sceneState.centerX = sceneState.width * 0.5;
      sceneState.centerY = sceneState.height * 0.63;

      const quality = sceneState.qualityProfile || resolveQualityProfile();
      const starCount = Math.max(70, Math.min(240, Math.floor(((sceneState.width * sceneState.height) / 17000) * quality.starDensity)));
      sceneState.stars = Array.from({ length: starCount }, function () {
        const starPalette = [
          'rgba(255, 255, 255, 0.9)',
          'rgba(196, 226, 255, 0.88)',
          'rgba(255, 211, 238, 0.86)',
          'rgba(255, 238, 200, 0.82)'
        ];

        return {
          x: Math.random() * sceneState.width,
          y: Math.random() * sceneState.height,
          size: 0.45 + Math.random() * 1.95,
          alpha: 0.2 + Math.random() * 0.75,
          twinkleRate: 0.001 + Math.random() * 0.004,
          drift: 0.02 + Math.random() * 0.08,
          depth: 0.2 + Math.random() * 0.8,
          layer: Math.random() > 0.72 ? 2 : (Math.random() > 0.46 ? 1 : 0),
          halo: 0.9 + Math.random() * 2.3,
          flickerOffset: Math.random() * Math.PI * 2,
          streak: quality.enableStreaks && Math.random() > 0.9 ? 0.7 + Math.random() * 1.4 : 0,
          color: starPalette[Math.floor(Math.random() * starPalette.length)]
        };
      });

      sceneState.starClusters = buildStarClusters();
      sceneState.nebulaTextureCanvas = buildNebulaTexture();
      sceneState.nebulaTextureSize = sceneState.nebulaTextureCanvas ? sceneState.nebulaTextureCanvas.width : 0;

      const burstBaseCount = sceneState.width < 820 ? 200 : 320;
      const burstCount = Math.max(140, Math.floor(burstBaseCount * quality.burstScale));
      sceneState.burstParticles = Array.from({ length: burstCount }, function () {
        const angle = Math.random() * Math.PI * 2;
        const temperature = Math.random();
        let tint = 'rgba(235, 244, 255, 0.92)';

        if (temperature > 0.82) {
          tint = 'rgba(255, 232, 196, 0.95)';
        } else if (temperature > 0.56) {
          tint = 'rgba(255, 248, 235, 0.93)';
        } else if (temperature < 0.24) {
          tint = 'rgba(200, 224, 255, 0.9)';
        }

        return {
          angle: angle,
          speed: 0.16 + Math.random() * 0.9,
          distanceCap: sceneState.width * (0.2 + Math.random() * 0.44),
          width: 0.7 + Math.random() * 1.6,
          length: 8 + Math.random() * 26,
          alpha: 0.28 + Math.random() * 0.58,
          coreSize: 0.7 + Math.random() * 2.2,
          depth: 0.25 + Math.random() * 0.75,
          tailFade: 0.3 + Math.random() * 0.45,
          tint: tint
        };
      });

      sceneState.glowWaves = [
        { radius: sceneState.width * 0.14, alpha: 0.2 },
        { radius: sceneState.width * 0.2, alpha: 0.14 },
        { radius: sceneState.width * 0.27, alpha: 0.1 }
      ];

      sceneState.finaleTextureCanvas = null;
      sceneState.finaleTextureSize = 0;

      if (!sceneState.active) {
        canvasContext.clearRect(0, 0, sceneState.width, sceneState.height);
      }
    }

    function buildNebulaTexture() {
      const textureSize = Math.max(260, Math.min(680, Math.floor(Math.min(sceneState.width, sceneState.height) * 0.58)));
      if (!textureSize) {
        return null;
      }

      const texture = document.createElement('canvas');
      texture.width = textureSize;
      texture.height = textureSize;
      const textureCtx = texture.getContext('2d', { alpha: true });

      if (!textureCtx) {
        return null;
      }

      textureCtx.clearRect(0, 0, textureSize, textureSize);
      textureCtx.globalCompositeOperation = 'screen';

      for (let cloud = 0; cloud < 14; cloud += 1) {
        const cx = textureSize * (0.12 + (Math.random() * 0.76));
        const cy = textureSize * (0.14 + (Math.random() * 0.72));
        const radius = textureSize * (0.12 + (Math.random() * 0.26));
        const hueMix = cloud % 3;
        let tint = 'rgba(255, 120, 206, 0.2)';

        if (hueMix === 1) {
          tint = 'rgba(110, 178, 255, 0.18)';
        } else if (hueMix === 2) {
          tint = 'rgba(255, 214, 166, 0.14)';
        }

        const cloudGradient = textureCtx.createRadialGradient(cx, cy, 0, cx, cy, radius);
        cloudGradient.addColorStop(0, tint);
        cloudGradient.addColorStop(0.55, tint.replace(/0\.(\d+)/, '0.08'));
        cloudGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        textureCtx.fillStyle = cloudGradient;
        textureCtx.beginPath();
        textureCtx.arc(cx, cy, radius, 0, Math.PI * 2);
        textureCtx.fill();
      }

      textureCtx.globalCompositeOperation = 'source-over';
      return texture;
    }

    function buildStarClusters() {
      const baseSets = [
        { name: 'Pleiades (M45)', x: 0.46, y: 0.22, spread: 1.18, rotation: -0.08, labelOffsetX: 16, labelOffsetY: -14, stars: [[-10,-5,1.6],[8,-8,1.4],[0,0,1.3],[-4,7,1.2],[12,5,1.1],[-13,10,1],[6,13,0.95]] },
        { name: 'Hyades', x: 0.41, y: 0.24, spread: 1.16, rotation: 0.1, labelOffsetX: -86, labelOffsetY: -13, stars: [[-12,-6,1.2],[-2,0,1.1],[9,8,1.25],[16,-3,1.05],[-10,11,0.9]] },
        { name: 'Double Cluster (NGC 869 & NGC 884)', x: 0.68, y: 0.2, spread: 1.22, rotation: -0.11, labelOffsetX: 14, labelOffsetY: -14, stars: [[-14,-2,1.1],[-9,5,1],[-5,-6,1.2],[4,-2,1.1],[9,7,1],[14,-4,1.15],[0,10,0.95]] },
        { name: 'ET Cluster (NGC 457)', aliases: ['Owl Cluster (NGC 457)'], x: 0.73, y: 0.16, spread: 1.14, rotation: -0.09, labelOffsetX: 12, labelOffsetY: -12, aliasOffsetY: 13, stars: [[-10,-7,1],[-2,-1,1.3],[7,-6,1],[0,6,1.05],[-7,11,0.9],[8,12,0.95]] },
        { name: 'Beehive Cluster (Praesepe, M44)', x: 0.54, y: 0.31, spread: 1.12, rotation: -0.08, labelOffsetX: 14, labelOffsetY: -12, stars: [[-8,-4,1.1],[-2,6,1.05],[6,-2,1.2],[10,7,1],[-11,9,0.9],[3,12,0.95]] },
        { name: 'Coma Star Cluster (Melotte 111)', x: 0.63, y: 0.32, spread: 1.22, rotation: 0.07, labelOffsetX: 14, labelOffsetY: -11, stars: [[-14,-5,1],[-6,4,1.15],[2,-2,1],[10,6,1.1],[16,-1,0.95],[-1,10,0.9]] },
        { name: 'Wild Duck Cluster (M11)', x: 0.35, y: 0.48, spread: 1.12, rotation: 0.15, labelOffsetX: 14, labelOffsetY: -10, stars: [[-8,-4,1.1],[-2,2,1.25],[4,-6,1.1],[10,1,1],[-6,9,0.95],[3,10,1.05]] },
        { name: 'Butterfly Cluster (M6)', x: 0.26, y: 0.61, spread: 1.16, rotation: -0.14, labelOffsetX: 14, labelOffsetY: -10, stars: [[-12,0,1],[-4,-6,1.15],[3,-1,1.05],[10,-6,1],[0,6,1.2],[-7,10,0.95],[9,9,0.95]] },
        { name: 'Ptolemy Cluster (M7)', x: 0.31, y: 0.65, spread: 1.16, rotation: 0.08, labelOffsetX: 13, labelOffsetY: -10, stars: [[-13,-3,1],[-5,4,1.1],[2,-4,1.15],[9,5,1.1],[15,-1,0.95],[-1,11,0.9]] },
        { name: 'Jewel Box Cluster (NGC 4755)', x: 0.55, y: 0.58, spread: 1.08, rotation: 0.05, labelOffsetX: 14, labelOffsetY: -10, stars: [[-8,-5,1.2],[-1,0,1.35],[6,-4,1.1],[10,5,1],[-7,8,0.95],[3,10,1.05]] },
        { name: 'Christmas Tree Cluster (NGC 2264)', x: 0.47, y: 0.4, spread: 1.2, rotation: 0.02, labelOffsetX: 14, labelOffsetY: -12, stars: [[0,-12,1.2],[-8,-2,1],[8,-2,1],[-12,8,0.95],[-4,10,1],[4,10,1],[12,8,0.95]] },
        { name: 'Orion Belt', x: 0.52, y: 0.36, spread: 1.14, rotation: -0.11, labelOffsetX: 14, labelOffsetY: -12, stars: [[-12,2,1.3],[0,0,1.45],[12,-2,1.35],[-18,8,1.05],[18,-8,1.05]] },
        { name: 'Big Dipper', x: 0.24, y: 0.28, spread: 1.2, rotation: 0.08, labelOffsetX: 14, labelOffsetY: -12, stars: [[-18,-4,1.1],[-10,-8,1.15],[-2,-6,1.2],[6,-2,1.1],[16,2,1.1],[24,8,1],[32,13,0.95]] },
        { name: 'Cassiopeia W', x: 0.78, y: 0.28, spread: 1.1, rotation: -0.05, labelOffsetX: 14, labelOffsetY: -12, stars: [[-18,2,1],[-9,-6,1.1],[0,4,1.2],[9,-4,1.1],[18,2,1]] },
        { name: 'Southern Cross', x: 0.72, y: 0.66, spread: 1.12, rotation: 0.09, labelOffsetX: 14, labelOffsetY: -12, stars: [[0,-12,1.2],[0,0,1.3],[0,12,1.15],[-9,2,1],[8,-2,1]] },
        { name: 'Scorpius Hook', x: 0.17, y: 0.58, spread: 1.14, rotation: -0.14, labelOffsetX: 14, labelOffsetY: -12, stars: [[-18,-8,1.1],[-9,-2,1.15],[0,2,1.2],[8,8,1.1],[14,16,1],[8,24,0.95]] }
      ];

      return baseSets.map(function (clusterDef) {
        const spread = clusterDef.spread || 1;
        const rotation = clusterDef.rotation || 0;
        const cosRotation = Math.cos(rotation);
        const sinRotation = Math.sin(rotation);

        const rotatedStars = clusterDef.stars.map(function (starPoint) {
          const sourceX = starPoint[0] * spread;
          const sourceY = starPoint[1] * spread;
          return [
            (sourceX * cosRotation) - (sourceY * sinRotation),
            (sourceX * sinRotation) + (sourceY * cosRotation),
            starPoint[2]
          ];
        });

        return {
          name: clusterDef.name,
          aliases: clusterDef.aliases || [],
          x: clusterDef.x * sceneState.width,
          y: clusterDef.y * sceneState.height,
          labelOffsetX: clusterDef.labelOffsetX || 14,
          labelOffsetY: clusterDef.labelOffsetY || -10,
          aliasOffsetY: clusterDef.aliasOffsetY || 12,
          stars: rotatedStars
        };
      });
    }

    function activateScene() {
      if (sceneState.active) {
        return;
      }

      const isDarkModeNow = html.classList.contains('dark-mode');
      sceneState.preSceneWasLightMode = !isDarkModeNow;
      sceneState.forcedDarkModeForScene = false;

      if (sceneState.preSceneWasLightMode && typeof setTheme === 'function') {
        setTheme('dark');
        sceneState.forcedDarkModeForScene = true;
      }

      sceneState.active = true;
      sceneState.phaseStart = performance.now();
      sceneState.timelineEnded = false;
      sceneState.finaleStart = 0;
      solarScene.style.setProperty('--space-darkness', '0.2');

      if (sceneState.autoCloseTimerId) {
        clearTimeout(sceneState.autoCloseTimerId);
        sceneState.autoCloseTimerId = null;
      }

      body.classList.add('space-galaxy-active');
      body.classList.add('space-bigbang-phase');
      body.classList.remove('space-galaxy-phase');
      body.classList.remove('space-orbit-active');

      resetTimeline();
      setAudioEnabled(true, true);

      if (sceneState.galaxyTimer) {
        clearTimeout(sceneState.galaxyTimer);
      }

      sceneState.galaxyTimer = setTimeout(function () {
        if (sceneState.active) {
          body.classList.add('space-galaxy-phase');
        }
      }, sceneState.timing.galaxyDelay);

      startRenderLoop();
    }

    function deactivateScene(forceStop) {
      if (sceneState.tapLocked && !forceStop) {
        return;
      }

      sceneState.active = false;

      if (sceneState.galaxyTimer) {
        clearTimeout(sceneState.galaxyTimer);
        sceneState.galaxyTimer = null;
      }

      if (sceneState.storyTimerId) {
        clearTimeout(sceneState.storyTimerId);
        sceneState.storyTimerId = null;
      }

      if (sceneState.storyTypingId) {
        clearInterval(sceneState.storyTypingId);
        sceneState.storyTypingId = null;
      }

      if (sceneState.autoCloseTimerId) {
        clearTimeout(sceneState.autoCloseTimerId);
        sceneState.autoCloseTimerId = null;
      }

      sceneState.timelineEnded = false;
      sceneState.finaleStart = 0;
      solarScene.style.setProperty('--space-darkness', '0.18');

      body.classList.remove('space-orbit-active');
      body.classList.remove('space-galaxy-phase');
      body.classList.remove('space-bigbang-phase');
      body.classList.remove('space-galaxy-active');

      resetTimeline();
      setAudioEnabled(false, false);

      if (sceneState.forcedDarkModeForScene && sceneState.preSceneWasLightMode && typeof setTheme === 'function') {
        setTheme('light');
      }
      sceneState.forcedDarkModeForScene = false;
      sceneState.preSceneWasLightMode = false;

      stopRenderLoop();
    }

    function resetTimeline() {
      sceneState.currentStoryIndex = -1;
      updateStorySlide(0, true);
      resetPresentationClock();
    }

    function applyPresentationClockStaticValues() {
      if (!timelineClockUp || !timelineClockMid || !timelineClockDown) {
        return;
      }

      timelineClockUp.textContent = '01:12';
      timelineClockMid.textContent = '07:12';
      timelineClockDown.textContent = '19:96';
    }

    function resetPresentationClock() {
      if (!timelineClock || !timelineClockUp || !timelineClockMid || !timelineClockDown) {
        return;
      }

      applyPresentationClockStaticValues();
      timelineClockDown.style.display = '';
      timelineClockMid.style.display = '';
      timelineClockSeps.forEach(function (separator) {
        separator.style.display = '';
      });
    }

    function finalizePresentation() {
      if (sceneState.timelineEnded) {
        return;
      }

      sceneState.timelineEnded = true;
      sceneState.finaleStart = performance.now();

      applyPresentationClockStaticValues();

      if (timelineClockMid) {
        timelineClockMid.style.display = '';
      }

      timelineClockSeps.forEach(function (separator) {
        separator.style.display = '';
      });

      updateStorySlide(sceneState.timelineSteps.length - 1, true);
    }

    function updatePresentationClock(timelineProgress) {
      if (!timelineClock || !timelineClockUp || !timelineClockMid || !timelineClockDown) {
        return;
      }

      applyPresentationClockStaticValues();

      if (timelineProgress >= 1) {
        finalizePresentation();
      }
    }

    function drawFinaleEarth(timestamp, finaleProgress) {
      const eased = smoothStep(0, 1, finaleProgress);
      const earthX = sceneState.centerX;
      const earthY = sceneState.height * 0.58;
      const earthRadius = Math.min(sceneState.width, sceneState.height) * (0.14 + (0.12 * eased));

      function ensureFinaleTexture(textureSize) {
        const expectedSize = Math.max(160, Math.floor(textureSize));
        if (sceneState.finaleTextureCanvas && sceneState.finaleTextureSize === expectedSize) {
          return sceneState.finaleTextureCanvas;
        }

        const terrainCanvas = document.createElement('canvas');
        terrainCanvas.width = expectedSize;
        terrainCanvas.height = expectedSize;
        const terrainContext = terrainCanvas.getContext('2d');
        if (!terrainContext) {
          return null;
        }

        const maskCanvas = document.createElement('canvas');
        maskCanvas.width = expectedSize;
        maskCanvas.height = expectedSize;
        const maskContext = maskCanvas.getContext('2d');
        if (!maskContext) {
          return null;
        }

        maskContext.fillStyle = 'rgba(255,255,255,0.9)';
        maskContext.textBaseline = 'middle';

        const markFont = Math.floor(expectedSize * 0.84);
        maskContext.font = '700 ' + markFont + 'px Tajawal, sans-serif';
        maskContext.textAlign = 'left';
        maskContext.fillText('9', expectedSize * 0.024, expectedSize * 0.565);
        maskContext.textAlign = 'right';
        maskContext.fillText('6', expectedSize * 0.976, expectedSize * 0.565);

        terrainContext.clearRect(0, 0, expectedSize, expectedSize);
        const landGradient = terrainContext.createLinearGradient(0, 0, 0, expectedSize);
        landGradient.addColorStop(0, 'rgba(122, 164, 96, 0.84)');
        landGradient.addColorStop(0.5, 'rgba(94, 138, 76, 0.9)');
        landGradient.addColorStop(1, 'rgba(74, 106, 62, 0.82)');
        terrainContext.fillStyle = landGradient;
        terrainContext.fillRect(0, 0, expectedSize, expectedSize);

        for (let ridge = 0; ridge < 42; ridge += 1) {
          const ridgeY = expectedSize * (0.16 + ((ridge / 42) * 0.66));
          const ridgeAmp = expectedSize * (0.009 + ((ridge % 5) * 0.0025));
          terrainContext.globalAlpha = 0.22;
          terrainContext.strokeStyle = ridge % 2 === 0
            ? 'rgba(206,224,176,0.82)'
            : 'rgba(70,98,64,0.72)';
          terrainContext.lineWidth = 1;
          terrainContext.beginPath();
          for (let segment = 0; segment <= 12; segment += 1) {
            const t = segment / 12;
            const px = expectedSize * t;
            const py = ridgeY + (Math.sin((t * Math.PI * 4.5) + (ridge * 0.7)) * ridgeAmp);
            if (segment === 0) {
              terrainContext.moveTo(px, py);
            } else {
              terrainContext.lineTo(px, py);
            }
          }
          terrainContext.stroke();
        }

        for (let peak = 0; peak < 160; peak += 1) {
          const px = expectedSize * ((peak % 40) / 40);
          const py = expectedSize * (0.18 + (Math.floor(peak / 40) * 0.16));
          const mountain = expectedSize * (0.004 + ((peak % 6) * 0.0014));

          terrainContext.globalAlpha = 0.2;
          terrainContext.fillStyle = 'rgba(236,244,216,0.9)';
          terrainContext.beginPath();
          terrainContext.moveTo(px, py - mountain);
          terrainContext.lineTo(px - (mountain * 0.78), py + (mountain * 0.62));
          terrainContext.lineTo(px + (mountain * 0.78), py + (mountain * 0.62));
          terrainContext.closePath();
          terrainContext.fill();
        }

        terrainContext.filter = 'blur(1.5px)';
        terrainContext.globalAlpha = 0.55;
        terrainContext.drawImage(terrainCanvas, 0, 0);
        terrainContext.filter = 'none';
        terrainContext.globalAlpha = 1;

        terrainContext.globalCompositeOperation = 'destination-in';
        terrainContext.drawImage(maskCanvas, 0, 0);
        terrainContext.globalCompositeOperation = 'source-over';

        sceneState.finaleTextureCanvas = terrainCanvas;
        sceneState.finaleTextureSize = expectedSize;
        return terrainCanvas;
      }

      const softClear = canvasContext.createLinearGradient(0, 0, 0, sceneState.height);
      softClear.addColorStop(0, 'rgba(2, 4, 14, 0)');
      softClear.addColorStop(0.45, 'rgba(2, 4, 14, 0.35)');
      softClear.addColorStop(1, 'rgba(1, 2, 10, 0.62)');
      canvasContext.globalAlpha = 0.6 * eased;
      canvasContext.fillStyle = softClear;
      canvasContext.fillRect(0, 0, sceneState.width, sceneState.height);

      const halo = canvasContext.createRadialGradient(earthX, earthY, earthRadius * 0.35, earthX, earthY, earthRadius * 2.2);
      halo.addColorStop(0, 'rgba(122, 194, 255, 0.4)');
      halo.addColorStop(0.45, 'rgba(70, 122, 255, 0.18)');
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      canvasContext.globalAlpha = 0.8 * eased;
      canvasContext.fillStyle = halo;
      canvasContext.fillRect(0, 0, sceneState.width, sceneState.height);

      const earthFill = canvasContext.createRadialGradient(
        earthX - (earthRadius * 0.28),
        earthY - (earthRadius * 0.32),
        earthRadius * 0.1,
        earthX,
        earthY,
        earthRadius * 1.02
      );
      earthFill.addColorStop(0, 'rgba(132, 212, 252, 0.97)');
      earthFill.addColorStop(0.36, 'rgba(58, 152, 226, 0.98)');
      earthFill.addColorStop(0.76, 'rgba(24, 82, 164, 0.99)');
      earthFill.addColorStop(1, 'rgba(10, 42, 108, 1)');

      const globeSize = Math.max(64, Math.floor(earthRadius * 2.08));
      const globeLeft = earthX - (globeSize / 2);
      const globeTop = earthY - (globeSize / 2);
      const terrainTexture = ensureFinaleTexture(globeSize);

      canvasContext.save();
      canvasContext.beginPath();
      canvasContext.arc(earthX, earthY, earthRadius, 0, Math.PI * 2);
      canvasContext.clip();

      canvasContext.globalAlpha = 0.99;
      canvasContext.fillStyle = earthFill;
      canvasContext.fillRect(earthX - earthRadius, earthY - earthRadius, earthRadius * 2, earthRadius * 2);

      if (terrainTexture) {
        const textureDriftX = Math.sin(timestamp * 0.00007) * (earthRadius * 0.08);
        const textureDriftY = Math.cos(timestamp * 0.00006) * (earthRadius * 0.04);
        canvasContext.globalAlpha = 0.56;
        canvasContext.drawImage(
          terrainTexture,
          globeLeft + textureDriftX,
          globeTop + textureDriftY,
          globeSize,
          globeSize
        );
      }

      const bandCount = sceneState.width < 820 ? 4 : 6;
      for (let band = 0; band < bandCount; band += 1) {
        const t = band / Math.max(1, (bandCount - 1));
        const bandY = earthY - (earthRadius * 0.72) + (t * earthRadius * 1.42);
        const bandWidth = earthRadius * (0.68 + (Math.cos((t - 0.5) * Math.PI) * 0.34));
        const bandHeight = earthRadius * (0.11 + (0.03 * Math.sin((timestamp * 0.00035) + (band * 0.6))));

        canvasContext.globalAlpha = 0.08 + (0.05 * (1 - t));
        canvasContext.fillStyle = band % 2 === 0 ? 'rgba(188, 228, 252, 0.9)' : 'rgba(18, 56, 124, 0.9)';
        canvasContext.beginPath();
        canvasContext.ellipse(earthX - (earthRadius * 0.08), bandY, bandWidth, bandHeight, -0.24, 0, Math.PI * 2);
        canvasContext.fill();
      }

      for (let current = 0; current < 16; current += 1) {
        const arcY = earthY - (earthRadius * 0.75) + ((current / 15) * earthRadius * 1.6);
        const wave = Math.sin((timestamp * 0.00045) + (current * 0.52)) * (earthRadius * 0.026);
        canvasContext.globalAlpha = 0.09;
        canvasContext.strokeStyle = 'rgba(202, 236, 255, 0.86)';
        canvasContext.lineWidth = 0.9;
        canvasContext.beginPath();
        canvasContext.ellipse(earthX + wave, arcY, earthRadius * 0.72, earthRadius * 0.13, 0, 0, Math.PI * 2);
        canvasContext.stroke();
      }

      const terminator = canvasContext.createRadialGradient(
        earthX + (earthRadius * 0.58),
        earthY,
        earthRadius * 0.1,
        earthX + (earthRadius * 0.24),
        earthY,
        earthRadius * 1.2
      );
      terminator.addColorStop(0, 'rgba(8, 22, 54, 0.1)');
      terminator.addColorStop(0.55, 'rgba(8, 22, 54, 0.24)');
      terminator.addColorStop(1, 'rgba(0, 0, 0, 0.45)');
      canvasContext.globalAlpha = 0.75;
      canvasContext.fillStyle = terminator;
      canvasContext.fillRect(earthX - earthRadius, earthY - earthRadius, earthRadius * 2, earthRadius * 2);

      const specular = canvasContext.createRadialGradient(
        earthX - (earthRadius * 0.28),
        earthY - (earthRadius * 0.32),
        earthRadius * 0.05,
        earthX - (earthRadius * 0.22),
        earthY - (earthRadius * 0.24),
        earthRadius * 0.46
      );
      specular.addColorStop(0, 'rgba(246, 251, 255, 0.85)');
      specular.addColorStop(0.36, 'rgba(228, 245, 255, 0.35)');
      specular.addColorStop(1, 'rgba(255,255,255,0)');
      canvasContext.globalAlpha = 0.72;
      canvasContext.fillStyle = specular;
      canvasContext.fillRect(earthX - earthRadius, earthY - earthRadius, earthRadius * 2, earthRadius * 2);

      const atmosphere = canvasContext.createRadialGradient(
        earthX,
        earthY,
        earthRadius * 0.78,
        earthX,
        earthY,
        earthRadius * 1.22
      );
      atmosphere.addColorStop(0, 'rgba(162, 220, 255, 0)');
      atmosphere.addColorStop(0.7, 'rgba(152, 216, 255, 0.22)');
      atmosphere.addColorStop(1, 'rgba(138, 198, 255, 0.46)');
      canvasContext.globalAlpha = 0.85;
      canvasContext.fillStyle = atmosphere;
      canvasContext.fillRect(earthX - (earthRadius * 1.3), earthY - (earthRadius * 1.3), earthRadius * 2.6, earthRadius * 2.6);

      canvasContext.restore();

      canvasContext.globalAlpha = 0.9;
      canvasContext.strokeStyle = 'rgba(210, 235, 255, 0.85)';
      canvasContext.lineWidth = 2.2;
      canvasContext.beginPath();
      canvasContext.arc(earthX, earthY, earthRadius + 1.6, 0, Math.PI * 2);
      canvasContext.stroke();

      function drawMoon(label, angleOffset, orbitScale, radiusScale) {
        const orbitRadius = earthRadius * orbitScale;
        const orbitTilt = 0.72;
        const angle = (timestamp * 0.00045) + angleOffset;
        const moonX = earthX + (Math.cos(angle) * orbitRadius);
        const moonY = earthY + (Math.sin(angle) * (orbitRadius * orbitTilt));
        const moonRadius = earthRadius * radiusScale;

        canvasContext.globalAlpha = 0.42 + (0.22 * eased);
        canvasContext.strokeStyle = 'rgba(206, 224, 255, 0.42)';
        canvasContext.lineWidth = 1;
        canvasContext.beginPath();
        canvasContext.ellipse(earthX, earthY, orbitRadius, orbitRadius * orbitTilt, 0, 0, Math.PI * 2);
        canvasContext.stroke();

        const moonFill = canvasContext.createRadialGradient(
          moonX - (moonRadius * 0.28),
          moonY - (moonRadius * 0.28),
          moonRadius * 0.2,
          moonX,
          moonY,
          moonRadius
        );
        moonFill.addColorStop(0, 'rgba(255,255,255,0.96)');
        moonFill.addColorStop(1, 'rgba(189, 210, 240, 0.92)');

        canvasContext.globalAlpha = 0.96;
        canvasContext.fillStyle = moonFill;
        canvasContext.beginPath();
        canvasContext.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        canvasContext.fill();

        const moonShade = canvasContext.createRadialGradient(
          moonX + (moonRadius * 0.42),
          moonY + (moonRadius * 0.08),
          moonRadius * 0.12,
          moonX + (moonRadius * 0.18),
          moonY,
          moonRadius * 1.06
        );
        moonShade.addColorStop(0, 'rgba(34, 58, 100, 0.14)');
        moonShade.addColorStop(0.65, 'rgba(22, 38, 72, 0.35)');
        moonShade.addColorStop(1, 'rgba(0,0,0,0.55)');
        canvasContext.globalAlpha = 0.5;
        canvasContext.fillStyle = moonShade;
        canvasContext.beginPath();
        canvasContext.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
        canvasContext.fill();

        canvasContext.globalAlpha = 0.5;
        canvasContext.strokeStyle = 'rgba(220, 238, 255, 0.9)';
        canvasContext.lineWidth = 1.1;
        canvasContext.beginPath();
        canvasContext.arc(moonX, moonY, moonRadius + 0.7, 0, Math.PI * 2);
        canvasContext.stroke();

        for (let spark = 0; spark < 6; spark += 1) {
          const trailAngle = angle - (spark * 0.18);
          const trailX = earthX + (Math.cos(trailAngle) * orbitRadius);
          const trailY = earthY + (Math.sin(trailAngle) * (orbitRadius * orbitTilt));
          canvasContext.globalAlpha = 0.22 * (1 - (spark / 6));
          canvasContext.fillStyle = 'rgba(214,230,255,0.95)';
          canvasContext.beginPath();
          canvasContext.arc(trailX, trailY, moonRadius * (0.16 + ((6 - spark) * 0.04)), 0, Math.PI * 2);
          canvasContext.fill();
        }

        canvasContext.globalAlpha = 0.95;
        canvasContext.fillStyle = 'rgba(238,246,255,0.98)';
        canvasContext.font = '700 12px Tajawal, sans-serif';
        canvasContext.textAlign = 'center';
        canvasContext.textBaseline = 'bottom';
        canvasContext.fillText(label, moonX, moonY - moonRadius - 10);
      }

      drawMoon('12st Jan', 0.25, 1.72, 0.17);
      drawMoon('12st Jul', Math.PI + 0.45, 2.18, 0.14);

      canvasContext.globalAlpha = 1;
    }

    function updateStorySlide(index, immediate) {
      if (!timelineStepperItems || timelineStepperItems.length === 0) {
        return;
      }

      const safeIndex = Math.max(0, Math.min(index, sceneState.storySlides.length - 1));
      if (sceneState.currentStoryIndex === safeIndex && !immediate) {
        return;
      }

      sceneState.currentStoryIndex = safeIndex;
      const slide = sceneState.storySlides[safeIndex] || sceneState.storySlides[0];

      if (sceneState.storyTimerId) {
        clearTimeout(sceneState.storyTimerId);
        sceneState.storyTimerId = null;
      }

      if (sceneState.storyTypingId) {
        clearInterval(sceneState.storyTypingId);
        sceneState.storyTypingId = null;
      }

      timelineStepperItems.forEach(function (stepItem, stepIndex) {
        stepItem.classList.toggle('is-active', stepIndex === safeIndex);
        stepItem.classList.toggle('is-complete', stepIndex < safeIndex);
      });

      if (timelineRoot) {
        timelineRoot.setAttribute('data-step-kicker', slide.kicker || '');
      }
    }

    function ensureCustomTrack() {
      if (!customSoundtrack) {
        sceneState.audio.usingCustomTrack = false;
        return false;
      }

      if (!sceneState.audio.mediaElement) {
        const mediaElement = new Audio(customSoundtrack);
        mediaElement.loop = true;
        mediaElement.preload = 'auto';
        mediaElement.volume = 0;
        sceneState.audio.mediaElement = mediaElement;
      }

      if (sceneState.audio.mediaElement.error) {
        sceneState.audio.usingCustomTrack = false;
        return false;
      }

      const mediaElement = sceneState.audio.mediaElement;
      const supportHint = mediaElement.canPlayType('audio/mp4') || mediaElement.canPlayType('audio/x-m4a') || mediaElement.canPlayType('audio/aac');
      if (!supportHint) {
        sceneState.audio.usingCustomTrack = false;
        return false;
      }

      sceneState.audio.usingCustomTrack = true;
      return true;
    }

    function createNoiseBuffer(context) {
      const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
      const output = buffer.getChannelData(0);
      for (let sample = 0; sample < output.length; sample += 1) {
        output[sample] = (Math.random() * 2 - 1) * 0.35;
      }
      return buffer;
    }

    function createImpulseResponse(context, seconds, decay) {
      const length = Math.floor(context.sampleRate * seconds);
      const impulse = context.createBuffer(2, length, context.sampleRate);

      for (let channel = 0; channel < impulse.numberOfChannels; channel += 1) {
        const channelData = impulse.getChannelData(channel);
        for (let index = 0; index < length; index += 1) {
          const t = index / length;
          channelData[index] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
        }
      }

      return impulse;
    }

    function ensureAudioGraph() {
      if (sceneState.audio.context) {
        return true;
      }

      const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextCtor) {
        return false;
      }

      const context = new AudioContextCtor();
      const masterGain = context.createGain();
      const padGain = context.createGain();
      const bassGain = context.createGain();
      const pulseGain = context.createGain();
      const shimmerGain = context.createGain();
      const noiseGain = context.createGain();
      const padFilter = context.createBiquadFilter();
      const bassFilter = context.createBiquadFilter();
      const noiseFilter = context.createBiquadFilter();
      const compressor = context.createDynamicsCompressor();
      const convolver = context.createConvolver();
      const wetGain = context.createGain();
      const dryGain = context.createGain();

      masterGain.gain.value = 0;
      padGain.gain.value = 0;
      bassGain.gain.value = 0;
      pulseGain.gain.value = 0;
      shimmerGain.gain.value = 0;
      noiseGain.gain.value = 0;

      padFilter.type = 'lowpass';
      padFilter.frequency.value = 460;
      padFilter.Q.value = 0.45;

      bassFilter.type = 'lowpass';
      bassFilter.frequency.value = 180;
      bassFilter.Q.value = 0.6;

      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.value = 460;
      noiseFilter.Q.value = 0.62;

      compressor.threshold.value = -24;
      compressor.knee.value = 16;
      compressor.ratio.value = 3;
      compressor.attack.value = 0.02;
      compressor.release.value = 0.25;

      convolver.buffer = createImpulseResponse(context, 3.6, 3.1);
      wetGain.gain.value = 0.2;
      dryGain.gain.value = 0.8;

      const padOscA = context.createOscillator();
      padOscA.type = 'sine';
      padOscA.frequency.value = 55;

      const padOscB = context.createOscillator();
      padOscB.type = 'triangle';
      padOscB.frequency.value = 82;

      const padOscC = context.createOscillator();
      padOscC.type = 'sine';
      padOscC.frequency.value = 110;

      const bassOsc = context.createOscillator();
      bassOsc.type = 'sine';
      bassOsc.frequency.value = 28;

      const pulseOsc = context.createOscillator();
      pulseOsc.type = 'triangle';
      pulseOsc.frequency.value = 110;

      const shimmerOsc = context.createOscillator();
      shimmerOsc.type = 'sine';
      shimmerOsc.frequency.value = 330;

      const noiseSource = context.createBufferSource();
      noiseSource.buffer = createNoiseBuffer(context);
      noiseSource.loop = true;

      padOscA.connect(padGain);
      padOscB.connect(padGain);
      padOscC.connect(padGain);
      bassOsc.connect(bassFilter);
      bassFilter.connect(bassGain);
      pulseOsc.connect(pulseGain);
      shimmerOsc.connect(shimmerGain);
      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);

      padGain.connect(padFilter);
      padFilter.connect(masterGain);
      bassGain.connect(masterGain);
      pulseGain.connect(masterGain);
      shimmerGain.connect(masterGain);
      noiseGain.connect(masterGain);

      masterGain.connect(dryGain);
      masterGain.connect(convolver);
      convolver.connect(wetGain);

      dryGain.connect(compressor);
      wetGain.connect(compressor);
      compressor.connect(context.destination);

      padOscA.start();
      padOscB.start();
      padOscC.start();
      bassOsc.start();
      pulseOsc.start();
      shimmerOsc.start();
      noiseSource.start();

      sceneState.audio.context = context;
      sceneState.audio.masterGain = masterGain;
      sceneState.audio.padGain = padGain;
      sceneState.audio.bassGain = bassGain;
      sceneState.audio.pulseGain = pulseGain;
      sceneState.audio.shimmerGain = shimmerGain;
      sceneState.audio.noiseGain = noiseGain;
      sceneState.audio.padFilter = padFilter;
      sceneState.audio.bassFilter = bassFilter;
      sceneState.audio.padOscA = padOscA;
      sceneState.audio.padOscB = padOscB;
      sceneState.audio.padOscC = padOscC;
      sceneState.audio.bassOsc = bassOsc;
      sceneState.audio.pulseOsc = pulseOsc;
      sceneState.audio.shimmerOsc = shimmerOsc;
      sceneState.audio.noiseSource = noiseSource;
      sceneState.audio.noiseFilter = noiseFilter;

      return true;
    }

    function setAudioEnabled(enabled, isUserAction) {
      sceneState.audio.enabled = enabled;
      if (isUserAction) {
        sceneState.audio.userActivated = true;
      }

      if (ensureCustomTrack()) {
        const mediaElement = sceneState.audio.mediaElement;
        if (!mediaElement) {
          return;
        }

        if (!enabled) {
          mediaElement.pause();
          mediaElement.currentTime = 0;
          mediaElement.volume = 0;
          return;
        }

        mediaElement.play().catch(function () {
          sceneState.audio.usingCustomTrack = false;
          const graphReady = ensureAudioGraph();
          if (graphReady && sceneState.audio.context) {
            sceneState.audio.context.resume().catch(function () {});
          }
        });
        return;
      }

      if (!sceneState.audio.enabled) {
        if (sceneState.audio.context && sceneState.audio.masterGain) {
          const now = sceneState.audio.context.currentTime;
          sceneState.audio.masterGain.gain.cancelScheduledValues(now);
          sceneState.audio.masterGain.gain.setTargetAtTime(0, now, 0.08);
        }
        return;
      }

      const graphReady = ensureAudioGraph();
      if (!graphReady || !sceneState.audio.context) {
        return;
      }

      sceneState.audio.context.resume().catch(function () {
      });
    }

    function getStoryChord(stage) {
      const chords = [
        [55, 82.41, 110],
        [58.27, 87.31, 116.54],
        [65.41, 98, 130.81],
        [73.42, 110, 146.83],
        [82.41, 123.47, 164.81],
        [87.31, 130.81, 174.61],
        [98, 146.83, 196],
        [110, 164.81, 220],
        [123.47, 185, 246.94]
      ];

      return chords[stage] || chords[0];
    }

    function easeInOut(value) {
      const clamped = Math.max(0, Math.min(value, 1));
      return clamped < 0.5
        ? (4 * clamped * clamped * clamped)
        : (1 - Math.pow(-2 * clamped + 2, 3) / 2);
    }

    function smoothStep(edgeStart, edgeEnd, value) {
      if (edgeStart === edgeEnd) {
        return 0;
      }

      const x = Math.max(0, Math.min((value - edgeStart) / (edgeEnd - edgeStart), 1));
      return x * x * (3 - (2 * x));
    }

    function getPulseLayer(progress, timelineSeconds) {
      const early = smoothStep(0.18, 0.34, progress);
      const late = smoothStep(0.72, 0.94, progress);
      const pulseSpeed = 0.52 + (progress * 0.85);
      const pulseWave = Math.max(0, Math.sin((timelineSeconds * Math.PI * pulseSpeed)));
      const pulseShape = Math.pow(pulseWave, 7);

      return pulseShape * (0.25 + (0.75 * early)) * (0.7 + (0.3 * late));
    }

    function getShimmerLayer(progress, timelineSeconds) {
      const rise = smoothStep(0.4, 0.68, progress);
      const shimmerMotion = 0.62 + (Math.sin((timelineSeconds * 0.77) + 0.4) * 0.38);
      return Math.max(0, rise * shimmerMotion);
    }

    function applyGainEnvelope(currentTime, timelineProgress) {
      const narrative = easeInOut(timelineProgress);
      const active = sceneState.active ? 1 : 0;
      const masterTarget = (0.07 + (narrative * 0.07)) * active;
      const padTarget = (0.01 + (narrative * 0.036)) * active;
      const bassTarget = (0.005 + (narrative * 0.02)) * active;
      const pulseTarget = (getPulseLayer(timelineProgress, currentTime) * 0.014) * active;
      const shimmerTarget = (getShimmerLayer(timelineProgress, currentTime) * 0.011) * active;
      const noiseTarget = (0.003 * (1 - smoothStep(0.12, 0.7, timelineProgress))) * active;

      sceneState.audio.masterGain.gain.setTargetAtTime(masterTarget, currentTime, 0.6);
      sceneState.audio.padGain.gain.setTargetAtTime(padTarget, currentTime, 0.5);
      sceneState.audio.bassGain.gain.setTargetAtTime(bassTarget, currentTime, 0.5);
      sceneState.audio.pulseGain.gain.setTargetAtTime(pulseTarget, currentTime, 0.24);
      sceneState.audio.shimmerGain.gain.setTargetAtTime(shimmerTarget, currentTime, 0.34);
      sceneState.audio.noiseGain.gain.setTargetAtTime(noiseTarget, currentTime, 0.45);
    }

    function applyFrequencyNarrative(currentTime, timelineProgress, stage, timestamp) {
      const chord = getStoryChord(stage);
      const timelineSeconds = timestamp * 0.001;
      const vibratoA = Math.sin(timelineSeconds * 0.23) * 0.45;
      const vibratoB = Math.sin((timelineSeconds * 0.19) + 1.2) * 0.38;
      const shimmerDrift = Math.sin((timelineSeconds * 0.31) + 0.8) * 2.2;
      const bloom = smoothStep(0.46, 0.9, timelineProgress);

      sceneState.audio.padOscA.frequency.setTargetAtTime(chord[0] + vibratoA, currentTime, 0.8);
      sceneState.audio.padOscB.frequency.setTargetAtTime(chord[1] + vibratoB, currentTime, 0.84);
      sceneState.audio.padOscC.frequency.setTargetAtTime(chord[2] + (vibratoA * 0.6), currentTime, 0.9);
      sceneState.audio.bassOsc.frequency.setTargetAtTime((chord[0] * 0.5) + (timelineProgress * 2.4), currentTime, 0.9);
      sceneState.audio.pulseOsc.frequency.setTargetAtTime(chord[1] * (1 + (0.01 * bloom)), currentTime, 0.32);
      sceneState.audio.shimmerOsc.frequency.setTargetAtTime((chord[2] * 1.5) + shimmerDrift, currentTime, 0.7);

      sceneState.audio.padFilter.frequency.setTargetAtTime(360 + (timelineProgress * 1040), currentTime, 0.9);
      sceneState.audio.bassFilter.frequency.setTargetAtTime(130 + (timelineProgress * 130), currentTime, 0.8);
      sceneState.audio.noiseFilter.frequency.setTargetAtTime(250 + ((1 - timelineProgress) * 330), currentTime, 0.8);
    }

    function updateSoundtrack(timelineProgress, timestamp) {
      if (sceneState.audio.usingCustomTrack && sceneState.audio.mediaElement) {
        const volumeTarget = sceneState.active ? (0.16 + (easeInOut(timelineProgress) * 0.42)) : 0;
        sceneState.audio.mediaElement.volume = Math.max(0, Math.min(volumeTarget, 0.62));
        return;
      }

      if (!sceneState.audio.enabled || !sceneState.audio.context || sceneState.audio.context.state !== 'running') {
        return;
      }

      const context = sceneState.audio.context;
      const now = context.currentTime;
      const stage = getTimelineStage(timelineProgress);

      applyFrequencyNarrative(now, timelineProgress, stage, timestamp);
      applyGainEnvelope(now, timelineProgress);
    }

    function updateTimeline(timelineProgress) {
      const progress = Math.max(0, Math.min(timelineProgress, 1));

      let currentIndex = 0;
      sceneState.timelineSteps.forEach(function (stepValue, index) {
        if (progress >= stepValue) {
          currentIndex = index;
        }
      });

      updateStorySlide(currentIndex, false);
    }

    function getTimelineStage(progress) {
      let stageIndex = 0;
      sceneState.timelineSteps.forEach(function (stepValue, index) {
        if (progress >= stepValue) {
          stageIndex = index;
        }
      });

      return stageIndex;
    }

    function startRenderLoop() {
      if (!canvasContext || !solarCanvas || sceneState.rafId) {
        return;
      }

      sceneState.rafId = requestAnimationFrame(renderFrame);
    }

    function stopRenderLoop() {
      if (sceneState.rafId) {
        cancelAnimationFrame(sceneState.rafId);
        sceneState.rafId = null;
      }

      if (canvasContext) {
        canvasContext.clearRect(0, 0, sceneState.width, sceneState.height);
      }

      if (sceneState.audio.context && sceneState.audio.masterGain) {
        const now = sceneState.audio.context.currentTime;
        sceneState.audio.masterGain.gain.setTargetAtTime(0, now, 0.18);
      }
    }

    function drawGalaxy(phaseProgress, timestamp, timelineProgress) {
      const galaxyAlpha = Math.max(0, Math.min(phaseProgress, 1));
      const spread = sceneState.width * (0.14 + (0.42 * Math.pow(galaxyAlpha, 1.2)));
      const structureProgress = Math.max(0, Math.min((timelineProgress - 0.18) / 0.82, 1));
      const quality = sceneState.qualityProfile || resolveQualityProfile();

      if (sceneState.nebulaTextureCanvas && sceneState.nebulaTextureSize > 0) {
        const textureSize = sceneState.nebulaTextureSize;
        const textureScale = (1.1 + (galaxyAlpha * 0.38)) * (1 + (Math.sin(timestamp * 0.00007) * 0.02));
        const drawSize = textureSize * textureScale;
        const textureX = sceneState.centerX - (drawSize * 0.5) + (Math.sin(timestamp * 0.00005) * 18);
        const textureY = sceneState.centerY - (drawSize * 0.54) + (Math.cos(timestamp * 0.00004) * 14);

        canvasContext.globalAlpha = 0.26 * galaxyAlpha * (0.72 + (0.28 * structureProgress)) * quality.nebulaAlpha;
        canvasContext.globalCompositeOperation = 'screen';
        canvasContext.drawImage(sceneState.nebulaTextureCanvas, textureX, textureY, drawSize, drawSize);
        canvasContext.globalCompositeOperation = 'source-over';
      }

      const coreGradient = canvasContext.createRadialGradient(
        sceneState.centerX,
        sceneState.centerY,
        sceneState.width * 0.03,
        sceneState.centerX,
        sceneState.centerY,
        spread
      );

      coreGradient.addColorStop(0, 'rgba(255,255,255,0.2)');
      coreGradient.addColorStop(0.28, 'rgba(255,134,210,0.2)');
      coreGradient.addColorStop(0.62, 'rgba(86,156,255,0.16)');
      coreGradient.addColorStop(1, 'rgba(0,0,0,0)');

      canvasContext.globalAlpha = 0.85 * galaxyAlpha;
      canvasContext.fillStyle = coreGradient;
      canvasContext.fillRect(0, 0, sceneState.width, sceneState.height);

      const armRadius = sceneState.width * (0.12 + (0.26 * galaxyAlpha));
      canvasContext.save();
      canvasContext.translate(sceneState.centerX, sceneState.centerY);
      canvasContext.rotate(-0.25 + (Math.sin(timestamp * 0.00022) * 0.06));
      canvasContext.globalAlpha = 0.2 * galaxyAlpha;
      canvasContext.fillStyle = 'rgba(255, 128, 208, 0.36)';
      canvasContext.beginPath();
      canvasContext.ellipse(0, 0, armRadius * 1.42, armRadius * 0.5, 0, 0, Math.PI * 2);
      canvasContext.fill();
      canvasContext.rotate(1.7);
      canvasContext.fillStyle = 'rgba(122, 182, 255, 0.3)';
      canvasContext.beginPath();
      canvasContext.ellipse(0, 0, armRadius * 1.2, armRadius * 0.44, 0, 0, Math.PI * 2);
      canvasContext.fill();
      canvasContext.restore();

      const horizonVisibility = smoothStep(0.42, 1, timelineProgress) * galaxyAlpha;
      if (horizonVisibility > 0.02) {
        for (let galaxyIndex = 0; galaxyIndex < 8; galaxyIndex += 1) {
          const baseX = ((galaxyIndex + 1) / 9) * sceneState.width;
          const horizonY = sceneState.height * (0.75 + ((galaxyIndex % 3) * 0.04));
          const drift = Math.sin((timestamp * 0.00003) + galaxyIndex) * 8;
          const gx = baseX + drift;
          const gy = horizonY + (Math.cos((timestamp * 0.00002) + galaxyIndex) * 4);
          const galaxyW = 12 + ((galaxyIndex % 4) * 6);
          const galaxyH = galaxyW * 0.42;

          canvasContext.globalAlpha = (0.08 + ((galaxyIndex % 4) * 0.02)) * horizonVisibility;
          canvasContext.fillStyle = galaxyIndex % 2 === 0 ? 'rgba(198, 218, 255, 0.8)' : 'rgba(255, 212, 232, 0.72)';
          canvasContext.beginPath();
          canvasContext.ellipse(gx, gy, galaxyW, galaxyH, -0.2 + (galaxyIndex * 0.03), 0, Math.PI * 2);
          canvasContext.fill();

          canvasContext.globalAlpha = 0.11 * horizonVisibility;
          canvasContext.fillStyle = 'rgba(255,255,255,0.86)';
          canvasContext.beginPath();
          canvasContext.arc(gx, gy, 1.1, 0, Math.PI * 2);
          canvasContext.fill();
        }
      }

      sceneState.stars.forEach(function (star, index) {
        const twinkle = 0.52 + (Math.sin((timestamp * star.twinkleRate * 1000) + index) * 0.48);
        const layerDepth = star.layer === 2 ? 1.45 : (star.layer === 1 ? 1 : 0.7);
        const opacity = star.alpha * twinkle * (0.25 + (0.75 * structureProgress)) * galaxyAlpha * (0.78 + (layerDepth * 0.16));
        const x = star.x + (Math.sin((timestamp * 0.00009 * layerDepth) + index + star.flickerOffset) * (1.35 - star.depth));
        const y = star.y + (Math.cos((timestamp * 0.00008 * layerDepth) + index + star.flickerOffset) * (1.15 - star.depth));
        const starRadius = star.size * (0.9 + (0.22 * twinkle)) * (0.86 + (layerDepth * 0.16));

        if (star.layer > 0) {
          const bloom = canvasContext.createRadialGradient(x, y, 0, x, y, starRadius * star.halo);
          bloom.addColorStop(0, 'rgba(255,255,255,0.42)');
          bloom.addColorStop(0.5, star.color || sceneState.colors.star);
          bloom.addColorStop(1, 'rgba(0,0,0,0)');
          canvasContext.globalAlpha = opacity * 0.42;
          canvasContext.fillStyle = bloom;
          canvasContext.beginPath();
          canvasContext.arc(x, y, starRadius * star.halo, 0, Math.PI * 2);
          canvasContext.fill();
        }

        canvasContext.globalAlpha = opacity;
        canvasContext.fillStyle = star.color || sceneState.colors.star;
        canvasContext.beginPath();
        canvasContext.arc(x, y, starRadius, 0, Math.PI * 2);
        canvasContext.fill();

        if (quality.enableStreaks && star.streak > 0 && star.layer === 2) {
          canvasContext.globalAlpha = opacity * 0.22;
          canvasContext.strokeStyle = 'rgba(235, 245, 255, 0.9)';
          canvasContext.lineWidth = Math.max(0.35, starRadius * 0.22);
          canvasContext.beginPath();
          canvasContext.moveTo(x - (star.streak * 0.8), y - (star.streak * 0.3));
          canvasContext.lineTo(x + star.streak, y + (star.streak * 0.35));
          canvasContext.stroke();
        }
      });

      canvasContext.globalAlpha = 1;
    }

    function drawBigBang(phaseProgress, elapsed, timelineProgress) {
      if (phaseProgress <= 0) {
        return;
      }

      const timeScale = Math.max(sceneState.timing.bigBangDuration / 420, 1);
      const scaledElapsed = elapsed / timeScale;

      const stageIndex = getTimelineStage(timelineProgress);
      const stageIntensity = [1, 1, 0.82, 0.64, 0.46, 0.34, 0.24, 0.16, 0.1][stageIndex] || 0.1;
      const stageVelocity = [1.14, 1.12, 1, 0.86, 0.74, 0.62, 0.52, 0.42, 0.34][stageIndex] || 0.34;
      const stageSwirl = [0.03, 0.06, 0.14, 0.22, 0.28, 0.36, 0.42, 0.48, 0.54][stageIndex] || 0.54;
      const stageColors = [
        ['rgba(255,248,232,0.98)', 'rgba(255,224,176,0.92)'],
        ['rgba(255,242,220,0.96)', 'rgba(255,212,164,0.9)'],
        ['rgba(255,232,205,0.94)', 'rgba(252,196,150,0.88)'],
        ['rgba(244,226,216,0.9)', 'rgba(230,206,248,0.86)'],
        ['rgba(214,224,244,0.88)', 'rgba(176,200,238,0.84)'],
        ['rgba(198,218,245,0.86)', 'rgba(166,204,242,0.82)'],
        ['rgba(216,230,248,0.84)', 'rgba(194,221,246,0.8)'],
        ['rgba(228,236,250,0.82)', 'rgba(214,231,250,0.78)'],
        ['rgba(236,242,252,0.8)', 'rgba(228,239,252,0.76)']
      ][stageIndex] || ['rgba(233,240,255,0.8)', 'rgba(245,248,255,0.78)'];

      const flashPower = Math.max(0, 1 - (scaledElapsed / 170));
      const shockProgress = Math.max(0, Math.min((scaledElapsed - 50) / 860, 1));

      if (flashPower > 0) {
        const flashGradient = canvasContext.createRadialGradient(
          sceneState.centerX,
          sceneState.centerY,
          2,
          sceneState.centerX,
          sceneState.centerY,
          sceneState.width * (0.08 + (0.24 * (1 - flashPower)))
        );

        flashGradient.addColorStop(0, 'rgba(255,255,255,1)');
        flashGradient.addColorStop(0.24, 'rgba(255,248,255,0.94)');
        flashGradient.addColorStop(0.5, 'rgba(255,180,220,0.72)');
        flashGradient.addColorStop(1, 'rgba(255,180,220,0)');

        canvasContext.globalAlpha = Math.min(1, flashPower * 1.35);
        canvasContext.fillStyle = flashGradient;
        canvasContext.fillRect(0, 0, sceneState.width, sceneState.height);

        canvasContext.globalAlpha = flashPower * 0.24;
        canvasContext.fillStyle = 'rgba(255,255,255,1)';
        canvasContext.fillRect(0, 0, sceneState.width, sceneState.height);
      }

      if (shockProgress > 0) {
        const shockRadius = sceneState.width * (0.05 + (shockProgress * 0.58));
        canvasContext.globalAlpha = 0.5 * (1 - shockProgress) * phaseProgress;
        canvasContext.strokeStyle = 'rgba(255, 230, 250, 0.95)';
        canvasContext.lineWidth = 2.2;
        canvasContext.beginPath();
        canvasContext.arc(sceneState.centerX, sceneState.centerY, shockRadius, 0, Math.PI * 2);
        canvasContext.stroke();

        canvasContext.globalAlpha = 0.26 * (1 - shockProgress) * phaseProgress;
        canvasContext.strokeStyle = 'rgba(130, 190, 255, 0.9)';
        canvasContext.lineWidth = 1.2;
        canvasContext.beginPath();
        canvasContext.arc(sceneState.centerX, sceneState.centerY, shockRadius * 1.12, 0, Math.PI * 2);
        canvasContext.stroke();
      }

      sceneState.burstParticles.forEach(function (particle, index) {
        const projected = Math.min(scaledElapsed * particle.speed * stageVelocity, particle.distanceCap);
        if (projected < 1) {
          return;
        }

        const travelRatio = projected / particle.distanceCap;
        const alive = 1 - travelRatio;
        const jitter = Math.sin((scaledElapsed * 0.012) + index) * (1.6 - (timelineProgress * 0.7));
        const swirlAngle = particle.angle + (travelRatio * stageSwirl);
        const x = sceneState.centerX + (Math.cos(swirlAngle) * projected) + jitter;
        const y = sceneState.centerY + (Math.sin(swirlAngle) * projected) + jitter;

        if ((index % 7) > Math.floor(stageIntensity * 6)) {
          return;
        }

        const particleColor = index % 2 === 0 ? stageColors[0] : stageColors[1];
        const depthScale = 0.7 + (particle.depth * 0.55);
        const radius = particle.coreSize * depthScale * (0.62 + (alive * 0.56));
        const driftTail = particle.length * (0.06 + (travelRatio * 0.12));

        canvasContext.globalCompositeOperation = 'screen';

        const halo = canvasContext.createRadialGradient(
          x,
          y,
          0,
          x,
          y,
          radius * 2.45
        );
        halo.addColorStop(0, 'rgba(255,255,255,0.56)');
        halo.addColorStop(0.34, particleColor);
        halo.addColorStop(1, 'rgba(0,0,0,0)');
        canvasContext.globalAlpha = particle.alpha * alive * phaseProgress * stageIntensity * 0.62;
        canvasContext.fillStyle = halo;
        canvasContext.beginPath();
        canvasContext.arc(x, y, radius * 1.85, 0, Math.PI * 2);
        canvasContext.fill();

        canvasContext.globalAlpha = particle.alpha * alive * phaseProgress * stageIntensity * 0.42;
        canvasContext.strokeStyle = particleColor;
        canvasContext.lineWidth = Math.max(0.6, particle.width * 0.6);
        canvasContext.beginPath();
        canvasContext.moveTo(x, y);
        canvasContext.lineTo(
          x - (Math.cos(swirlAngle) * driftTail),
          y - (Math.sin(swirlAngle) * driftTail)
        );
        canvasContext.stroke();

        canvasContext.globalAlpha = particle.alpha * alive * phaseProgress * stageIntensity;
        canvasContext.fillStyle = 'rgba(255,255,255,0.95)';
        canvasContext.beginPath();
        canvasContext.arc(x, y, radius * 0.42, 0, Math.PI * 2);
        canvasContext.fill();
      });

      canvasContext.globalCompositeOperation = 'source-over';
      canvasContext.globalAlpha = 1;
    }

    function drawSun(orbitProgress, timestamp) {
      const pulse = 0.92 + (Math.sin(timestamp * 0.0026) * 0.08);
      const coreSize = 24 + (orbitProgress * 14);

      const outerGlow = canvasContext.createRadialGradient(
        sceneState.centerX,
        sceneState.centerY,
        coreSize,
        sceneState.centerX,
        sceneState.centerY,
        sceneState.width * 0.13 * pulse
      );

      outerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.28)');
      outerGlow.addColorStop(0.25, 'rgba(255, 132, 89, 0.3)');
      outerGlow.addColorStop(0.6, 'rgba(255, 108, 196, 0.18)');
      outerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');

      canvasContext.fillStyle = outerGlow;
      canvasContext.fillRect(0, 0, sceneState.width, sceneState.height);

      sceneState.glowWaves.forEach(function (wave, index) {
        canvasContext.globalAlpha = wave.alpha * orbitProgress;
        canvasContext.strokeStyle = sceneState.colors.orbit;
        canvasContext.lineWidth = 1;
        canvasContext.beginPath();
        canvasContext.arc(sceneState.centerX, sceneState.centerY, wave.radius + (Math.sin((timestamp * 0.0011) + index) * 4), 0, Math.PI * 2);
        canvasContext.stroke();
      });

      canvasContext.globalAlpha = 1;

      const coreGradient = canvasContext.createRadialGradient(
        sceneState.centerX,
        sceneState.centerY,
        2,
        sceneState.centerX,
        sceneState.centerY,
        coreSize
      );

      coreGradient.addColorStop(0, 'rgba(255,252,238,1)');
      coreGradient.addColorStop(0.3, 'rgba(255,227,146,0.98)');
      coreGradient.addColorStop(0.62, 'rgba(255,168,76,0.92)');
      coreGradient.addColorStop(1, 'rgba(192,92,38,0.62)');

      canvasContext.fillStyle = coreGradient;
      canvasContext.beginPath();
      canvasContext.arc(sceneState.centerX, sceneState.centerY, coreSize, 0, Math.PI * 2);
      canvasContext.fill();

      canvasContext.save();
      canvasContext.translate(sceneState.centerX, sceneState.centerY);
      canvasContext.rotate(timestamp * 0.00028);
      canvasContext.globalAlpha = 0.19 * orbitProgress;
      canvasContext.strokeStyle = 'rgba(255, 246, 216, 0.74)';
      canvasContext.lineWidth = 0.95;
      for (let band = 0; band < 5; band += 1) {
        const ry = coreSize * (0.28 + (band * 0.14));
        canvasContext.beginPath();
        canvasContext.ellipse(0, 0, coreSize * (0.95 - (band * 0.07)), ry, 0.24, 0, Math.PI * 2);
        canvasContext.stroke();
      }
      canvasContext.restore();

      canvasContext.globalAlpha = 0.35 * orbitProgress;
      canvasContext.strokeStyle = 'rgba(255, 232, 188, 0.9)';
      canvasContext.lineWidth = 1.5;
      canvasContext.beginPath();
      canvasContext.arc(sceneState.centerX, sceneState.centerY, coreSize + 4 + (Math.sin(timestamp * 0.005) * 1.8), 0, Math.PI * 2);
      canvasContext.stroke();

      canvasContext.globalAlpha = 1;
    }

    function drawStarClusters(timelineProgress, timestamp) {
      const starFormationStart = sceneState.timelineSteps[5];
      const clustersVisibleProgress = Math.max(0, Math.min((timelineProgress - starFormationStart) / (1 - starFormationStart), 1));

      if (clustersVisibleProgress <= 0.01 || sceneState.starClusters.length === 0) {
        return;
      }

      sceneState.starClusters.forEach(function (cluster, clusterIndex) {
        const stagger = clusterIndex * 0.022;
        const local = Math.max(0, Math.min((clustersVisibleProgress - stagger) * 2.1, 1));
        if (local <= 0) {
          return;
        }

        const driftX = Math.sin((timestamp * 0.00007) + clusterIndex) * 1.4;
        const driftY = Math.cos((timestamp * 0.00006) + clusterIndex) * 1.2;
        const clusterX = cluster.x + driftX;
        const clusterY = cluster.y + driftY;
        const labelX = clusterX + cluster.labelOffsetX;
        const labelY = clusterY + cluster.labelOffsetY;

        const clusterHalo = canvasContext.createRadialGradient(clusterX, clusterY, 0, clusterX, clusterY, 28);
        clusterHalo.addColorStop(0, 'rgba(238,247,255,0.4)');
        clusterHalo.addColorStop(1, 'rgba(0,0,0,0)');

        canvasContext.globalAlpha = 0.28 * local;
        canvasContext.fillStyle = clusterHalo;
        canvasContext.beginPath();
        canvasContext.arc(clusterX, clusterY, 28, 0, Math.PI * 2);
        canvasContext.fill();

        cluster.stars.forEach(function (starPoint, starIndex) {
          const sx = clusterX + starPoint[0];
          const sy = clusterY + starPoint[1];
          const sparkle = 0.78 + (Math.sin((timestamp * 0.004) + starIndex + clusterIndex) * 0.22);
          const radius = starPoint[2] * (0.95 + (0.2 * sparkle));

          canvasContext.globalAlpha = 0.9 * local;
          canvasContext.fillStyle = starIndex % 3 === 0 ? 'rgba(204,228,255,0.98)' : 'rgba(244,250,255,0.97)';
          canvasContext.beginPath();
          canvasContext.arc(sx, sy, radius, 0, Math.PI * 2);
          canvasContext.fill();

          canvasContext.globalAlpha = 0.28 * local;
          canvasContext.fillStyle = 'rgba(255,255,255,0.9)';
          canvasContext.beginPath();
          canvasContext.arc(sx, sy, radius * 2.3, 0, Math.PI * 2);
          canvasContext.fill();

          canvasContext.globalAlpha = 0.42 * local;
          canvasContext.strokeStyle = 'rgba(255,255,255,0.86)';
          canvasContext.lineWidth = 0.55;
          canvasContext.beginPath();
          canvasContext.moveTo(sx - (radius * 1.6), sy);
          canvasContext.lineTo(sx + (radius * 1.6), sy);
          canvasContext.moveTo(sx, sy - (radius * 1.6));
          canvasContext.lineTo(sx, sy + (radius * 1.6));
          canvasContext.stroke();
        });

        canvasContext.font = '11px Tajawal, sans-serif';
        canvasContext.textAlign = 'left';

        const mainLabelWidth = canvasContext.measureText(cluster.name).width;
        const aliasRows = cluster.aliases.length;
        const boxWidth = mainLabelWidth + 12;
        const boxHeight = 16 + (aliasRows * 12);

        canvasContext.globalAlpha = 0.72 * local;
        canvasContext.fillStyle = 'rgba(4, 8, 20, 0.78)';
        canvasContext.fillRect(labelX - 6, labelY - 10, boxWidth, boxHeight);
        canvasContext.strokeStyle = 'rgba(180, 206, 244, 0.55)';
        canvasContext.lineWidth = 0.65;
        canvasContext.strokeRect(labelX - 6, labelY - 10, boxWidth, boxHeight);

        canvasContext.globalAlpha = 0.58 * local;
        canvasContext.strokeStyle = 'rgba(215, 229, 250, 0.78)';
        canvasContext.lineWidth = 0.6;
        canvasContext.beginPath();
        canvasContext.moveTo(clusterX + 6, clusterY - 2);
        canvasContext.lineTo(labelX - 7, labelY + 2);
        canvasContext.stroke();

        canvasContext.globalAlpha = 0.92 * local;
        canvasContext.fillStyle = 'rgba(238,246,255,0.98)';
        canvasContext.font = '11px Tajawal, sans-serif';
        canvasContext.fillText(cluster.name, labelX, labelY);

        cluster.aliases.forEach(function (aliasName, aliasIndex) {
          canvasContext.globalAlpha = 0.82 * local;
          canvasContext.fillStyle = 'rgba(218,232,252,0.96)';
          canvasContext.fillText(aliasName, labelX, labelY + cluster.aliasOffsetY + (aliasIndex * 12));
        });
      });

      canvasContext.globalAlpha = 1;
    }

    function drawTwinMoonSignature(timestamp, timelineProgress) {
      const reveal = smoothStep(0.06, 0.24, timelineProgress);
      if (reveal <= 0) {
        return;
      }

      const motifX = Math.max(84, Math.min(sceneState.width * 0.17, 180));
      const motifY = Math.max(72, Math.min(sceneState.height * 0.2, 154));
      const orbitScale = Math.max(24, Math.min(sceneState.width, sceneState.height) * 0.044);
      const orbitAlpha = 0.2 + (reveal * 0.55);
      const phase = timestamp * 0.00115;
      const orbitRadius = orbitScale;

      function sampleOrbit(angle) {
        return {
          x: motifX + (Math.cos(angle) * orbitRadius),
          y: motifY + (Math.sin(angle) * orbitRadius)
        };
      }

      canvasContext.save();

      canvasContext.globalAlpha = orbitAlpha * 0.34;
      canvasContext.strokeStyle = 'rgba(189, 215, 255, 0.95)';
      canvasContext.lineWidth = 1;
      canvasContext.beginPath();
      canvasContext.arc(motifX, motifY, orbitRadius, 0, Math.PI * 2);
      canvasContext.stroke();

      canvasContext.globalAlpha = orbitAlpha * 0.44;
      canvasContext.strokeStyle = 'rgba(212, 232, 255, 0.9)';
      canvasContext.lineWidth = 0.95;
      canvasContext.beginPath();
      canvasContext.moveTo(motifX, motifY - orbitRadius);
      canvasContext.bezierCurveTo(
        motifX + (orbitRadius * 0.72),
        motifY - (orbitRadius * 0.58),
        motifX + (orbitRadius * 0.72),
        motifY + (orbitRadius * 0.08),
        motifX,
        motifY
      );
      canvasContext.bezierCurveTo(
        motifX - (orbitRadius * 0.72),
        motifY + (orbitRadius * 0.58),
        motifX - (orbitRadius * 0.72),
        motifY + (orbitRadius * 0.58),
        motifX,
        motifY + orbitRadius
      );
      canvasContext.stroke();

      function drawMoonParticle(angle, label, fillColor, haloColor, labelOffsetX, labelOffsetY) {
        const point = sampleOrbit(angle);
        const radius = Math.max(3.5, orbitScale * 0.14);

        const halo = canvasContext.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius * 3.4);
        halo.addColorStop(0, haloColor);
        halo.addColorStop(1, 'rgba(0,0,0,0)');

        canvasContext.globalAlpha = 0.74 * reveal;
        canvasContext.fillStyle = halo;
        canvasContext.beginPath();
        canvasContext.arc(point.x, point.y, radius * 3.4, 0, Math.PI * 2);
        canvasContext.fill();

        canvasContext.globalAlpha = 0.96 * reveal;
        canvasContext.fillStyle = fillColor;
        canvasContext.beginPath();
        canvasContext.arc(point.x, point.y, radius, 0, Math.PI * 2);
        canvasContext.fill();

        canvasContext.globalAlpha = 0.88 * reveal;
        canvasContext.fillStyle = 'rgba(244, 250, 255, 0.98)';
        canvasContext.font = '700 10px Tajawal, sans-serif';
        canvasContext.textAlign = 'center';
        canvasContext.textBaseline = 'middle';
        canvasContext.fillText(label, point.x + labelOffsetX, point.y + labelOffsetY);
      }

      drawMoonParticle(
        phase,
        '01:12',
        'rgba(216, 236, 255, 0.98)',
        'rgba(176, 212, 255, 0.64)',
        0,
        -13
      );

      drawMoonParticle(
        phase + Math.PI,
        '07:12',
        'rgba(255, 222, 194, 0.98)',
        'rgba(255, 183, 142, 0.62)',
        0,
        13
      );

      canvasContext.restore();
      canvasContext.globalAlpha = 1;
    }

    function drawOrbitSystem(orbitProgress, timestamp) {
      const planetPositions = [];
      const quality = sceneState.qualityProfile || resolveQualityProfile();
      const systemScale = sceneState.width < 820 ? 1.28 : 1.52;

      sceneState.planets.forEach(function (planetConfig) {
        const angle = (timestamp * planetConfig.speed) + planetConfig.angleOffset;
        const orbitX = planetConfig.radius * systemScale;
        const orbitY = planetConfig.radius * planetConfig.eccentricity * systemScale;

        canvasContext.globalAlpha = 0.18 * orbitProgress;
        canvasContext.strokeStyle = sceneState.colors.orbit;
        canvasContext.lineWidth = 1;
        canvasContext.beginPath();
        canvasContext.ellipse(sceneState.centerX, sceneState.centerY, orbitX, orbitY, -0.35, 0, Math.PI * 2);
        canvasContext.stroke();

        const x = sceneState.centerX + (Math.cos(angle) * orbitX);
        const y = sceneState.centerY + (Math.sin(angle) * orbitY);
        const depth = (Math.sin(angle) + 1) * 0.5;

        planetPositions.push({
          x: x,
          y: y,
          depth: depth,
          angle: angle,
          config: planetConfig,
          size: planetConfig.size,
          orbitOrder: planetPositions.length
        });
      });

      planetPositions.sort(function (first, second) {
        return first.depth - second.depth;
      });

      planetPositions.forEach(function (planet) {
        const planetConfig = planet.config || {};
        const scale = 0.72 + (planet.depth * 0.55);
        const radius = planet.size * scale * (0.92 + (systemScale * 0.2));
        planet.renderRadius = radius;
        const surfacePhase = (timestamp * 0.00055) + (planet.orbitOrder * 1.37);
        const lightAngle = Math.atan2(sceneState.centerY - planet.y, sceneState.centerX - planet.x);
        const lightX = Math.cos(lightAngle);
        const lightY = Math.sin(lightAngle);
        const litGradient = canvasContext.createRadialGradient(
          planet.x + (lightX * radius * 0.52),
          planet.y + (lightY * radius * 0.52),
          Math.max(0.8, radius * 0.12),
          planet.x,
          planet.y,
          radius * 1.04
        );

        litGradient.addColorStop(0, planetConfig.colorLight || 'rgba(238,238,238,0.96)');
        litGradient.addColorStop(0.45, planetConfig.colorMid || 'rgba(170,170,170,0.94)');
        litGradient.addColorStop(1, planetConfig.colorDark || 'rgba(74,74,74,0.95)');

        if (planetConfig.ring) {
          canvasContext.globalAlpha = (planetConfig.ring.alpha || 0.42) * orbitProgress * (0.52 + (planet.depth * 0.4));
          canvasContext.strokeStyle = 'rgba(230, 215, 180, 0.92)';
          canvasContext.lineWidth = Math.max(1.2, radius * 0.2);
          canvasContext.beginPath();
          canvasContext.ellipse(
            planet.x,
            planet.y,
            radius * (planetConfig.ring.outerScale || 1.8),
            radius * 0.5,
            planetConfig.ring.tilt || -0.26,
            0,
            Math.PI * 2
          );
          canvasContext.stroke();
        }

        const glow = canvasContext.createRadialGradient(
          planet.x,
          planet.y,
          radius * 0.22,
          planet.x,
          planet.y,
          radius * 1.5
        );

        glow.addColorStop(0, 'rgba(255,255,255,0.2)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');

        canvasContext.globalAlpha = (0.36 + (planet.depth * 0.44)) * orbitProgress;
        canvasContext.fillStyle = glow;
        canvasContext.beginPath();
        canvasContext.arc(planet.x, planet.y, radius * 1.28, 0, Math.PI * 2);
        canvasContext.fill();

        canvasContext.globalAlpha = (0.76 + (planet.depth * 0.2)) * orbitProgress;
        canvasContext.fillStyle = litGradient;
        canvasContext.beginPath();
        canvasContext.arc(planet.x, planet.y, radius, 0, Math.PI * 2);
        canvasContext.fill();

        if (planetConfig.surface === 'gas' || planetConfig.surface === 'cloudy') {
          canvasContext.globalAlpha = (0.1 + (planet.depth * 0.08)) * orbitProgress;
          canvasContext.fillStyle = planetConfig.surface === 'gas' ? 'rgba(255,232,194,0.72)' : 'rgba(255,244,214,0.6)';
          for (let textureBand = 0; textureBand < quality.textureBands; textureBand += 1) {
            const bandY = planet.y + (((textureBand - 1.5) * radius * 0.3) + (Math.sin(surfacePhase + textureBand) * radius * 0.08));
            canvasContext.beginPath();
            canvasContext.ellipse(planet.x + (Math.cos(surfacePhase + textureBand) * radius * 0.06), bandY, radius * 0.72, radius * 0.15, -0.22, 0, Math.PI * 2);
            canvasContext.fill();
          }
        }

        if (planetConfig.surface === 'rocky' || planetConfig.surface === 'oceanic') {
          canvasContext.globalAlpha = (0.08 + (planet.depth * 0.08)) * orbitProgress;
          canvasContext.fillStyle = planetConfig.surface === 'oceanic' ? 'rgba(136,214,166,0.7)' : 'rgba(182,168,148,0.64)';
          const featureCount = planetConfig.surface === 'oceanic' ? 4 : 3;
          for (let featureIndex = 0; featureIndex < featureCount; featureIndex += 1) {
            const featureAngle = surfacePhase + (featureIndex * 1.6);
            const fx = planet.x + (Math.cos(featureAngle) * radius * 0.34);
            const fy = planet.y + (Math.sin(featureAngle * 1.15) * radius * 0.3);
            canvasContext.beginPath();
            canvasContext.ellipse(fx, fy, radius * 0.18, radius * 0.11, featureAngle * 0.2, 0, Math.PI * 2);
            canvasContext.fill();
          }
        }

        const nightGradient = canvasContext.createRadialGradient(
          planet.x - (lightX * radius * 0.75),
          planet.y - (lightY * radius * 0.75),
          radius * 0.15,
          planet.x,
          planet.y,
          radius * 1.2
        );
        nightGradient.addColorStop(0, 'rgba(0,0,0,0.05)');
        nightGradient.addColorStop(1, 'rgba(0,0,0,0.44)');

        canvasContext.globalAlpha = (0.5 + (planet.depth * 0.18)) * orbitProgress;
        canvasContext.fillStyle = nightGradient;
        canvasContext.beginPath();
        canvasContext.arc(planet.x, planet.y, radius * 0.98, 0, Math.PI * 2);
        canvasContext.fill();

        canvasContext.globalAlpha = (0.2 + (planet.depth * 0.12)) * orbitProgress;
        canvasContext.strokeStyle = 'rgba(255,255,255,0.5)';
        canvasContext.lineWidth = 0.85;
        canvasContext.beginPath();
        canvasContext.arc(planet.x, planet.y, radius + 1.4, 0, Math.PI * 2);
        canvasContext.stroke();

        if (planetConfig.ring) {
          canvasContext.save();
          canvasContext.beginPath();
          canvasContext.arc(planet.x, planet.y, radius * 0.95, 0, Math.PI * 2);
          canvasContext.clip();
          canvasContext.globalAlpha = (planetConfig.ring.alpha || 0.42) * orbitProgress * 0.84;
          canvasContext.strokeStyle = 'rgba(248, 232, 196, 0.96)';
          canvasContext.lineWidth = Math.max(1.1, radius * 0.14);
          canvasContext.beginPath();
          canvasContext.ellipse(
            planet.x,
            planet.y,
            radius * (planetConfig.ring.innerScale || 1.35),
            radius * 0.43,
            planetConfig.ring.tilt || -0.26,
            0,
            Math.PI * 2
          );
          canvasContext.stroke();
          canvasContext.restore();
        }

        if ((planetConfig.moonCount || 0) > 0) {
          for (let moonIndex = 0; moonIndex < planetConfig.moonCount; moonIndex += 1) {
            const moonAngle = (timestamp * (0.0031 + (moonIndex * 0.00065))) + planet.depth + (moonIndex * Math.PI * 0.8);
            const moonOrbit = radius + 4.8 + (moonIndex * 3.2);
            const moonSize = 1.2 + (moonIndex * 0.45);
            const moonX = planet.x + (Math.cos(moonAngle) * moonOrbit);
            const moonY = planet.y + (Math.sin(moonAngle) * (moonOrbit * 0.86));

            const moonGradient = canvasContext.createRadialGradient(
              moonX - 0.8,
              moonY - 0.8,
              0,
              moonX,
              moonY,
              moonSize * 1.4
            );

            moonGradient.addColorStop(0, 'rgba(255,255,255,0.96)');
            moonGradient.addColorStop(0.5, 'rgba(218,226,242,0.92)');
            moonGradient.addColorStop(1, 'rgba(110,122,150,0.65)');

            canvasContext.globalAlpha = (0.52 - (moonIndex * 0.08)) * orbitProgress;
            canvasContext.fillStyle = moonGradient;
            canvasContext.beginPath();
            canvasContext.arc(moonX, moonY, moonSize, 0, Math.PI * 2);
            canvasContext.fill();

            if (quality.moonDetail) {
              canvasContext.globalAlpha = 0.2 * orbitProgress;
              canvasContext.fillStyle = 'rgba(255,255,255,0.5)';
              canvasContext.beginPath();
              canvasContext.arc(moonX + (moonSize * 0.24), moonY + (moonSize * 0.1), moonSize * 0.2, 0, Math.PI * 2);
              canvasContext.fill();
            }
          }
        }
      });

      canvasContext.globalAlpha = 1;
      return planetPositions;
    }

    function renderFrame(timestamp) {
      if (!sceneState.active || !canvasContext) {
        sceneState.rafId = null;
        return;
      }

      const elapsed = timestamp - sceneState.phaseStart;
      const timelineProgress = Math.max(0, Math.min(elapsed / sceneState.timing.timelineDuration, 1));
      const bigBangProgress = Math.min(elapsed / sceneState.timing.bigBangDuration, 1);
      const galaxyElapsed = Math.max(0, elapsed - sceneState.timing.galaxyDelay);
      const galaxyProgress = Math.min(galaxyElapsed / sceneState.timing.galaxyDuration, 1);
      const solarSystemStart = sceneState.timelineSteps[7];
      const orbitProgress = Math.max(0, Math.min((timelineProgress - solarSystemStart) / (1 - solarSystemStart), 1));
      const bigBangVisibility = 1 - smoothStep(0.14, 0.38, timelineProgress);
      const darkness = 0.2 + (easeInOut(timelineProgress) * 0.68);

      canvasContext.clearRect(0, 0, sceneState.width, sceneState.height);
      solarScene.style.setProperty('--space-darkness', darkness.toFixed(3));

      if (orbitProgress > 0.02) {
        body.classList.add('space-orbit-active');
      } else {
        body.classList.remove('space-orbit-active');
      }

      updatePresentationClock(timelineProgress);

      updateTimeline(timelineProgress);
      updateSoundtrack(timelineProgress, timestamp);

      if (bigBangVisibility > 0.01) {
        drawBigBang(bigBangProgress * bigBangVisibility, elapsed, timelineProgress);
      }

      if (galaxyProgress > 0.02) {
        drawGalaxy(galaxyProgress, timestamp, timelineProgress);
      }

      drawStarClusters(timelineProgress, timestamp);
      drawTwinMoonSignature(timestamp, timelineProgress);

      if (orbitProgress > 0.04) {
        drawSun(orbitProgress, timestamp);
        const planetPositions = drawOrbitSystem(orbitProgress, timestamp);
      }

      sceneState.rafId = requestAnimationFrame(renderFrame);
    }

    function handlePointerToggle(event) {
      event.preventDefault();
      event.stopPropagation();

      sceneState.tapLocked = !sceneState.tapLocked;

      if (sceneState.tapLocked) {
        activateScene();
        sceneState.justActivatedAt = performance.now();
      } else {
        deactivateScene(true);
      }
    }

    spaceTrigger.addEventListener('click', handlePointerToggle);

    spaceTrigger.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        handlePointerToggle(event);
      }
    });

    document.addEventListener('click', function (event) {
      if (!sceneState.active) {
        return;
      }

      const elapsedSinceActivation = performance.now() - sceneState.justActivatedAt;
      if (elapsedSinceActivation < 120) {
        return;
      }

      sceneState.tapLocked = false;
      deactivateScene(true);
    });

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        stopRenderLoop();
        if (sceneState.audio.mediaElement && sceneState.audio.enabled) {
          sceneState.audio.mediaElement.pause();
        }
        if (sceneState.audio.context && sceneState.audio.enabled) {
          sceneState.audio.context.suspend().catch(function () {});
        }
      } else if (sceneState.active) {
        startRenderLoop();
        if (sceneState.audio.mediaElement && sceneState.audio.enabled) {
          sceneState.audio.mediaElement.play().catch(function () {});
        }
        if (sceneState.audio.context && sceneState.audio.enabled) {
          sceneState.audio.context.resume().catch(function () {});
        }
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && sceneState.active) {
        sceneState.tapLocked = false;
        deactivateScene(true);
      }
    });

  }


  // Menu
  function menu() {
    menuToggle.classList.toggle("is-open");
    menuList.classList.toggle("is-visible");
  }

  // Dropdown Menu
  document.querySelectorAll('.dropdown-toggle').forEach(function(toggle) {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();

      document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
        if (menu !== toggle.nextElementSibling) {
          menu.classList.remove('is-visible');
        }
      });

      this.nextElementSibling.classList.toggle('is-visible');
    });
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav__item')) {
      document.querySelectorAll('.dropdown-menu').forEach(function(menu) {
        menu.classList.remove('is-visible');
      });
    }
  });


  // Search
  function searchOpen() {
    search.classList.add("is-visible");
    body.classList.add("search-is-visible");
    globalWrap.classList.add("is-active");
    menuToggle.classList.remove("is-open");
    menuList.classList.remove("is-visible");
    setTimeout(function () {
      searchInput.focus();
    }, 250);
  }

  function searchClose() {
    search.classList.remove("is-visible");
    body.classList.remove("search-is-visible");
    globalWrap.classList.remove("is-active");
  }

  document.addEventListener('keydown', function(e){
    if (e.key == 'Escape') {
      searchClose();
    }
  });


  // Theme Switcher
  if (toggleTheme && isToggleEnabled) {
    toggleTheme.addEventListener("click", () => {
      const isDarkMode = html.classList.contains("dark-mode");
      if (isDarkMode) {
        setTheme("light");
        localStorage.setItem("theme", "light");
      } else {
        setTheme("dark");
        localStorage.setItem("theme", "dark");
      }
    });
  }


  // Blog List View
  function viewToggle() {
    if (html.classList.contains('view-list')) {
      html.classList.remove('view-list');
      localStorage.removeItem("classView");
      document.documentElement.removeAttribute("list");
    } else {
      html.classList.add('view-list');
      localStorage.setItem("classView", "list");
      document.documentElement.setAttribute("list", "");
    }
  }


  /* ============================
  // Logos Slider
  ============================ */
  if (splides) {
    new Splide(splides, {
      direction: 'ltr',
      clones: 8,
      gap: 16,
      autoWidth: true,
      drag: true,
      arrows: false,
      pagination: false,
      type: 'loop',
      autoScroll: {
        autoStart: true,
        speed: 0.4,
        pauseOnHover: false,
        pauseOnFocus: false
      },
      intersection: {
        inView: {
          autoScroll: true,
        },
        outView: {
          autoScroll: false,
        }
      },
    }).mount(window.splide.Extensions);
  }


  /* ================================================================
  // Stop Animations During Window Resizing and Switching Theme Modes
  ================================================================ */
  let disableTransition;

  if (toggleTheme) {
    toggleTheme.addEventListener("click", () => {
      stopAnimation();
    });
  }

  window.addEventListener("resize", () => {
    stopAnimation();
  });

  function stopAnimation() {
    document.body.classList.add("disable-animation");
    clearTimeout(disableTransition);
    disableTransition = setTimeout(() => {
      document.body.classList.remove("disable-animation");
    }, 100);
  };


  // =====================
  // Simple Jekyll Search
  // =====================
  SimpleJekyllSearch({
    searchInput: document.getElementById("js-search-input"),
    resultsContainer: document.getElementById("js-results-container"),
    json: "/search.json",
    searchResultTemplate: '{article}',
    noResultsText: '<div class="no-results">No results found...</div>'
  });


  /* =======================
  // Responsive Videos
  ======================= */
  reframe(".post__content iframe:not(.reframe-off), .page__content iframe:not(.reframe-off)");


  /* =======================
  // LazyLoad Images
  ======================= */
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy"
  })


  /* =======================
  // Zoom Image
  ======================= */
  if (imagesOverlay) {
    const images = document.querySelectorAll('.post__content img, .page__content img, .gallery__image img');

    const clearOverlay = () => {
      imagesOverlay.classList.remove('active');
      imagesOverlay.innerHTML = '';
    };

    const createImageElement = (src) => {
      const img = document.createElement('img');
      img.src = src;
      return img;
    };

    const createDescriptionElement = (description) => {
      const descriptionElem = document.createElement('p');
      descriptionElem.textContent = description;
      descriptionElem.classList.add('image-overlay__description');
      return descriptionElem;
    };

    images.forEach(image => {
      image.addEventListener('click', () => {
        const galleryImage = image.closest('.gallery__image');
        const description = galleryImage?.querySelector('.gallery__image__caption')?.textContent || '';
        imagesOverlay.classList.add('active');

        imagesOverlay.innerHTML = '';
        imagesOverlay.appendChild(createImageElement(image.dataset.src || image.src));

        if (description) {
          imagesOverlay.appendChild(createDescriptionElement(description));
        }
      });
    });

    imagesOverlay.addEventListener('click', clearOverlay);
  }


  // =====================
  // Copy Code Button
  // =====================
  document.querySelectorAll('.post__content pre.highlight, .page__content pre.highlight')
  .forEach(function (pre) {
    const existingGutter = pre.querySelector('.code-gutter');
    if (existingGutter) {
      existingGutter.remove();
    }

    if (pre.dataset.lang) {
      delete pre.dataset.lang;
    }

    const existingCopyButton = pre.querySelector('button');
    if (existingCopyButton) {
      existingCopyButton.remove();
    }

    const sourceElement = code || pre;
    const lineText = (sourceElement.innerText || '').replace(/\n$/, '');
    const lineCount = Math.max(lineText.split('\n').length, 1);

    const gutter = document.createElement('span');
    gutter.className = 'code-gutter';
    gutter.setAttribute('aria-hidden', 'true');

    for (let line = 1; line <= lineCount; line += 1) {
      const lineNumber = document.createElement('span');
      lineNumber.textContent = String(line);
      gutter.appendChild(lineNumber);
    }

    pre.insertBefore(gutter, code);

    const button = document.createElement('button');
    const copyText = 'Copy';
    button.type = 'button';
    button.ariaLabel = 'Copy code to clipboard';
    button.innerText = copyText;
    button.addEventListener('click', function () {
      const copySource = pre.querySelector('code') || pre;
      let code = copySource.innerText;
      try {
        code = code.trimEnd();
      } catch (e) {
        code = code.trim();
      }
      navigator.clipboard.writeText(code);
      button.innerText = 'Copied!';
      setTimeout(function () {
        button.blur();
        button.innerText = copyText;
      }, 2e3);
    });
    pre.appendChild(button);
  });


  // =====================
  // Load More Posts
  // =====================
  var load_posts_button=document.querySelector(".load-more-posts");

  load_posts_button&&load_posts_button.addEventListener("click",function(e){e.preventDefault();var t=load_posts_button.textContent;load_posts_button.classList.add("button--loading"),load_posts_button.textContent="Loading";var o=document.querySelector(".pagination"),n=pagination_next_url.split("/page")[0]+"/page/"+pagination_next_page_number+"/";fetch(n).then(function(e){if(e.ok)return e.text()}).then(function(e){var n=document.createElement("div");n.innerHTML=e;for(var a=document.querySelector(".grid"),i=n.querySelectorAll(".grid__post"),l=0;l<i.length;l++)a.appendChild(i.item(l));new LazyLoad({elements_selector:".lazy"}),pagination_next_page_number++,pagination_next_page_number>pagination_available_pages_number&&(o.style.display="none")}).finally(function(){load_posts_button.classList.remove("button--loading"),load_posts_button.textContent=t})});


  /* =======================
  // Scroll Top Button
  ======================= */
  window.addEventListener("scroll", function () {
  window.scrollY > window.innerHeight ? btnScrollToTop.classList.add("is-active") : btnScrollToTop.classList.remove("is-active");
  });

  btnScrollToTop.addEventListener("click", function () {
    if (window.scrollY != 0) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      })
    }
  });

});
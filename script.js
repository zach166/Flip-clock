(() => {
  const UNIT_IDS = ["h1", "h2", "m1", "m2", "s1", "s2"];
  const units = {};
  const values = {};
  const use24Hour = false;

  function buildUnit(el, initialValue) {
    el.innerHTML = `
      <div class="half top-static"><div class="digit">${initialValue}</div></div>
      <div class="half bottom-static"><div class="digit">${initialValue}</div></div>
      <div class="half flap-top"><div class="digit">${initialValue}</div></div>
      <div class="half flap-bottom"><div class="digit">${initialValue}</div></div>
    `;
    return {
      root: el,
      topStatic: el.querySelector(".top-static .digit"),
      bottomStatic: el.querySelector(".bottom-static .digit"),
      flapTop: el.querySelector(".flap-top"),
      flapTopDigit: el.querySelector(".flap-top .digit"),
      flapBottom: el.querySelector(".flap-bottom"),
      flapBottomDigit: el.querySelector(".flap-bottom .digit"),
      animating: false,
    };
  }

  function init() {
    const now = new Date();
    const parts = getTimeParts(now);
    UNIT_IDS.forEach((id) => {
      const el = document.querySelector(`[data-unit="${id}"]`);
      values[id] = parts[id];
      units[id] = buildUnit(el, parts[id]);
    });
    updateMeta(now);
  }

  function getTimeParts(date) {
    let hours = date.getHours();
    let ampm = hours >= 12 ? "PM" : "AM";
    if (!use24Hour) {
      hours = hours % 12;
      if (hours === 0) hours = 12;
    }
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const hh = String(hours).padStart(2, "0");
    const mm = String(minutes).padStart(2, "0");
    const ss = String(seconds).padStart(2, "0");
    return {
      h1: hh[0], h2: hh[1],
      m1: mm[0], m2: mm[1],
      s1: ss[0], s2: ss[1],
      ampm,
    };
  }

  function flip(unit, newValue) {
    unit.animating = true;

    const oldValue = unit.topStatic.textContent;

    // Reset flaps instantly to starting position with correct content
    unit.flapTop.classList.remove("flipping-top");
    unit.flapBottom.classList.remove("flipping-bottom");
    unit.flapTopDigit.textContent = oldValue;
    unit.flapBottomDigit.textContent = newValue;
    unit.flapTop.style.transform = "rotateX(0deg)";
    unit.flapBottom.style.transform = "rotateX(90deg)";

    // Update the resting top half to the new value now (hidden underneath flapTop)
    unit.topStatic.textContent = newValue;

    // Force reflow so the reset above is applied before we transition
    void unit.flapTop.offsetHeight;

    requestAnimationFrame(() => {
      unit.flapTop.classList.add("flipping-top");
      unit.flapTop.style.transform = "rotateX(-90deg)";
    });

    const halfDuration = parseFloat(getComputedStyle(document.documentElement)
      .getPropertyValue("--flip-duration")) || 320;

    setTimeout(() => {
      // top flap has folded away; reveal the bottom flap falling into place
      unit.bottomStatic.textContent = newValue;
      unit.flapBottom.classList.add("flipping-bottom");
      unit.flapBottom.style.transform = "rotateX(0deg)";

      setTimeout(() => {
        unit.animating = false;
      }, halfDuration);
    }, halfDuration);
  }

  function updateMeta(date) {
    const dateLabel = document.getElementById("dateLabel");
    const ampmLabel = document.getElementById("ampmLabel");
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    dateLabel.textContent = date.toLocaleDateString(undefined, options);
    ampmLabel.textContent = use24Hour ? "" : (date.getHours() >= 12 ? "PM" : "AM");
  }

  function tick() {
    const now = new Date();
    const parts = getTimeParts(now);
    UNIT_IDS.forEach((id) => {
      if (values[id] !== parts[id]) {
        values[id] = parts[id];
        flip(units[id], parts[id]);
      }
    });
    updateMeta(now);
  }

  function scheduleNextTick() {
    const now = new Date();
    const msToNextSecond = 1000 - now.getMilliseconds();
    setTimeout(() => {
      tick();
      scheduleNextTick();
    }, msToNextSecond);
  }

  function start() {
    init();
    scheduleNextTick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

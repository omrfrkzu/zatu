// ================= Animated Counter Component =====================
class Counter {
  constructor(element, value, duration = 800) {
    this.element = element;
    this.value = value;
    this.duration = duration;
    this.currentValue = 0;
    this.startTime = null;
    this.animationId = null;
  }

  formatNumber(num) {
    return num.toLocaleString('tr-TR');
  }

  animate() {
    if (this.startTime === null) {
      this.startTime = performance.now();
    }

    const elapsed = performance.now() - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    this.currentValue = Math.round(this.value * easeOut);
    
    this.element.textContent = this.formatNumber(this.currentValue);

    if (progress < 1) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.currentValue = this.value;
      this.element.textContent = this.formatNumber(this.value);
    }
  }

  start() {
    this.currentValue = 0;
    this.startTime = null;
    this.element.textContent = '0';
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  update(newValue) {
    if (newValue !== this.value) {
      this.value = newValue;
      this.start();
    }
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}


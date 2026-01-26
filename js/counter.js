
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

  animate(timestamp) {
    if (this.startTime === null) {
      this.startTime = timestamp || performance.now();
    }

    const elapsed = (timestamp || performance.now()) - this.startTime;
    const progress = Math.min(elapsed / this.duration, 1);
    
    
    const easeOut = 1 - Math.pow(1 - progress, 3);
    this.currentValue = Math.round(this.value * easeOut);
    
    this.element.textContent = this.formatNumber(this.currentValue);

    if (progress < 1) {
      this.animationId = requestAnimationFrame((t) => this.animate(t));
    } else {
      
      this.currentValue = this.value;
      this.element.textContent = this.formatNumber(this.value);
      this.animationId = null;
    }
  }

  start() {
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    
    this.currentValue = 0;
    this.startTime = null;
    this.element.textContent = this.formatNumber(0);
    this.animationId = requestAnimationFrame((t) => this.animate(t));
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


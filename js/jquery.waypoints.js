
(function() {
    'use strict'
  
    var keyCounter = 0
    var allWaypoints = {}
  
    
    Waypoint.prototype.queueTrigger = function(direction) {
      this.group.queueTrigger(this, direction)
    }
  
    
    Waypoint.prototype.trigger = function(args) {
      if (!this.enabled) {
        return
      }
      if (this.callback) {
        this.callback.apply(this, args)
      }
    }
  
    
    
    
    
    
    
    Waypoint.invokeAll = function(method) {
      var allWaypointsArray = []
      for (var waypointKey in allWaypoints) {
        allWaypointsArray.push(allWaypoints[waypointKey])
      }
      for (var i = 0, end = allWaypointsArray.length; i < end; i++) {
        allWaypointsArray[i][method]()
      }
    }
  
    
    
    
    
    
    
    
    Context.prototype.add = function(waypoint) {
      var axis = waypoint.options.horizontal ? 'horizontal' : 'vertical'
      this.waypoints[axis][waypoint.key] = waypoint
      this.refresh()
    }
  
    
    Context.prototype.checkEmpty = function() {
      var horizontalEmpty = this.Adapter.isEmptyObject(this.waypoints.horizontal)
      var verticalEmpty = this.Adapter.isEmptyObject(this.waypoints.vertical)
      if (horizontalEmpty && verticalEmpty) {
        this.adapter.off('.waypoints')
        delete contexts[this.key]
      }
    }
  
    
    Context.prototype.createThrottledResizeHandler = function() {
      var self = this
  
      function resizeHandler() {
        self.handleResize()
        self.didResize = false
      }
  
      this.adapter.on('resize.waypoints', function() {
        if (!self.didResize) {
          self.didResize = true
          Waypoint.requestAnimationFrame(resizeHandler)
        }
      })
    }
  
    
    Context.prototype.createThrottledScrollHandler = function() {
      var self = this
      function scrollHandler() {
        self.handleScroll()
        self.didScroll = false
      }
  
      this.adapter.on('scroll.waypoints', function() {
        if (!self.didScroll || Waypoint.isTouch) {
          self.didScroll = true
          Waypoint.requestAnimationFrame(scrollHandler)
        }
      })
    }
  
    
    Context.prototype.handleResize = function() {
      Waypoint.Context.refreshAll()
    }
  
    
    Context.prototype.handleScroll = function() {
      var triggeredGroups = {}
      var axes = {
        horizontal: {
          newScroll: this.adapter.scrollLeft(),
          oldScroll: this.oldScroll.x,
          forward: 'right',
          backward: 'left'
        },
        vertical: {
          newScroll: this.adapter.scrollTop(),
          oldScroll: this.oldScroll.y,
          forward: 'down',
          backward: 'up'
        }
      }
  
      for (var axisKey in axes) {
        var axis = axes[axisKey]
        var isForward = axis.newScroll > axis.oldScroll
        var direction = isForward ? axis.forward : axis.backward
  
        for (var waypointKey in this.waypoints[axisKey]) {
          var waypoint = this.waypoints[axisKey][waypointKey]
          var wasBeforeTriggerPoint = axis.oldScroll < waypoint.triggerPoint
          var nowAfterTriggerPoint = axis.newScroll >= waypoint.triggerPoint
          var crossedForward = wasBeforeTriggerPoint && nowAfterTriggerPoint
          var crossedBackward = !wasBeforeTriggerPoint && !nowAfterTriggerPoint
          if (crossedForward || crossedBackward) {
            waypoint.queueTrigger(direction)
            triggeredGroups[waypoint.group.id] = waypoint.group
          }
        }
      }
  
      for (var groupKey in triggeredGroups) {
        triggeredGroups[groupKey].flushTriggers()
      }
  
      this.oldScroll = {
        x: axes.horizontal.newScroll,
        y: axes.vertical.newScroll
      }
    }
  
    
    Context.prototype.innerHeight = function() {
      
      if (this.element == this.element.window) {
        return Waypoint.viewportHeight()
      }
      
      return this.adapter.innerHeight()
    }
  
    
    Context.prototype.remove = function(waypoint) {
      delete this.waypoints[waypoint.axis][waypoint.key]
      this.checkEmpty()
    }
  
    
    Context.prototype.innerWidth = function() {
      
      if (this.element == this.element.window) {
        return Waypoint.viewportWidth()
      }
      
      return this.adapter.innerWidth()
    }
  
    
    
    
      var isWindow = this.element == this.element.window
      
      var contextOffset = isWindow ? undefined : this.adapter.offset()
      var triggeredGroups = {}
      var axes
  
      this.handleScroll()
      axes = {
        horizontal: {
          contextOffset: isWindow ? 0 : contextOffset.left,
          contextScroll: isWindow ? 0 : this.oldScroll.x,
          contextDimension: this.innerWidth(),
          oldScroll: this.oldScroll.x,
          forward: 'right',
          backward: 'left',
          offsetProp: 'left'
        },
        vertical: {
          contextOffset: isWindow ? 0 : contextOffset.top,
          contextScroll: isWindow ? 0 : this.oldScroll.y,
          contextDimension: this.innerHeight(),
          oldScroll: this.oldScroll.y,
          forward: 'down',
          backward: 'up',
          offsetProp: 'top'
        }
      }
  
      for (var axisKey in axes) {
        var axis = axes[axisKey]
        for (var waypointKey in this.waypoints[axisKey]) {
          var waypoint = this.waypoints[axisKey][waypointKey]
          var adjustment = waypoint.options.offset
          var oldTriggerPoint = waypoint.triggerPoint
          var elementOffset = 0
          var freshWaypoint = oldTriggerPoint == null
          var contextModifier, wasBeforeScroll, nowAfterScroll
          var triggeredBackward, triggeredForward
  
          if (waypoint.element !== waypoint.element.window) {
            elementOffset = waypoint.adapter.offset()[axis.offsetProp]
          }
  
          if (typeof adjustment === 'function') {
            adjustment = adjustment.apply(waypoint)
          }
          else if (typeof adjustment === 'string') {
            adjustment = parseFloat(adjustment)
            if (waypoint.options.offset.indexOf('%') > - 1) {
              adjustment = Math.ceil(axis.contextDimension * adjustment / 100)
            }
          }
  
          contextModifier = axis.contextScroll - axis.contextOffset
          waypoint.triggerPoint = elementOffset + contextModifier - adjustment
          wasBeforeScroll = oldTriggerPoint < axis.oldScroll
          nowAfterScroll = waypoint.triggerPoint >= axis.oldScroll
          triggeredBackward = wasBeforeScroll && nowAfterScroll
          triggeredForward = !wasBeforeScroll && !nowAfterScroll
  
          if (!freshWaypoint && triggeredBackward) {
            waypoint.queueTrigger(axis.backward)
            triggeredGroups[waypoint.group.id] = waypoint.group
          }
          else if (!freshWaypoint && triggeredForward) {
            waypoint.queueTrigger(axis.forward)
            triggeredGroups[waypoint.group.id] = waypoint.group
          }
          else if (freshWaypoint && axis.oldScroll >= waypoint.triggerPoint) {
            waypoint.queueTrigger(axis.forward)
            triggeredGroups[waypoint.group.id] = waypoint.group
          }
        }
      }
  
      Waypoint.requestAnimationFrame(function() {
        for (var groupKey in triggeredGroups) {
          triggeredGroups[groupKey].flushTriggers()
        }
      })
  
      return this
    }
  
    
    Context.findOrCreateByElement = function(element) {
      return Context.findByElement(element) || new Context(element)
    }
  
    
    Context.refreshAll = function() {
      for (var contextId in contexts) {
        contexts[contextId].refresh()
      }
    }
  
    
    
    Group.prototype.add = function(waypoint) {
      this.waypoints.push(waypoint)
    }
  
    
    Group.prototype.clearTriggerQueues = function() {
      this.triggerQueues = {
        up: [],
        down: [],
        left: [],
        right: []
      }
    }
  
    
    Group.prototype.flushTriggers = function() {
      for (var direction in this.triggerQueues) {
        var waypoints = this.triggerQueues[direction]
        var reverse = direction === 'up' || direction === 'left'
        waypoints.sort(reverse ? byReverseTriggerPoint : byTriggerPoint)
        for (var i = 0, end = waypoints.length; i < end; i += 1) {
          var waypoint = waypoints[i]
          if (waypoint.options.continuous || i === waypoints.length - 1) {
            waypoint.trigger([direction])
          }
        }
      }
      this.clearTriggerQueues()
    }
  
    
    Group.prototype.next = function(waypoint) {
      this.waypoints.sort(byTriggerPoint)
      var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
      var isLast = index === this.waypoints.length - 1
      return isLast ? null : this.waypoints[index + 1]
    }
  
    
    Group.prototype.previous = function(waypoint) {
      this.waypoints.sort(byTriggerPoint)
      var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
      return index ? this.waypoints[index - 1] : null
    }
  
    
    Group.prototype.queueTrigger = function(waypoint, direction) {
      this.triggerQueues[direction].push(waypoint)
    }
  
    
    Group.prototype.remove = function(waypoint) {
      var index = Waypoint.Adapter.inArray(waypoint, this.waypoints)
      if (index > -1) {
        this.waypoints.splice(index, 1)
      }
    }
  
    
    
    
    Group.findOrCreate = function(options) {
      return groups[options.axis][options.name] || new Group(options)
    }
  
    Waypoint.Group = Group
  }())
  ;(function() {
    'use strict'
  
    var $ = window.jQuery
    var Waypoint = window.Waypoint
  
    function JQueryAdapter(element) {
      this.$element = $(element)
    }
  
    $.each([
      'innerHeight',
      'innerWidth',
      'off',
      'offset',
      'on',
      'outerHeight',
      'outerWidth',
      'scrollLeft',
      'scrollTop'
    ], function(i, method) {
      JQueryAdapter.prototype[method] = function() {
        var args = Array.prototype.slice.call(arguments)
        return this.$element[method].apply(this.$element, args)
      }
    })
  
    $.each([
      'extend',
      'inArray',
      'isEmptyObject'
    ], function(i, method) {
      JQueryAdapter[method] = $[method]
    })
  
    Waypoint.adapters.push({
      name: 'jquery',
      Adapter: JQueryAdapter
    })
    Waypoint.Adapter = JQueryAdapter
  }())
  ;(function() {
    'use strict'
  
    var Waypoint = window.Waypoint
  
    function createExtension(framework) {
      return function() {
        var waypoints = []
        var overrides = arguments[0]
  
        if (framework.isFunction(arguments[0])) {
          overrides = framework.extend({}, arguments[1])
          overrides.handler = arguments[0]
        }
  
        this.each(function() {
          var options = framework.extend({}, overrides, {
            element: this
          })
          if (typeof options.context === 'string') {
            options.context = framework(this).closest(options.context)[0]
          }
          waypoints.push(new Waypoint(options))
        })
  
        return waypoints
      }
    }
  
    if (window.jQuery) {
      window.jQuery.fn.waypoint = createExtension(window.jQuery)
    }
    if (window.Zepto) {
      window.Zepto.fn.waypoint = createExtension(window.Zepto)
    }
  }())
  ;
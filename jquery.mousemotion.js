/**
 * JQuery MouseMotion adds a event function (mousemotion) whose handler receives more information about the motion
 * of the mouse.  The mousemotion function wraps the mousemove function.
 *
 * @requires JQuery
 **/
(function( $ ) {

  /**
   * The MouseMotion namespace contains data related to the mousemotion event function.
   **/
  $.MouseMotion = new function() {

      /* The number of miliseconds that must pass between executions of the mousemotion handler */
      var THROTTLE_DEAFULT_WAIT = 100;

      /**
       * Attach a mousemove listener to the set of matched elements, which receives both an
       * Event and Frame object.  The Frame object contains information about the mouse's motion.
       *
       * @param {object} eventData A map of data that will be passed to the event handler.
       * @param {function(eventObject, frame)} handler A function to execute each time the event is triggered.
       * @param {boolean} shouldThrottle A boolean that indicates if the handler should not be called more than once per throttleWait milliseconds.
       * @param {number} throttleWait A number that specifies that number of milliseconds that must pass before each invocation of the handler function.
       * @return {array} The set of matched elements.
       **/
      this.mousemotion = function( eventData, handler, shouldThrottle, throttleWait ) {
        var lastFrame, proxyHandler;

        if( handler == null ) {
          handler = eventData;
          eventData = null;
        }

        // default to throttling
        if( typeof shouldThrottle === 'undefined' ) {
          shouldThrottle = true;
        }

        // set default throttle wait
        if( typeof throttleWait === 'undefined' ) {
          throttleWait = THROTTLE_DEAFULT_WAIT;
        }

        proxyHandler = function( event ) {
            var frame = new Frame( event.pageX, event.pageY, event.timeStamp, lastFrame );
            lastFrame = frame;
            handler.call( this, event, frame );
        };

        proxyHandler = shouldThrottle && throttle( proxyHandler, throttleWait ) || proxyHandler;

        return this.mousemove( eventData, proxyHandler );
      };

      /**
       * Ensure that a function fun is called no more than once per wait milliseconds.
       *
       * @see http://ryhan.org/post/33374611308/limiting-function-calls
       * @param {function} fun The function to be throttled
       * @param {number} wait The number of miliseconds that must pass before the next execution
       **/
      function throttle( fun, wait ) {
          var lastCalledAt = 0;

          return function() {
             var now = +new Date(),
               context = this;

             if ( now > lastCalledAt + wait ) {
                lastCalledAt = now;
                return fun.apply( context, arguments );
             }
          }
      }

      /**
       * A Frame represents a snapshot of mouse movement at a given time.
       *
       * @param {number} x The x component of the mouse's position.
       * @param {number} y The y component of the mouse's position.
       * @param {number} t The time at which this frame is captured in milliseconds.
       * @param {Frame} lastFrame The previous frame.  This is required to calculate
       *   deltas, displacement, direction, speed and acceleration.
       **/
      function Frame( x, y, t, lastFrame ) {
        this.x = x;
        this.y = y;
        this.t = t;

        if( !lastFrame ) {
          return this;
        }

        this.dx = this.x - lastFrame.x;
        this.dy = this.y - lastFrame.y;
        this.dt = this.t - lastFrame.t;
        // displacement is the same as distance
        this.displacement = Math.sqrt( Math.pow( this.dx, 2 ) + Math.pow( this.dy, 2 ) );
        // direction is given as the number of radians from the positive x axis, whose origin
        // lies on (x, y)
        this.direction = atan2( this.dy, -this.dx );
        // speed is in pixels/ms
        this.speed = this.displacement / this.dt;
        // pixels/ms^2
        this.acceleration = ( this.speed - lastFrame.speed ) / this.dt;
      };

      /**
       * This atan2 function returns the arctangent of the quotient of its arguments,
       * as a numeric value between 0 and 2PI radians.
       *
       * @param {number} y A number representing the y coordinate
       * @param {number} x A number representing the x coordinate
       * @return {number} A number between 0 and 2PI, or NaN if the value(s) are empty
       **/
      function atan2( y, x ) {
        return Math.PI + Math.atan2( y, x );
      }
  };

  $.fn.mousemotion = $.MouseMotion.mousemotion;

})( jQuery );
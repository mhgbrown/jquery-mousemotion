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

      var mm = this;

      /* The number of miliseconds that must pass between executions of the mousemotion handler */
      this.THROTTLE_WAIT = 100;

      /**
       * Attach a mousemove listener to the set of matched elements, which receives both an
       * Event and Frame object.  The Frame object contains information about the mouse's motion.
       *
       * @param {object} eventData
       * @param {function(eventObject, frame)} handler The function to be called when the mousemove event is fired.
       * @param {boolean} If the handler function should be called only after $.MouseMotion.THROTTLE_WAIT miliseconds have elapsed.
       * @return {array} The set of matched elements.
       **/
      this.mousemotion = function( eventData, handler, shouldThrottle ) {
        var lastFrame, proxyHandler;

        if( handler == null ) {
          handler = eventData;
          eventData = null;
        }

        // default to throttling
        if( typeof shouldThrottle === 'undefined' ) {
          shouldThrottle = true;
        }

        proxyHandler = function( event ) {
            var frame = new mm.Frame( event.pageX, event.pageY, +new Date(), lastFrame );
            lastFrame = frame;
            handler.call( this, event, frame );
        };

        return this.mousemove( eventData, shouldThrottle && mm.throttle(proxyHandler, mm.THROTTLE_WAIT) || proxyHandler );
      };

      /**
       * Ensure that a function fun is called no more than once per wait milliseconds.
       *
       * @see http://ryhan.org/post/33374611308/limiting-function-calls
       * @param {function} fun The function to be throttled
       * @param {number} The number of miliseconds that must pass before the next execution
       **/
      this.throttle = function( fun, wait ) {
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
      this.Frame = function( x, y, t, lastFrame ) {
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
        this.direction = mm.atan2( this.dy, -this.dx );
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
      this.atan2 = function( y, x ) {
        return Math.PI + Math.atan2( y, x );
      };
  };

  $.fn.mousemotion = $.MouseMotion.mousemotion;

})( jQuery );
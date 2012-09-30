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

      /**
       * Attach a mousemove listener to the set of matched elements, which receives both an
       * Event and Frame object.  The Frame object contains information about the mouse's motion.
       *
       * @param {object} eventData
       * @param {function(eventObject, frame)} handler The function to be called when the mousemove event is fired.
       * @return {array} The set of matched elements.
       **/
      this.mousemotion = function( eventData, handler ) {
        var lastFrame;

        if( handler == null ) {
          handler = eventData;
          eventData = null;
        }

        return this.mousemove( eventData, function( event ) {
          var frame = new mm.Frame( event.pageX, event.pageY, +new Date(), lastFrame );
          lastFrame = frame;
          return handler.call( this, event, frame );
        });
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
        // direction is given as the number of radians from the positive x axis
        this.direction = mm.atan2( this.dy, -this.dx );
        // speed is in pixels/ms
        this.speed = this.displacement / this.dt;
        // pixels/ms^2
        this.acceleration = ( this.speed - lastFrame.speed ) / this.dt;
      };
  };

  $.fn.mousemotion = $.MouseMotion.mousemotion;

})( jQuery );
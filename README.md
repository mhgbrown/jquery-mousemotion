# JQuery MouseMotion
JQuery MouseMotion adds a event function (mousemotion) whose handler receives more information about the motion of the mouse.  The mousemotion function wraps the mousemove function.

[Check it out on JSFiddle](http://jsfiddle.net/discomfort/GyxmD)

## Usage

	$('#something').mousemotion( function( event, frame ) {
		// do cool stuff!
		// see below for information about frame
	});

## Frame
A Frame has the following properties:

*  **x**: The x component of the mouse's position
*  **y**: The y component of the mouse's position
*  **t**: The time at which this frame was captured
*  **dx**: The x component difference between this frame and the last one
*  **dy**: The y component difference between this frame and the last one
*  **dt**: The time difference in ms between this frame and the last one
*  **displacement**: The distance from this frame to the last one.
*  **direction**: The direction given as the number of radians, 0 to 2 PI, from the positive x axis
*  **speed**: The speed of the mouse in pixels/ms
*  **acceleration**: The acceleration of the mouse in pixels/ms^2

## Future Considerations

*  Fix acceleration
*  Research smoothing
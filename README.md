Pinkness scanner
=================================

Description
-----------

This project is part of a [http://www.freecodecamp.com/challenges/basejump-build-a-pinterest-clone](Freecodecamp.com basejump) assignment I'm working on. My idea was to create Pinkerest, the lrgest collection of (mostly) pink images in the world. When it is completed I will add a link here.

In this project I will focus on scanning an image on it's pinkness. To process an image in JavaScript, it has to be loaded on an HTML canvas. From there scanning the image is pretty simple. Unfortunately, the modern browsers do not allow images from other websites to be loaded on an canvas. This restriction is called 'Cross-Origin resource sharing' (CORS). Read all about it on [https://en.wikipedia.org/wiki/Cross-origin_resource_sharing](Wikipedia).

To bypass the CORS restriction, an image must be loaded from the same origin (server) as the Javascript file that is processing the image. There is an escape for this when the server publishes an HTTP header Access-Control-Allow-Origin: *, but I don't expect I can convince all potential image sources to enable this feature. So I had to go for the same origin option. This project is set to be an example for developers that need to scan images in Javascript. If someone knows an easier way to get this done, please let me know.

So this is how it works.
- User enters the URL of an image (paste).
- Image will be displayed, if the URL is a valid image.
- User can press the Analyze button to start the screening. This will:
	- Pass the URL to the node backend.
	- Node will download the image and store it in the /public directory
	- Afterwards Node will respond with the filename (currently the name does not change)
	- The client will download the image from the local server and replaces the displayed remote image by a local one. Users will not notice this.
	- The analyzer will load the image in an off-screen canvas.
	- The analyzer will scan all pixels for being pink enough and updates a progress bar and a 'pinkness' bar.
	- Finally the image is deleted from the local server.



How to install dependencies:

    $ npm install

How to start:

    $ node server

Open [http://localhost:8080](http://localhost:8080)



CLI based generic server:
----------

Install as a global module

    $ sudo npm install -g spadin/simple-express-static-server

Serve a directory

    $ simple-server my/public/dir

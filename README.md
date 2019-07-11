# Snake

The classic line game.

# VCC's

- 🎮 Change the text and game settings
    * [Open configuration](#~/.koji/customization/settings.json!visual)
- 🖼️ Replace the snake, and food images.
    * [Open configuration](#~/.koji/customization/images.json!visual)
- 🔈 Change the sounds and background music.
    * [Open configuration](#~/.koji/customization/sounds.json!visual)
- 💅 Change the colors and visual style
    * [Open configuration](#~/.koji/customization/colors.json!visual)
- ⚙️ Add your Google Analytics ID and Open Graph information for sharing
    * [Open configuration](#~/.koji/customization/metadata.json!visual)

## Structure
### ~/
This is the main directory
- [index.html](#~/index.html) is the main html file where the game canvas, and overlay elements are declared.
- [index.js](#~/index.js) is the main javascript file where the load, create, and play loop methods are including code for initializing and loading the game.
- [style.css](#~/style.css) this file contains css styles for the game canvas, and overlay elements.

### ~/gamecharacters
This directory contains code for the game characters.
- [Snake: game/characters/snake.js](#~/gamecharacters/snake.js) code for the snake game character.
- [Food: game/characters/food.js](#~/gamecharacters/food.js) code for the food characters.

### ~/gameobjects
This directory contains code base classes like image, sprite, etc.
- [Image: gameobjects/image.js](#~/gameobjects/image.js) a simple images class.

### ~/helpers
This directory contains helper code for utilities and requesting frames.
- [overlay: helpers/overlay.js](#~/helpers/overlay.js) controls the html overlay for displaying game text.
- [animationFrame: helpers/sprite.js](#~/helpers/animationFrame.js) a shim for requestAnimationFrame, the browsers method for asking for a new frame. Browsers request around 60 frames per second depending on resources.
- [utils: helpers/utils.js](#~/helpers/utils.js) a collection of useful functions for making games.

## Support
### Community
If you need any help, you can ask the community by [making a post](https://gokoji.com/posts), or [joining the discord](https://discordapp.com/invite/eQuMJF6).

### Helpful Resources
- [Mozilla Game Development Docs](https://developer.mozilla.org/en-US/docs/Games).
- [HTML5 Game Devs Forum](http://www.html5gamedevs.com/).
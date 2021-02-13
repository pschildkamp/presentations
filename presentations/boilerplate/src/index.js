import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm';

require('reveal.js/css/reveal.scss');

require('themes/pschildkamp/theme.scss');

const deck = new Reveal({
  width: '100%',
  height: '100%',
  plugins: [Markdown],
});

deck.initialize();

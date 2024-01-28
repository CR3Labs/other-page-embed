import { render } from 'preact';
import { OtherPage } from './components/views';

const initEmbeds = () => {
	// render embeds on page
	const nodes = document.querySelectorAll('op-embed');
	for (let i = 0; i < nodes.length; ++i) {
		const wallet = nodes[i].getAttribute('wallet');
		const format = nodes[i].getAttribute('format') as OtherPage.Format;
		const size = nodes[i].getAttribute('size') as OtherPage.Size;
		const clipped = !!nodes[i].getAttribute('clipped');
		render(<OtherPage.Embed wallet={wallet} format={format} size={size} clipped={clipped} />, nodes[i]);
	}
};

// watch page with mutation observer
const observer = new MutationObserver(initEmbeds);
observer.observe(document.body, { attributes: true, childList: true, subtree: true});

// initial page load
initEmbeds();
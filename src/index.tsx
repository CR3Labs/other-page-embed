import { render } from 'preact';

import { useCallback, useEffect, useState } from 'preact/hooks';
import { Logo } from './logo';
import { Layout } from './layout';

import css from './style.module.css';
import clsx from 'clsx';

enum Size {
	Sm = 'sm',
	Md = 'md',
	Lg = 'lg',
};

enum Format {
	Icon = 'icon',
	Avatar = 'avatar',
	Card = 'card',
};

export type RootProps = {
	wallet: string;
	format?: Format;
	size?: Size;
};

interface Account {
	address: string;
	ens: string;
	primary: {
		name: string;
		collectionName: string;
		tokenId: string;
		contract: string;
		image: string;
		imageClipped: string;
	};
}

export function App({ wallet, format, size }: RootProps) {
	const [account, setAccount] = useState<Account>();
	
	const getAccount = useCallback(async () => {
		const response = await fetch(`http://localhost:3000/api/v0/account/${wallet}/embed`);
		const data = await response.json();
		setAccount(data);
		return data;
	}, [wallet])

	useEffect(() => {
		getAccount();
	}, [wallet])

	if (!account) {
		return (<>...</>)
	}

	if (format === 'avatar') {
		return (<Avatar account={account} />)
	}

	if (format === 'card') {
		return (<Card account={account} />)
	}

	return (<Icon account={account} size={size} />)
}

// ------- Icon ------- //

type IconProps = {
	account: Account;
	size?: string;
}

function Icon({ account, size }: IconProps) {
	return (
		<Layout format="icon">
			<a href={`https://app.other.page/u/${account.address}`} target="_blank" className={clsx(css[size || 'md'], css.icon)}>
				<div className={clsx(css.iconLogo)}>
					<Logo dark />
				</div>
			</a>
		</Layout>
	)
}

// ------ Avatar ------ // 

type AvatarProps = {
	account: Account;
	size?: string;
}

function Avatar({ account, size }: AvatarProps) {
	return (
		<Layout format="avatar">
			<a href={`https://app.other.page/u/${account.address}`} target="_blank">
				<div className={clsx(css[size || 'xl2'], css.block, css.relative)}>
					<img src={account.primary.imageClipped} className={clsx(css[size || 'xl2'], css.avatar)} />
					<div className={css.avatarOpLogo}>
						<Logo dark />
					</div>
				</div>
			</a>
		</Layout>
	)
}

// ------ Card ------ // 

type CardProps = {
	account: Account;
	size?: string;
}

function Card({ account }: CardProps) {
	return (
		<Layout format="card">
			<a href={`https://app.other.page/u/${account.address}`} target="_blank" className={css.card}>
				<div>
					<img src={account.primary.imageClipped} className={clsx(css.xl2, css.avatar)} />
				</div>
				<div className={css.cardContent}>
					<div>
						<div className={clsx(css.font, css.subtitle)}>{account.primary.collectionName} #{account.primary.tokenId}</div>
						<div className={clsx(css.font, css.title)}>{account.primary.name}</div>
					</div>
					<div className={clsx(css.font, css.subtitle)}>Owner: {account.ens || account.address}</div>
				</div>
			</a>
		</Layout>
	)
}

// render
const nodes = document.querySelectorAll('op-embed')
for (let i = 0; i < nodes.length; ++i) {
	const wallet = nodes[i].getAttribute('wallet');
	const format = nodes[i].getAttribute('format') as Format;
	const size = nodes[i].getAttribute('size') as Size;
	render(<App wallet={wallet} format={format} size={size} />, nodes[i]);
}

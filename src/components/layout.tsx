import css from '../style.module.css';

type LayoutProps = {
	format: string;
	children?: any;
}

export function Layout({ format, children }: LayoutProps) {
	return (
		<div className={css.block}>
			{children}
		</div>
	)
}
import { useCallback, useEffect, useState } from 'preact/hooks';
import clsx from 'clsx';

import { Logo } from './logo';
import { Layout } from './layout';

import css from '../style.module.css';
import { Address } from './address';
import { API_ENDPOINT } from '../constants';

export namespace OtherPage {

    export enum Size {
        Sm = 'sm',
        Md = 'md',
        Lg = 'lg',
    };

    export enum Format {
        Icon = 'icon',
        Avatar = 'avatar',
        Card = 'card',
    };

    export type RootProps = {
        wallet: string;
        format?: Format;
        size?: Size;
        clipped?: boolean;
        dark?: boolean;
    };

    export interface Account {
        address: string;
        ens: string;
        primary: {
            name: string;
            title: string;
            collectionName: string;
            tokenId: string;
            contract: string;
            image: string;
            imageClipped: string;
        };
    }

    export function Embed({ wallet, format, size, clipped, dark }: RootProps) {
        const [account, setAccount] = useState<Account>();
        
        const getAccount = useCallback(async () => {
            try {
                const response = await fetch(`${API_ENDPOINT}/account/${wallet}/embed`);
                if (response.ok) {
                    const data = await response.json();
                    setAccount(data);
                    return data;
                }
            } catch(err) {}
        }, [wallet])

        useEffect(() => {
            getAccount();
        }, [wallet])

        if (!account) {
            return (<></>)
        }

        if (format === 'avatar') {
            return (<Avatar account={account} clipped={clipped} />)
        }

        if (format === 'card') {
            return (<Card account={account} clipped={clipped} />)
        }

        return (<Icon account={account} size={size} dark={dark} />)
    }

    // ------- Icon ------- //

    export type IconProps = {
        account: Account;
        size?: string;
        dark?: boolean;
    }

    function Icon({ account, size, dark }: IconProps) {
        return (
            <Layout format="icon">
                <a href={`https://other.page/u/${account.address}?utm_source=${window.location.hostname}`} target="_blank" className={clsx(css[size || 'md'], css.icon, dark ? css.iconDark : css.iconLight )}>
                    <div className={clsx(css.iconLogo)}>
                        <Logo dark={dark} />
                    </div>
                </a>
            </Layout>
        )
    }

    // ------ Avatar ------ // 

    export type AvatarProps = {
        account: Account;
        size?: string;
        clipped?: boolean;
        dark?: boolean;
    }

    export function Avatar({ account, size, clipped, dark }: AvatarProps) {
        return (
            <Layout format="avatar">
                <a href={`https://other.page/u/${account.address}?utm_source=${window.location.hostname}`} target="_blank">
                    <div className={clsx(css[size || 'xl2'], css.block, css.relative)}>
                        <img src={clipped ? account.primary.imageClipped : account.primary.image } className={clsx(css[size || 'xl2'], css.avatar)} />
                        
                        <div className={css.avatarOpLogo}>
                            <div className={clsx(css.sm, css.icon)}>
                                <div className={clsx(css.iconLogo)}>
                                    <Logo dark={dark} />
                                </div>
                            </div>
                        </div>
                    </div>
                </a>
            </Layout>
        )
    }

    // ------ Card ------ // 

    export type CardProps = {
        account: Account;
        size?: string;
        clipped?: boolean;
        dark?: boolean;
    }

    export function Card({ account, clipped, dark }: CardProps) {
        return (
            <Layout format="card">
                <a href={`https://other.page/u/${account.address}?utm_source=${window.location.hostname}`} target="_blank" className={clsx(css.card, css.relative)}>
                    <div>
                        <img src={clipped ? account.primary.imageClipped : account.primary.image } className={clsx(css.xl2, css.avatar)} />
                    </div>
                    <div className={css.cardContent}>
                        <div>
                            <div className={clsx(css.font, css.subtitle)}>{account.primary.collectionName} #{account.primary.tokenId}</div>
                            <div className={clsx(css.font, css.title)}>{account.primary.name || 'N/A'}</div>
                        </div>
                        <div className={clsx(css.font, css.text)}>{account.primary.title}</div>
                        <div className={clsx(css.font, css.subtitle)}>
                            Owner: <span style={{ color: 'white' }}>{account.ens || (<Address address={account.address} />)}</span>
                        </div>
                    </div>
                    <div className={css.cardOpLogo}>
                        <div className={clsx(css.sm, css.icon)}>
                            <div className={clsx(css.iconLogo)}>
                                <Logo dark={dark} />
                            </div>
                        </div>
                    </div>
                </a>
            </Layout>
        )
    }

}

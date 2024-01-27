export function Address({ address }) {
    return (<span>{address.slice(0,6)}...{address.slice(-4)}</span>);
}
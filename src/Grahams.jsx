export default function({ bvps, eps }) {
    return bvps && eps && bvps > 0 && eps > 0 ? (Math.sqrt(22.5 * bvps * eps)).toFixed(2) : '';
}
